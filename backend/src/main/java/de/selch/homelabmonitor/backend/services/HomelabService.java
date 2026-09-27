package de.selch.homelabmonitor.backend.services;

public record HomelabService(
    String id,
    String name,
    String status,
    String machineId
) {}
