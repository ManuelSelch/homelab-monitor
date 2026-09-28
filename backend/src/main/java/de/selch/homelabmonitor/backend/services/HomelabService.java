package de.selch.homelabmonitor.backend.services;

public record HomelabService(
    String id,
    String name,
    String status,
    String machineId,
    LogConfig logs
) {
    public record LogConfig(String source, String selector) {}
}
