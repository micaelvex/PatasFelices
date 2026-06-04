package com.patasfelices.service;

import com.patasfelices.dto.*;
import com.patasfelices.model.Usuario;
import com.patasfelices.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PerfilService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    public PerfilService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                         FileStorageService fileStorageService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
    }

    public UsuarioResponse obtener(Usuario usuario) {
        return toResponse(usuario);
    }

    public UsuarioResponse actualizar(PerfilUpdateRequest request, Usuario usuario) {
        if (request.getNombre() != null && !request.getNombre().isBlank()) usuario.setNombre(request.getNombre());
        if (request.getTelefono() != null) usuario.setTelefono(request.getTelefono());
        if (request.getNombreOrganizacion() != null) usuario.setNombreOrganizacion(request.getNombreOrganizacion());
        if (request.getDistrito() != null) usuario.setDistrito(request.getDistrito());
        return toResponse(usuarioRepository.save(usuario));
    }

    public void cambiarPassword(CambiarPasswordRequest request, Usuario usuario) {
        if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
            throw new IllegalArgumentException("La contrasena actual es incorrecta");
        }
        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));
        usuarioRepository.save(usuario);
    }

    public UsuarioResponse actualizarFoto(MultipartFile foto, Usuario usuario) throws IOException {
        if (usuario.getFotoPerfil() != null) fileStorageService.eliminarFoto(usuario.getFotoPerfil());
        String path = fileStorageService.guardarFoto(foto, "perfiles");
        usuario.setFotoPerfil(path);
        return toResponse(usuarioRepository.save(usuario));
    }

    private UsuarioResponse toResponse(Usuario u) {
        UsuarioResponse r = new UsuarioResponse();
        r.setId(u.getId());
        r.setNombre(u.getNombre());
        r.setEmail(u.getEmail());
        r.setTelefono(u.getTelefono());
        r.setRol(u.getRol().name());
        r.setEstado(u.getEstado().name());
        r.setFotoPerfil(u.getFotoPerfil());
        r.setFechaRegistro(u.getFechaRegistro());
        r.setNombreOrganizacion(u.getNombreOrganizacion());
        r.setDistrito(u.getDistrito());
        return r;
    }
}
