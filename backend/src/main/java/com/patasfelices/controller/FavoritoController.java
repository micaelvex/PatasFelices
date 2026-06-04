package com.patasfelices.controller;

import com.patasfelices.dto.MascotaResponse;
import com.patasfelices.model.Usuario;
import com.patasfelices.repository.UsuarioRepository;
import com.patasfelices.service.FavoritoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;
    private final UsuarioRepository usuarioRepository;

    public FavoritoController(FavoritoService favoritoService, UsuarioRepository usuarioRepository) {
        this.favoritoService = favoritoService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<MascotaResponse>> listar(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(favoritoService.listar(getUsuario(userDetails)));
    }

    @PostMapping("/{mascotaId}")
    public ResponseEntity<Void> agregar(@PathVariable Long mascotaId,
            @AuthenticationPrincipal UserDetails userDetails) {
        favoritoService.agregar(mascotaId, getUsuario(userDetails));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{mascotaId}")
    public ResponseEntity<Void> quitar(@PathVariable Long mascotaId,
            @AuthenticationPrincipal UserDetails userDetails) {
        favoritoService.quitar(mascotaId, getUsuario(userDetails));
        return ResponseEntity.ok().build();
    }

    private Usuario getUsuario(UserDetails userDetails) {
        return usuarioRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }
}
