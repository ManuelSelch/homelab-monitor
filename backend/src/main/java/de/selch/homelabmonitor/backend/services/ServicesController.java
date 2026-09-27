package de.selch.homelabmonitor.backend.services;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ServicesController {
    private final ServiceRepository serviceRepository;

    public ServicesController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping("/api/services")
    public List<HomelabService> services() {
        return serviceRepository.findAll();
    }
}
