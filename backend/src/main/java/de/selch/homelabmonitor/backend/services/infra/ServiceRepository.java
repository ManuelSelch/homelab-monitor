package de.selch.homelabmonitor.backend.services.infra;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import de.selch.homelabmonitor.backend.services.HomelabService;
import de.selch.homelabmonitor.backend.services.errors.ServiceConfigurationException;
import de.selch.homelabmonitor.backend.services.errors.ServiceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Repository
public class ServiceRepository {
    private final Path servicesFile;
    private final ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());

    public ServiceRepository(@Value("${services.file:data/services.yaml}") String servicesFile) {
        this.servicesFile = Path.of(servicesFile);
    }

    public List<HomelabService> findAll() {
        if (!Files.exists(servicesFile)) {
            return List.of();
        }

        try {
            var config = yamlMapper.readValue(servicesFile.toFile(), ServicesConfig.class);
            return config.services() == null ? List.of() : config.services();
        } catch (IOException e) {
            throw new ServiceConfigurationException("Could not load services from " + servicesFile, e);
        }
    }

    public  HomelabService find(String id) {
        return findAll().stream()
            .filter(s -> s.id().equals(id))
            .findFirst()
            .orElseThrow(() -> new ServiceNotFoundException(id));
    }

    private record ServicesConfig(List<HomelabService> services) {}
}
