package de.selch.homelabmonitor.backend.services;

import de.selch.homelabmonitor.backend.logs.LogEntry;
import de.selch.homelabmonitor.backend.logs.ServiceLogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ServicesController {
    private final ServiceRepository serviceRepository;
    private final ServiceLogService serviceLogService;

    public ServicesController(ServiceRepository serviceRepository, ServiceLogService serviceLogService) {
        this.serviceRepository = serviceRepository;
        this.serviceLogService = serviceLogService;
    }

    @GetMapping("/api/services")
    public List<HomelabService> services() {
        return serviceRepository.findAll();
    }

    @GetMapping("/api/services/{id}/logs")
    public List<LogEntry> logs(@PathVariable String id, @RequestParam(defaultValue = "200") int limit) {
        return serviceLogService.logs(id, limit);
    }
}
