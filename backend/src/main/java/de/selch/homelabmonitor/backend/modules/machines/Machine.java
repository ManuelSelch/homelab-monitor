package de.selch.homelabmonitor.backend.modules.machines;

import de.selch.homelabmonitor.backend.domain.Status;

public record Machine(
    String id,
    String name,
    Status status,
    double cpuUsage,
    double memoryUsage
) {}
