package de.selch.homelabmonitor.backend;

import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "services.file=src/test/resources/services-with-logs.yaml")
@ActiveProfiles(ProfileNames.FAKE)
@AutoConfigureMockMvc
public class IT_ServiceLogsAPI {
    private static final HttpServer loki = startLoki();

    @Autowired
    private MockMvc mockMvc;

    @DynamicPropertySource
    static void lokiProperties(DynamicPropertyRegistry registry) {
        registry.add("loki.base-url", () -> "http://localhost:" + loki.getAddress().getPort());
    }

    @AfterAll
    static void stopLoki() {
        loki.stop(0);
    }

    @Test
    void returnsServiceLogsFromLoki() throws Exception {
        mockMvc.perform(get("/api/services/nextcloud/logs?limit=50"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].timestamp").value("2026-09-27T17:00:00Z"))
                .andExpect(jsonPath("$[0].message").value("Nextcloud started"));
    }

    @Test
    void returnsNotFoundForUnknownServiceLogs() throws Exception {
        mockMvc.perform(get("/api/services/unknown/logs"))
                .andExpect(status().isNotFound());
    }

    private static HttpServer startLoki() {
        try {
            var server = HttpServer.create(new InetSocketAddress(0), 0);
            server.createContext("/loki/api/v1/query_range", exchange -> {
                var query = exchange.getRequestURI().getRawQuery();
                if (!query.contains("query=%7Bservice%3D%22nextcloud%22%7D")) {
                    exchange.sendResponseHeaders(400, -1);
                    return;
                }

                var body = """
                    {
                      "status": "success",
                      "data": {
                        "resultType": "streams",
                        "result": [
                          {
                            "stream": {"service": "nextcloud"},
                            "values": [["1790528400000000000", "Nextcloud started"]]
                          }
                        ]
                      }
                    }
                    """;
                var bytes = body.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().add("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.close();
            });
            server.start();
            return server;
        } catch (IOException e) {
            throw new IllegalStateException("Could not start fake Loki", e);
        }
    }
}
