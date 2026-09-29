package de.selch.homelabmonitor.backend.modules.proxmox.infra;

import de.selch.homelabmonitor.backend.config.ProfileNames;
import de.selch.homelabmonitor.backend.modules.proxmox.domain.ProxmoxResource;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile(ProfileNames.FAKE)
public class FakeProxmoxClient implements ProxmoxGateway {
    private List<ProxmoxResource> vms;
    private List<ProxmoxResource> containers;

    public FakeProxmoxClient() {
        // setup fake data
        vms = List.of(
                new ProxmoxResource("300", "Windows 10", "stopped", "vm", 0, 0)
        );
        containers = List.of(
                new ProxmoxResource("100", "Container 100", "running", "container", 34.5, 32.1),
                new ProxmoxResource("200", "Container 200", "running", "container", 99.9, 88.8)
        );
    }

    public List<ProxmoxResource> fetchVms() {
        return vms;
    }

    public List<ProxmoxResource> fetchContainers() {
        return containers;
    }

    public void reset() {
        vms = List.of();
        containers = List.of();
    }

    public void givenContainers(List<ProxmoxResource> containers) {
        this.containers = containers;
    }
}
