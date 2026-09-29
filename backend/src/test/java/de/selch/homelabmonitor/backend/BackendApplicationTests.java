package de.selch.homelabmonitor.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles(ProfileNames.FAKE)
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }

}
