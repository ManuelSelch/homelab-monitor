package de.selch.homelabmonitor.backend.modules.services.errors;

public class ServiceConfigurationException extends RuntimeException {
    public ServiceConfigurationException(String message, Throwable cause) {
        super(message, cause);
    }
}
