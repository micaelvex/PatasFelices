package com.patasfelices.controller;

import com.patasfelices.dto.*;
import com.patasfelices.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {
        return ResponseEntity.ok(adminService.listarUsuarios());
    }

    @PutMapping("/usuarios/{id}/toggle-bloqueo")
    public ResponseEntity<UsuarioResponse> toggleBloqueo(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleBloqueo(id));
    }

    @DeleteMapping("/mascotas/{id}")
    public ResponseEntity<Void> eliminarMascota(@PathVariable Long id) {
        adminService.eliminarMascota(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> obtenerStats() {
        return ResponseEntity.ok(adminService.obtenerStats());
    }
}
