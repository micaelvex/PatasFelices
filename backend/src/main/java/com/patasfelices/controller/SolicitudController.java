package com.patasfelices.controller;

import com.patasfelices.dto.*;
import com.patasfelices.model.Usuario;
import com.patasfelices.repository.UsuarioRepository;
import com.patasfelices.service.SolicitudService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private final SolicitudService solicitudService;
    private final UsuarioRepository usuarioRepository;

    public SolicitudController(SolicitudService solicitudService, UsuarioRepository usuarioRepository) {
        this.solicitudService = solicitudService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<SolicitudResponse> enviar(@Valid @RequestBody SolicitudRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(solicitudService.enviar(request, getUsuario(userDetails)));
    }

    @GetMapping("/mis-solicitudes")
    public ResponseEntity<List<SolicitudResponse>> listarMias(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(solicitudService.listarDelAdoptante(getUsuario(userDetails).getId()));
    }

    @GetMapping("/recibidas")
    public ResponseEntity<List<SolicitudResponse>> listarRecibidas(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(solicitudService.listarDelRefugio(getUsuario(userDetails).getId()));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<SolicitudResponse> cambiarEstado(@PathVariable Long id,
            @Valid @RequestBody CambiarEstadoRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(solicitudService.cambiarEstado(id, request.getEstado(), getUsuario(userDetails)));
    }

    private Usuario getUsuario(UserDetails userDetails) {
        return usuarioRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }
}
