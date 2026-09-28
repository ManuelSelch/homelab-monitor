package de.selch.homelabmonitor.backend.logs;

import java.time.Instant;

public record LogEntry(
    Instant timestamp,
    String message
) {}
