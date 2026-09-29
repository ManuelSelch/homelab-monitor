package de.selch.homelabmonitor.backend.modules.logs.errors;

public class LogLimitExceededException extends RuntimeException {
    public LogLimitExceededException(int value, int max) {
        super("Requested log limit " + value + " exceeds the maximum allowed limit of " + max);
    }
}
