package de.selch.homelabmonitor.backend.modules.proxmox.domain;

public record ProxmoxResource(
    String id,
    String name,
    String status,
    String type,
    double cpuUsage,
    double memoryUsage
) {}
