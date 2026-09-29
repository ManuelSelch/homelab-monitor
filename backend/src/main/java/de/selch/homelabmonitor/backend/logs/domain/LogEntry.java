package de.selch.homelabmonitor.backend.logs.domain;

import java.time.Instant;

public record LogEntry(
    Instant timestamp,
    String message
) {}
