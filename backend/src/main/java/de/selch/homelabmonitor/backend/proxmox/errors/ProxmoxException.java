package de.selch.homelabmonitor.backend.proxmox.errors;

public class ProxmoxException extends RuntimeException {
    public ProxmoxException(String message) {
        super(message);
    }

    public ProxmoxException(String message, Throwable cause) {
        super(message, cause);
    }
}
