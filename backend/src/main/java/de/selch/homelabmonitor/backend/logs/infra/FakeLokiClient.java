package de.selch.homelabmonitor.backend.logs.infra;

import de.selch.homelabmonitor.backend.ProfileNames;
import de.selch.homelabmonitor.backend.logs.domain.LogEntry;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@Profile(ProfileNames.FAKE)
public class FakeLokiClient implements LokiGateway {
    private List<LogEntry> logs = List.of();

    public FakeLokiClient() {
        // setup fake data
        logs = List.of(
                new LogEntry(Instant.now(), "message A"),
                new LogEntry(Instant.now(), "message B"),
                new LogEntry(Instant.now(), "message C")
        );
    }

    public List<LogEntry> queryLogs(String selector, int limit) {
        return logs;
    }

    public  void givenLogs(List<LogEntry> logs) {
        this.logs = logs;
    }
}
