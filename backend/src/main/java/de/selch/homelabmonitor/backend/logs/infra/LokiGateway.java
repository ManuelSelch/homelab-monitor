package de.selch.homelabmonitor.backend.logs.infra;

import de.selch.homelabmonitor.backend.logs.domain.LogEntry;

import java.util.List;

public interface LokiGateway {
    List<LogEntry> queryLogs(String selector, int limit);
}
