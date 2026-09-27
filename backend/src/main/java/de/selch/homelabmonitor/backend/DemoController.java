package de.selch.homelabmonitor.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

    @GetMapping("/api/demo")
    public DemoResponse demo() {
        return new DemoResponse("Hello World");
    }

    public record DemoResponse(String message) {}
}
