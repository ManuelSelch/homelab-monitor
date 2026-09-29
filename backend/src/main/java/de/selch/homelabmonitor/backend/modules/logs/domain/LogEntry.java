package de.selch.homelabmonitor.backend.modules.logs.domain;

import java.time.Instant;

public record LogEntry(
    Instant timestamp,
    String message
) {}
