package de.selch.homelabmonitor.backend.logs;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "loki")
public record LokiProperties(String baseUrl) {
    public LokiProperties {
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "http://localhost:3100";
        }
    }
}
