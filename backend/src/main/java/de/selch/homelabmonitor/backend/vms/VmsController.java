package de.selch.homelabmonitor.backend.vms;

import de.selch.homelabmonitor.backend.machines.Machine;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VmsController {

    @GetMapping("/api/vms")
    public List<Machine> vms() {
        return List.of(
            new Machine("100", "Homelab", "Up", 12.5, 48.0)
        );
    }
}
