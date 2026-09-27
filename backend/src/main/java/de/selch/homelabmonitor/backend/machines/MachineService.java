package de.selch.homelabmonitor.backend.machines;

import de.selch.homelabmonitor.backend.proxmox.ProxmoxClient;
import de.selch.homelabmonitor.backend.proxmox.ProxmoxProperties;
import de.selch.homelabmonitor.backend.proxmox.ProxmoxResource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
public class MachineService {
    private final ProxmoxProperties proxmoxProperties;
    private final ProxmoxClient proxmoxClient;

    public MachineService(ProxmoxProperties proxmoxProperties, ProxmoxClient proxmoxClient) {
        this.proxmoxProperties = proxmoxProperties;
        this.proxmoxClient = proxmoxClient;
    }

    public List<Machine> machines() {
        if (!proxmoxProperties.enabled()) {
            return sampleMachines();
        }

        return Stream.concat(
                proxmoxClient.fetchQemuVms().stream(),
                proxmoxClient.fetchLxcContainers().stream()
            )
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

    private static List<Machine> sampleMachines() {
        return List.of(
            new Machine("100", "Homelab", "Up", 12.5, 48.0),
            new Machine("101", "Docker Prod", "Up", 18.2, 62.4)
        );
    }
}
