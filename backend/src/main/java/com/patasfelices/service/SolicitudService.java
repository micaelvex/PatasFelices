package com.patasfelices.service;

import com.patasfelices.dto.*;
import com.patasfelices.model.*;
import com.patasfelices.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final MascotaRepository mascotaRepository;
    private final EmailService emailService;

    public SolicitudService(SolicitudRepository solicitudRepository, MascotaRepository mascotaRepository,
                            EmailService emailService) {
        this.solicitudRepository = solicitudRepository;
        this.mascotaRepository = mascotaRepository;
        this.emailService = emailService;
    }

    public SolicitudResponse enviar(SolicitudRequest request, Usuario adoptante) {
        if (adoptante.getRol() != Rol.ADOPTANTE) {
            throw new SecurityException("Solo los adoptantes pueden enviar solicitudes");
        }
        Mascota mascota = mascotaRepository.findById(request.getMascotaId())
                .orElseThrow(() -> new NoSuchElementException("Mascota no encontrada"));
        if (mascota.getEstado() != EstadoMascota.DISPONIBLE) {
            throw new IllegalStateException("Esta mascota ya no esta disponible para adopcion");
        }
        if (solicitudRepository.existsByAdoptanteIdAndMascotaIdAndEstado(
                adoptante.getId(), mascota.getId(), EstadoSolicitud.PENDIENTE)) {
            throw new IllegalStateException("Ya tienes una solicitud pendiente para esta mascota");
        }
        Solicitud solicitud = new Solicitud();
        solicitud.setAdoptante(adoptante);
        solicitud.setMascota(mascota);
        solicitud.setMotivacion(request.getMotivacion());
        solicitud.setTieneExperiencia(request.isTieneExperiencia());
        solicitud.setTipoVivienda(TipoVivienda.valueOf(request.getTipoVivienda().toUpperCase()));
        solicitud.setHayNinos(request.isHayNinos());
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);
        solicitud.setFechaSolicitud(LocalDateTime.now());
        return toResponse(solicitudRepository.save(solicitud));
    }

    public SolicitudResponse cambiarEstado(Long id, String nuevoEstado, Usuario refugio) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Solicitud no encontrada"));
        if (!solicitud.getMascota().getRefugio().getId().equals(refugio.getId())) {
            throw new SecurityException("No tienes permiso para gestionar esta solicitud");
        }
        EstadoSolicitud estado = EstadoSolicitud.valueOf(nuevoEstado.toUpperCase());
        solicitud.setEstado(estado);
        Solicitud guardada = solicitudRepository.save(solicitud);
        emailService.enviarCambioEstadoSolicitud(
                solicitud.getAdoptante().getEmail(),
                solicitud.getAdoptante().getNombre(),
                solicitud.getMascota().getNombre(),
                estado.name());
        return toResponse(guardada);
    }

    public List<SolicitudResponse> listarDelAdoptante(Long adoptanteId) {
        return solicitudRepository.findByAdoptanteId(adoptanteId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<SolicitudResponse> listarDelRefugio(Long refugioId) {
        return solicitudRepository.findByMascotaRefugioId(refugioId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    private SolicitudResponse toResponse(Solicitud s) {
        String fotoMascota = (s.getMascota().getFotos() != null && !s.getMascota().getFotos().isEmpty())
                ? s.getMascota().getFotos().get(0) : null;
        String refugioNombre = s.getMascota().getRefugio().getNombreOrganizacion() != null
                ? s.getMascota().getRefugio().getNombreOrganizacion()
                : s.getMascota().getRefugio().getNombre();
        SolicitudResponse r = new SolicitudResponse();
        r.setId(s.getId());
        r.setMascotaId(s.getMascota().getId());
        r.setMascotaNombre(s.getMascota().getNombre());
        r.setMascotaEspecie(s.getMascota().getEspecie().name());
        r.setMascotaFoto(fotoMascota);
        r.setAdoptanteId(s.getAdoptante().getId());
        r.setAdoptanteNombre(s.getAdoptante().getNombre());
        r.setAdoptanteEmail(s.getAdoptante().getEmail());
        r.setAdoptanteTelefono(s.getAdoptante().getTelefono());
        r.setMotivacion(s.getMotivacion());
        r.setTieneExperiencia(s.isTieneExperiencia());
        r.setTipoVivienda(s.getTipoVivienda() != null ? s.getTipoVivienda().name() : null);
        r.setHayNinos(s.isHayNinos());
        r.setEstado(s.getEstado().name());
        r.setFechaSolicitud(s.getFechaSolicitud());
        r.setRefugioNombre(refugioNombre);
        return r;
    }
}
