package de.selch.homelabmonitor.backend.modules.services;

import de.selch.homelabmonitor.backend.domain.Status;

public record MonitoredService(
    String id,
    String name,
    Status status,
    String machineId,
    LogConfig logs
) {
    public record LogConfig(String source, String selector) {}
}
