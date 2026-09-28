package de.selch.homelabmonitor.backend.logs;

import de.selch.homelabmonitor.backend.services.HomelabService;
import de.selch.homelabmonitor.backend.services.ServiceNotFoundException;
import de.selch.homelabmonitor.backend.services.ServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceLogService {
    private final ServiceRepository serviceRepository;
    private final LokiClient lokiClient;

    public ServiceLogService(ServiceRepository serviceRepository, LokiClient lokiClient) {
        this.serviceRepository = serviceRepository;
        this.lokiClient = lokiClient;
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

        return lokiClient.queryLogs(logs.selector(), limit);
    }
}
