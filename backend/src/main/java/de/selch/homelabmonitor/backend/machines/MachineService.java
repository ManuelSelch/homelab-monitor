package de.selch.homelabmonitor.backend.machines;

import de.selch.homelabmonitor.backend.proxmox.ProxmoxGateway;
import de.selch.homelabmonitor.backend.proxmox.ProxmoxResource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
public class MachineService {
    private final ProxmoxGateway proxmox;

    public MachineService(ProxmoxGateway proxmox) {
        this.proxmox = proxmox;
    }

    public List<Machine> machines() {
        return Stream.concat(proxmox.fetchQemuVms().stream(), proxmox.fetchLxcContainers().stream())
            .map(MachineService::toMachine)
            .toList();
    }

    private static Machine toMachine(ProxmoxResource resource) {
        return new Machine(
            resource.id(),
            resource.name(),
            normalizeStatus(resource.status()),
            resource.cpuUsage(),
            resource.memoryUsage()
        );
    }

    private static String normalizeStatus(String status) {
        return switch (status.toLowerCase()) {
            case "running" -> "Up";
            case "stopped" -> "Down";
            default -> status;
        };
    }
}
