package de.selch.homelabmonitor.backend.modules.logs.infra;

import de.selch.homelabmonitor.backend.modules.logs.domain.LogEntry;

import java.util.List;

public interface LokiGateway {
    List<LogEntry> queryLogs(String selector, int limit);
}
