package de.selch.homelabmonitor.backend.modules.machines;

import de.selch.homelabmonitor.backend.domain.Status;
import de.selch.homelabmonitor.backend.modules.proxmox.infra.ProxmoxGateway;
import de.selch.homelabmonitor.backend.modules.proxmox.domain.ProxmoxResource;
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
        return Stream.concat(proxmox.fetchVms().stream(), proxmox.fetchContainers().stream())
            .map(MachineService::toMachine)
            .toList();
    }

    private static Machine toMachine(ProxmoxResource resource) {
        return new Machine(
            resource.id(),
            resource.name(),
            toStatus(resource.status()),
            resource.cpuUsage(),
            resource.memoryUsage()
        );
    }

    private static Status toStatus(String status) {
        return switch (status.toLowerCase()) {
            case "running" -> Status.ONLINE;
            case "stopped" -> Status.OFFLINE;
            default -> throw new RuntimeException("unknown Proxmox machine status to parse: " + status);
        };
    }
}
