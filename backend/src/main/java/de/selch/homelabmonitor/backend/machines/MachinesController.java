package de.selch.homelabmonitor.backend.machines;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MachinesController {

    @GetMapping("/api/machines")
    public List<Machine> machines() {
        return List.of(
            new Machine("100", "Homelab", "Up", 12.5, 48.0),
            new Machine("101", "Docker Prod", "Up", 18.2, 62.4)
        );
    }
}
