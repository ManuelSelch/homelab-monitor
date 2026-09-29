package de.selch.homelabmonitor.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("fake")
@AutoConfigureMockMvc
public class IT_MachinesAPI {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsHomelabMachines() throws Exception {
        mockMvc.perform(get("/api/machines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[*].id", hasItem("100")))
                .andExpect(jsonPath("$[*].name", hasItem("Homelab")))
                .andExpect(jsonPath("$[*].status", hasItem("Up")))
                .andExpect(jsonPath("$[0].cpuUsage").isNumber())
                .andExpect(jsonPath("$[0].memoryUsage").isNumber());
    }
}
