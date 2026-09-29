package de.selch.homelabmonitor.backend.logs;

import de.selch.homelabmonitor.backend.logs.domain.LogEntry;
import de.selch.homelabmonitor.backend.logs.errors.LogLimitExceededException;
import de.selch.homelabmonitor.backend.logs.errors.UnsupportedLogSourceException;
import de.selch.homelabmonitor.backend.logs.infra.LokiGateway;
import de.selch.homelabmonitor.backend.services.infra.ServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {
    private final ServiceRepository serviceRepository;
    private final LokiGateway loki;

    public LogService(ServiceRepository serviceRepository, LokiGateway loki) {
        this.serviceRepository = serviceRepository;
        this.loki = loki;
    }

    public List<LogEntry> logs(String serviceId, int limit) {
        var service = serviceRepository.find(serviceId);
        var logs = service.logs();

        if (logs == null || logs.source() == null || logs.selector() == null || logs.selector().isBlank())
            return List.of();

        if (!logs.source().equalsIgnoreCase("loki"))
            throw new UnsupportedLogSourceException(service.id(), logs.source());

        if(limit > 1000)
            throw new LogLimitExceededException(limit, 1000);

        return loki.queryLogs(logs.selector(), limit);
    }
}
