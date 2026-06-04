package com.patasfelices.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);
    private static final Set<String> EXTENSIONES_VALIDAS = Set.of("jpg", "jpeg", "png", "webp");
    private static final long MAX_SIZE = 5 * 1024 * 1024;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String guardarFoto(MultipartFile file, String subdir) throws IOException {
        if (file.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("La imagen no puede superar los 5 MB");
        }
        String extension = getExtension(file.getOriginalFilename());
        if (!EXTENSIONES_VALIDAS.contains(extension)) {
            throw new IllegalArgumentException("Solo se permiten imagenes JPG, PNG o WebP");
        }
        Path dirPath = Paths.get(uploadDir, subdir);
        Files.createDirectories(dirPath);
        String filename = UUID.randomUUID() + "." + extension;
        Files.copy(file.getInputStream(), dirPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        return subdir + "/" + filename;
    }

    public void eliminarFoto(String relativePath) {
        try {
            Files.deleteIfExists(Paths.get(uploadDir, relativePath));
        } catch (IOException e) {
            log.warn("No se pudo eliminar el archivo: {}", relativePath);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
