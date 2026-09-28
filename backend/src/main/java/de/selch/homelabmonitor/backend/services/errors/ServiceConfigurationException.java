package de.selch.homelabmonitor.backend.services.errors;

public class ServiceConfigurationException extends RuntimeException {
    public ServiceConfigurationException(String message, Throwable cause) {
        super(message, cause);
    }
}
