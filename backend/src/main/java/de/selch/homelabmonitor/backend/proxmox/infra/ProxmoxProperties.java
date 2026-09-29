package de.selch.homelabmonitor.backend.proxmox.infra;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "proxmox")
public record ProxmoxProperties(
    boolean enabled,
    String baseUrl,
    String node,
    String username,
    String password,
    String apiToken,
    boolean insecureSsl
) {
    public ProxmoxProperties {
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "https://localhost:8006/api2/json";
        }
        if (node == null || node.isBlank()) {
            node = "pve";
        }
    }
}
