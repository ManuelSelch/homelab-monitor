package de.selch.homelabmonitor.backend.proxmox.domain;

public record ProxmoxResource(
    String id,
    String name,
    String status,
    String type,
    double cpuUsage,
    double memoryUsage
) {}
