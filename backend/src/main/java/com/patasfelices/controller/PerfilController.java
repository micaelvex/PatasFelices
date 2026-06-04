package com.patasfelices.controller;

import com.patasfelices.dto.*;
import com.patasfelices.model.Usuario;
import com.patasfelices.repository.UsuarioRepository;
import com.patasfelices.service.PerfilService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    private final PerfilService perfilService;
    private final UsuarioRepository usuarioRepository;

    public PerfilController(PerfilService perfilService, UsuarioRepository usuarioRepository) {
        this.perfilService = perfilService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<UsuarioResponse> obtener(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(perfilService.obtener(getUsuario(userDetails)));
    }

    @PutMapping
    public ResponseEntity<UsuarioResponse> actualizar(@RequestBody PerfilUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(perfilService.actualizar(request, getUsuario(userDetails)));
    }

    @PutMapping("/password")
    public ResponseEntity<String> cambiarPassword(@Valid @RequestBody CambiarPasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        perfilService.cambiarPassword(request, getUsuario(userDetails));
        return ResponseEntity.ok("Contrasena actualizada correctamente");
    }

    @PostMapping("/foto")
    public ResponseEntity<UsuarioResponse> actualizarFoto(@RequestParam("foto") MultipartFile foto,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        return ResponseEntity.ok(perfilService.actualizarFoto(foto, getUsuario(userDetails)));
    }

    private Usuario getUsuario(UserDetails userDetails) {
        return usuarioRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }
}
