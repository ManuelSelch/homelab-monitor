package de.selch.homelabmonitor.backend.proxmox.infra;

import de.selch.homelabmonitor.backend.proxmox.domain.ProxmoxResource;

import java.util.List;

public interface ProxmoxGateway {
    List<ProxmoxResource> fetchVms();
    List<ProxmoxResource> fetchContainers();
}
