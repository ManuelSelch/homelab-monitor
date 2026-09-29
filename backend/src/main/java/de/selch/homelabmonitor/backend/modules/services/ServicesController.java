package de.selch.homelabmonitor.backend.modules.services;

import de.selch.homelabmonitor.backend.modules.logs.domain.LogEntry;
import de.selch.homelabmonitor.backend.modules.logs.LogService;
import de.selch.homelabmonitor.backend.modules.services.infra.ServiceRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ServicesController {
    private final ServiceRepository serviceRepository;
    private final LogService logService;

    public ServicesController(ServiceRepository serviceRepository, LogService logService) {
        this.serviceRepository = serviceRepository;
        this.logService = logService;
    }

    @GetMapping("/api/services")
    public List<MonitoredService> services() {
        return serviceRepository.findAll();
    }

    @GetMapping("/api/services/{id}/logs")
    public List<LogEntry> logs(@PathVariable String id, @RequestParam(defaultValue = "200") int limit) {
        return logService.logs(id, limit);
    }
}
