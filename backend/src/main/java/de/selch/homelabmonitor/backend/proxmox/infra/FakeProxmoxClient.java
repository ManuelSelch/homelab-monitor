package de.selch.homelabmonitor.backend.proxmox.infra;

import de.selch.homelabmonitor.backend.proxmox.domain.ProxmoxResource;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("fake")
public class FakeProxmoxClient implements ProxmoxGateway {
    public List<ProxmoxResource> fetchQemuVms() {
        return List.of(
                new ProxmoxResource("300", "Windows 10", "stopped", "vm", 0, 0)
        );
    }

    public List<ProxmoxResource> fetchLxcContainers() {
        return List.of(
                new ProxmoxResource("100", "Container 100", "running", "container", 0.04, 32.1),
                new ProxmoxResource("200", "Container 200", "running", "container", 99.9, 88.8)
        );
    }
}
