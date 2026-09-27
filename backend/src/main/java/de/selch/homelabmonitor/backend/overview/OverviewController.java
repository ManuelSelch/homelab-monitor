package de.selch.homelabmonitor.backend.overview;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class OverviewController {

    @GetMapping("/api/overview")
    public OverviewResponse overview() {
        var services = List.of(
            new Service("nextcloud", "Nextcloud", "Up")
        );

        return new OverviewResponse(services);
    }

    public record OverviewResponse(List<Service> services) {}

    public record Service(String id, String name, String status) {}
}
