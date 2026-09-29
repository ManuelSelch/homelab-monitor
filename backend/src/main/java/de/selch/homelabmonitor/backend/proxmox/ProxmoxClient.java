package de.selch.homelabmonitor.backend.proxmox;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;

@Component
@Profile("!fake")
public class ProxmoxClient implements ProxmoxGateway {
    private final ProxmoxProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public ProxmoxClient(ProxmoxProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.httpClient = createHttpClient(properties.insecureSsl());
    }

    public List<ProxmoxResource> fetchQemuVms() {
        return fetchResources("/nodes/" + properties.node() + "/qemu", "vm");
    }

    public List<ProxmoxResource> fetchLxcContainers() {
        return fetchResources("/nodes/" + properties.node() + "/lxc", "container");
    }

    private List<ProxmoxResource> fetchResources(String path, String type) {
        try {
            var request = authorizedGet(path);
            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new ProxmoxException("Proxmox request failed with status " + response.statusCode());
            }
            return parseResources(response.body(), type);
        } catch (IOException e) {
            throw new ProxmoxException("Could not read Proxmox response", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ProxmoxException("Interrupted while calling Proxmox", e);
        }
    }

    private HttpRequest authorizedGet(String path) throws IOException, InterruptedException {
        var builder = HttpRequest.newBuilder(uri(path)).GET();
        if (properties.apiToken() != null && !properties.apiToken().isBlank()) {
            builder.header("Authorization", "PVEAPIToken=" + properties.apiToken());
        } else {
            builder.header("Cookie", "PVEAuthCookie=" + authenticateWithTicket());
        }
        return builder.build();
    }

    private String authenticateWithTicket() throws IOException, InterruptedException {
        if (properties.username() == null || properties.password() == null) {
            throw new ProxmoxException("Configure proxmox.api-token or proxmox.username and proxmox.password");
        }

        var body = "username=" + urlEncode(properties.username()) + "&password=" + urlEncode(properties.password());
        var request = HttpRequest.newBuilder(uri("/access/ticket"))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();

        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            throw new ProxmoxException("Proxmox authentication failed with status " + response.statusCode());
        }

        var root = objectMapper.readTree(response.body());
        return root.path("data").path("ticket").asText();
    }

    private List<ProxmoxResource> parseResources(String body, String type) throws IOException {
        var resources = new ArrayList<ProxmoxResource>();
        JsonNode data = objectMapper.readTree(body).path("data");
        for (JsonNode item : data) {
            long maxMemory = item.path("maxmem").asLong(0);
            long usedMemory = item.path("mem").asLong(0);
            resources.add(new ProxmoxResource(
                item.path("vmid").asText(),
                item.path("name").asText(item.path("vmid").asText()),
                item.path("status").asText("unknown"),
                type,
                item.path("cpu").asDouble(0.0) * 100.0,
                maxMemory == 0 ? 0.0 : (usedMemory * 100.0 / maxMemory)
            ));
        }
        return resources;
    }

    private URI uri(String path) {
        return URI.create(properties.baseUrl().replaceAll("/$", "") + path);
    }

    private static String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private static HttpClient createHttpClient(boolean insecureSsl) {
        if (!insecureSsl) {
            return HttpClient.newHttpClient();
        }
        try {
            TrustManager[] trustAll = {new X509TrustManager() {
                public void checkClientTrusted(X509Certificate[] chain, String authType) {}
                public void checkServerTrusted(X509Certificate[] chain, String authType) {}
                public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
            }};
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustAll, new SecureRandom());
            return HttpClient.newBuilder().sslContext(sslContext).build();
        } catch (NoSuchAlgorithmException | KeyManagementException e) {
            throw new ProxmoxException("Could not create insecure Proxmox HTTP client", e);
        }
    }
}
