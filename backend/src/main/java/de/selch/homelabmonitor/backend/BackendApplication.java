package de.selch.homelabmonitor.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

import java.util.Arrays;
import java.util.Optional;

@SpringBootApplication
@ConfigurationPropertiesScan
public class BackendApplication {

    public static void main(String[] args) {
        System.out.println("Starting homelab backend with requested Spring profile(s): " + requestedProfiles(args));

        SpringApplication.run(BackendApplication.class, args);
    }

    private static String requestedProfiles(String[] args) {
        return Optional.ofNullable(profileFromArgs(args))
            .or(() -> Optional.ofNullable(System.getProperty("spring.profiles.active")))
            .or(() -> Optional.ofNullable(System.getenv("SPRING_PROFILES_ACTIVE")))
            .filter(profiles -> !profiles.isBlank())
            .orElse("default");
    }

    private static String profileFromArgs(String[] args) {
        return Arrays.stream(args)
            .filter(arg -> arg.startsWith("--spring.profiles.active="))
            .map(arg -> arg.substring("--spring.profiles.active=".length()))
            .findFirst()
            .orElse(null);
    }
}
