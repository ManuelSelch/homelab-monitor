package de.selch.homelabmonitor.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class IT_ServicesAPI {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsHomelabServices() throws Exception {
        mockMvc.perform(get("/api/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[*].id",      hasItem("nextcloud")))
                .andExpect(jsonPath("$[*].name",    hasItem("Nextcloud")))
                .andExpect(jsonPath("$[*].status",  hasItem("Up")))
                .andExpect(jsonPath("$[*].vmId",    hasItem("100")));
    }
}
