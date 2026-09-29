package de.selch.homelabmonitor.backend.logs.infra;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.selch.homelabmonitor.backend.logs.domain.LogEntry;
import de.selch.homelabmonitor.backend.logs.errors.LogFetchException;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
public class LokiClient {
    private final LokiProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public LokiClient(LokiProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    public List<LogEntry> queryLogs(String selector, int limit) {
        try {
            var request = HttpRequest.newBuilder(queryUri(selector, limit)).GET().build();
            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) throw new LogFetchException("Loki request failed with status " + response.statusCode());

            return parseEntries(response.body());
        } catch (IOException e) {
            throw new LogFetchException("Could not read Loki response", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new LogFetchException("Interrupted while calling Loki", e);
        }
    }

    private URI queryUri(String selector, int limit) {
        var baseUrl = properties.baseUrl().replaceAll("/$", "");
        var query = "query=" + urlEncode(selector)
            + "&limit=" + limit
            + "&direction=BACKWARD";
        return URI.create(baseUrl + "/loki/api/v1/query_range?" + query);
    }

    private List<LogEntry> parseEntries(String body) throws IOException {
        var entries = new ArrayList<LogEntry>();
        JsonNode result = objectMapper.readTree(body).path("data").path("result");
        for (JsonNode stream : result) {
            for (JsonNode value : stream.path("values")) {
                entries.add(new LogEntry(
                    parseLokiTimestamp(value.get(0).asText()),
                    value.get(1).asText()
                ));
            }
        }
        entries.sort(Comparator.comparing(LogEntry::timestamp).reversed());
        return entries;
    }

    private static Instant parseLokiTimestamp(String nanoseconds) {
        var epochNanos = Long.parseLong(nanoseconds);
        return Instant.ofEpochSecond(epochNanos / 1_000_000_000L, epochNanos % 1_000_000_000L);
    }

    private static String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
