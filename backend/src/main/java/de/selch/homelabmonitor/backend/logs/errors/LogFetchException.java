package de.selch.homelabmonitor.backend.logs.errors;

public class LogFetchException extends RuntimeException {
    public LogFetchException(String message) {
        super(message);
    }

    public LogFetchException(String message, Throwable cause) {
        super(message, cause);
    }
}
