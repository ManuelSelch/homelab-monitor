package de.selch.homelabmonitor.backend.proxmox;

import java.util.List;

public interface ProxmoxGateway {
    List<ProxmoxResource> fetchQemuVms();
    List<ProxmoxResource> fetchLxcContainers();
}
