package de.selch.homelabmonitor.backend.modules.logs.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UnsupportedLogSourceException extends RuntimeException {
    public UnsupportedLogSourceException(String serviceId, String source) {
        super("Unsupported log source for service " + serviceId + ": " + source);
    }
}
