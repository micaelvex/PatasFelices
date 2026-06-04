package com.patasfelices.service;

import com.patasfelices.dto.*;
import com.patasfelices.model.*;
import com.patasfelices.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final MascotaRepository mascotaRepository;
    private final SolicitudRepository solicitudRepository;

    public AdminService(UsuarioRepository usuarioRepository, MascotaRepository mascotaRepository,
                        SolicitudRepository solicitudRepository) {
        this.usuarioRepository = usuarioRepository;
        this.mascotaRepository = mascotaRepository;
        this.solicitudRepository = solicitudRepository;
    }

    public List<UsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::toUsuarioResponse).collect(Collectors.toList());
    }

    public UsuarioResponse toggleBloqueo(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));
        usuario.setEstado(usuario.getEstado() == EstadoCuenta.ACTIVO ? EstadoCuenta.BLOQUEADO : EstadoCuenta.ACTIVO);
        return toUsuarioResponse(usuarioRepository.save(usuario));
    }

    public void eliminarMascota(Long id) {
        if (!mascotaRepository.existsById(id)) throw new NoSuchElementException("Mascota no encontrada");
        mascotaRepository.deleteById(id);
    }

    public StatsResponse obtenerStats() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Mascota> mascotas = mascotaRepository.findAll();
        List<Solicitud> solicitudes = solicitudRepository.findAll();
        StatsResponse stats = new StatsResponse();
        stats.setTotalUsuarios(usuarios.size());
        stats.setTotalAdoptantes(usuarios.stream().filter(u -> u.getRol() == Rol.ADOPTANTE).count());
        stats.setTotalRefugios(usuarios.stream().filter(u -> u.getRol() == Rol.REFUGIO).count());
        stats.setTotalMascotas(mascotas.size());
        stats.setMascotasDisponibles(mascotas.stream().filter(m -> m.getEstado() == EstadoMascota.DISPONIBLE).count());
        stats.setMascotasAdoptadas(mascotas.stream().filter(m -> m.getEstado() == EstadoMascota.ADOPTADA).count());
        stats.setTotalSolicitudes(solicitudes.size());
        stats.setSolicitudesPendientes(solicitudes.stream().filter(s -> s.getEstado() == EstadoSolicitud.PENDIENTE).count());
        return stats;
    }

    private UsuarioResponse toUsuarioResponse(Usuario u) {
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
