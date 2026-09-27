package de.selch.homelabmonitor.backend.vms;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VmsController {

    @GetMapping("/api/vms")
    public List<Vm> vms() {
        return List.of(
            new Vm("100", "Homelab", 12.5, 48.0)
        );
    }

    public record Vm(String id, String name, double cpuUsage, double memoryUsage) {}
}
