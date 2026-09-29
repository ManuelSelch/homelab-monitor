package de.selch.homelabmonitor.backend;

import de.selch.homelabmonitor.backend.proxmox.domain.ProxmoxResource;
import de.selch.homelabmonitor.backend.proxmox.infra.FakeProxmoxClient;
import de.selch.homelabmonitor.backend.proxmox.infra.ProxmoxGateway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("fake")
@AutoConfigureMockMvc
public class IT_MachinesAPI {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FakeProxmoxClient proxmox;

    @BeforeEach
    void setup() {
        proxmox.reset();
        proxmox.givenContainers(List.of(
                new ProxmoxResource("100", "Homelab", "running", "container", 12.3, 45.6)
        ));
    }

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
