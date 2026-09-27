package de.selch.homelabmonitor.backend.machines;

public record Machine(
    String id,
    String name,
    String status,
    double cpuUsage,
    double memoryUsage
) {}
