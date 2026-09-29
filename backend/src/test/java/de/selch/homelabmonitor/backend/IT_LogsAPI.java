package de.selch.homelabmonitor.backend;

import de.selch.homelabmonitor.backend.logs.domain.LogEntry;
import de.selch.homelabmonitor.backend.logs.infra.FakeLokiClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;

import java.time.Instant;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "services.file=src/test/resources/services-with-logs.yaml")
@ActiveProfiles(ProfileNames.FAKE)
@AutoConfigureMockMvc
public class IT_LogsAPI {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FakeLokiClient loki;

    @Test
    void returnsServiceLogsFromLoki() throws Exception {
        loki.givenLogs(List.of(
                new LogEntry(Instant.parse("2026-09-27T17:00:00Z"), "log A"),
                new LogEntry(Instant.parse("2026-09-27T17:01:00Z"), "log B"),
                new LogEntry(Instant.parse("2026-09-27T17:02:00Z"), "log C")
        ));

        mockMvc.perform(get("/api/services/nextcloud/logs?limit=50"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(containingLogs(
                        log("2026-09-27T17:00:00Z", "log A"),
                        log("2026-09-27T17:01:00Z", "log B"),
                        log("2026-09-27T17:02:00Z", "log C")
                ));
    }

    @Test
    void returnsNotFoundForUnknownServiceLogs() throws Exception {
        mockMvc.perform(get("/api/services/unknown/logs"))
                .andExpect(status().isNotFound());
    }

    private ResultMatcher containingLogs(String... logs) {
        return content().json("""
                [
                    %s
                ]
                """.formatted(String.join(",\n", logs)));
    }

    private String log(String timestamp, String message) {
        return """
                {
                    "timestamp": "%s",
                    "message": "%s"
                }
                """.formatted(timestamp, message);
    }
}
