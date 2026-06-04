package com.patasfelices.controller;

import com.patasfelices.dto.*;
import com.patasfelices.dto.MascotaPage;
import com.patasfelices.model.Usuario;
import com.patasfelices.repository.UsuarioRepository;
import com.patasfelices.service.MascotaService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    private final MascotaService mascotaService;
    private final UsuarioRepository usuarioRepository;

    public MascotaController(MascotaService mascotaService, UsuarioRepository usuarioRepository) {
        this.mascotaService = mascotaService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<MascotaPage> listar(
            @RequestParam(required = false) String especie,
            @RequestParam(required = false) String sexo,
            @RequestParam(required = false) String tamanio,
            @RequestParam(required = false) String distrito,
            @RequestParam(required = false) String nombre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long usuarioId = userDetails != null ? getUsuario(userDetails).getId() : null;
        return ResponseEntity.ok(mascotaService.listar(especie, sexo, tamanio, distrito, nombre, page, size, usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MascotaResponse> obtener(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long usuarioId = userDetails != null ? getUsuario(userDetails).getId() : null;
        return ResponseEntity.ok(mascotaService.obtener(id, usuarioId));
    }

    @GetMapping("/mis-publicaciones")
    public ResponseEntity<List<MascotaResponse>> listarMisPublicaciones(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(mascotaService.listarDelRefugio(getUsuario(userDetails).getId()));
    }

    @PostMapping
    public ResponseEntity<MascotaResponse> crear(@Valid @RequestBody MascotaRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(mascotaService.crear(request, getUsuario(userDetails)));
    }

    @PostMapping("/{id}/fotos")
    public ResponseEntity<MascotaResponse> agregarFoto(@PathVariable Long id,
            @RequestParam("foto") MultipartFile foto,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        return ResponseEntity.ok(mascotaService.agregarFoto(id, foto, getUsuario(userDetails)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MascotaResponse> actualizar(@PathVariable Long id,
            @Valid @RequestBody MascotaRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(mascotaService.actualizar(id, request, getUsuario(userDetails)));
    }

    @PutMapping("/{id}/adoptar")
    public ResponseEntity<MascotaResponse> marcarAdoptada(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(mascotaService.marcarAdoptada(id, getUsuario(userDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        mascotaService.eliminar(id, getUsuario(userDetails));
        return ResponseEntity.noContent().build();
    }

    private Usuario getUsuario(UserDetails userDetails) {
        return usuarioRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }
}
