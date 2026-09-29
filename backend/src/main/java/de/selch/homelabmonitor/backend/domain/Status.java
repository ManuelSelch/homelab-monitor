package de.selch.homelabmonitor.backend.domain;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Status {
    ONLINE,
    OFFLINE;

    @JsonValue
    public String toJson() {
       return name().toLowerCase();
    }
}
