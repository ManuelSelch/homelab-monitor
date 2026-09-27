package de.selch.homelabmonitor.backend.services;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ServicesController {

    @GetMapping("/api/services")
    public List<Service> services() {
        return List.of(
            new Service("nextcloud", "Nextcloud", "Up", "100")
        );
    }

    public record Service(String id, String name, String status, String machineId) {}
}
