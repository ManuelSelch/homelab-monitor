package de.selch.homelabmonitor.backend.machines;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MachinesController {
    private final MachineService machineService;

    public MachinesController(MachineService machineService) {
        this.machineService = machineService;
    }

    @GetMapping("/api/machines")
    public List<Machine> machines() {
        return machineService.machines();
    }
}
