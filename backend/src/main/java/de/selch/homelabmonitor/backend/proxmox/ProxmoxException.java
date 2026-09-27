package de.selch.homelabmonitor.backend.proxmox;

public class ProxmoxException extends RuntimeException {
    public ProxmoxException(String message) {
        super(message);
    }

    public ProxmoxException(String message, Throwable cause) {
        super(message, cause);
    }
}
