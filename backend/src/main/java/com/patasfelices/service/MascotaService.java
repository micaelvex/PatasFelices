package com.patasfelices.service;

import com.patasfelices.dto.*;
import com.patasfelices.model.*;
import com.patasfelices.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MascotaService {

    private final MascotaRepository mascotaRepository;
    private final FavoritoRepository favoritoRepository;
    private final FileStorageService fileStorageService;

    public MascotaService(MascotaRepository mascotaRepository, FavoritoRepository favoritoRepository,
                          FileStorageService fileStorageService) {
        this.mascotaRepository = mascotaRepository;
        this.favoritoRepository = favoritoRepository;
        this.fileStorageService = fileStorageService;
    }

    public MascotaResponse crear(MascotaRequest request, Usuario refugio) {
        if (refugio.getRol() != Rol.REFUGIO) {
            throw new SecurityException("Solo los refugios pueden publicar mascotas");
        }
        Mascota mascota = new Mascota();
        mascota.setRefugio(refugio);
        mascota.setNombre(request.getNombre());
        mascota.setEspecie(Especie.valueOf(request.getEspecie().toUpperCase()));
        mascota.setRaza(request.getRaza());
        mascota.setEdadMeses(request.getEdadMeses());
        mascota.setSexo(Sexo.valueOf(request.getSexo().toUpperCase()));
        mascota.setTamanio(Tamanio.valueOf(request.getTamanio().toUpperCase()));
        mascota.setDescripcion(request.getDescripcion());
        mascota.setRequisitos(request.getRequisitos());
        mascota.setVacunado(request.isVacunado());
        mascota.setEsterilizado(request.isEsterilizado());
        mascota.setDesparasitado(request.isDesparasitado());
        mascota.setFotos(new ArrayList<>());
        mascota.setEstado(EstadoMascota.DISPONIBLE);
        mascota.setFechaPublicacion(LocalDateTime.now());
        return toResponse(mascotaRepository.save(mascota), null);
    }

    public MascotaResponse agregarFoto(Long mascotaId, MultipartFile foto, Usuario refugio) throws IOException {
        Mascota mascota = getMascotaDelRefugio(mascotaId, refugio);
        String path = fileStorageService.guardarFoto(foto, "mascotas");
        mascota.getFotos().add(path);
        return toResponse(mascotaRepository.save(mascota), null);
    }

    public MascotaResponse actualizar(Long id, MascotaRequest request, Usuario refugio) {
        Mascota mascota = getMascotaDelRefugio(id, refugio);
        mascota.setNombre(request.getNombre());
        mascota.setEspecie(Especie.valueOf(request.getEspecie().toUpperCase()));
        mascota.setRaza(request.getRaza());
        mascota.setEdadMeses(request.getEdadMeses());
        mascota.setSexo(Sexo.valueOf(request.getSexo().toUpperCase()));
        mascota.setTamanio(Tamanio.valueOf(request.getTamanio().toUpperCase()));
        mascota.setDescripcion(request.getDescripcion());
        mascota.setRequisitos(request.getRequisitos());
        mascota.setVacunado(request.isVacunado());
        mascota.setEsterilizado(request.isEsterilizado());
        mascota.setDesparasitado(request.isDesparasitado());
        return toResponse(mascotaRepository.save(mascota), null);
    }

    public MascotaResponse marcarAdoptada(Long id, Usuario refugio) {
        Mascota mascota = getMascotaDelRefugio(id, refugio);
        mascota.setEstado(EstadoMascota.ADOPTADA);
        return toResponse(mascotaRepository.save(mascota), null);
    }

    public void eliminar(Long id, Usuario refugio) {
        Mascota mascota = getMascotaDelRefugio(id, refugio);
        mascotaRepository.delete(mascota);
    }

    public MascotaPage listar(String especie, String sexo, String tamanio,
                               String distrito, String nombre, int page, int size, Long usuarioId) {
        Specification<Mascota> spec = (root, q, cb) -> cb.equal(root.get("estado"), EstadoMascota.DISPONIBLE);

        if (nombre != null && !nombre.isBlank()) {
            spec = spec.and((root, q, cb) ->
                cb.like(cb.lower(root.get("nombre")), "%" + nombre.toLowerCase() + "%"));
        }
        if (especie != null && !especie.isBlank()) {
            spec = spec.and((root, q, cb) ->
                cb.equal(root.get("especie"), Especie.valueOf(especie.toUpperCase())));
        }
        if (sexo != null && !sexo.isBlank()) {
            spec = spec.and((root, q, cb) ->
                cb.equal(root.get("sexo"), Sexo.valueOf(sexo.toUpperCase())));
        }
        if (tamanio != null && !tamanio.isBlank()) {
            spec = spec.and((root, q, cb) ->
                cb.equal(root.get("tamanio"), Tamanio.valueOf(tamanio.toUpperCase())));
        }
        if (distrito != null && !distrito.isBlank()) {
            spec = spec.and((root, q, cb) ->
                cb.equal(root.get("refugio").get("distrito"), distrito));
        }

        PageRequest pageable = PageRequest.of(page, size, Sort.by("fechaPublicacion").descending());
        Page<Mascota> paginaResult = mascotaRepository.findAll(spec, pageable);

        List<MascotaResponse> content = paginaResult.getContent().stream()
                .map(m -> toResponse(m, usuarioId))
                .collect(Collectors.toList());

        MascotaPage mascotaPage = new MascotaPage();
        mascotaPage.setContent(content);
        mascotaPage.setPaginaActual(page);
        mascotaPage.setTotalPaginas(paginaResult.getTotalPages());
        mascotaPage.setTotalElementos(paginaResult.getTotalElements());
        mascotaPage.setPrimera(paginaResult.isFirst());
        mascotaPage.setUltima(paginaResult.isLast());
        return mascotaPage;
    }

    public MascotaResponse obtener(Long id, Long usuarioId) {
        Mascota mascota = mascotaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Mascota no encontrada"));
        return toResponse(mascota, usuarioId);
    }

    public List<MascotaResponse> listarDelRefugio(Long refugioId) {
        return mascotaRepository.findByRefugioId(refugioId).stream()
                .map(m -> toResponse(m, null))
                .collect(Collectors.toList());
    }

    private Mascota getMascotaDelRefugio(Long mascotaId, Usuario refugio) {
        Mascota mascota = mascotaRepository.findById(mascotaId)
                .orElseThrow(() -> new NoSuchElementException("Mascota no encontrada"));
        if (!mascota.getRefugio().getId().equals(refugio.getId())) {
            throw new SecurityException("No tienes permiso para modificar esta mascota");
        }
        return mascota;
    }

    public MascotaResponse toResponse(Mascota m, Long usuarioId) {
        boolean esFavorito = usuarioId != null &&
                favoritoRepository.existsByAdoptanteIdAndMascotaId(usuarioId, m.getId());
        String refugioNombre = m.getRefugio().getNombreOrganizacion() != null
                ? m.getRefugio().getNombreOrganizacion() : m.getRefugio().getNombre();
        MascotaResponse r = new MascotaResponse();
        r.setId(m.getId());
        r.setNombre(m.getNombre());
        r.setEspecie(m.getEspecie().name());
        r.setRaza(m.getRaza());
        r.setEdadMeses(m.getEdadMeses());
        r.setSexo(m.getSexo().name());
        r.setTamanio(m.getTamanio().name());
        r.setDescripcion(m.getDescripcion());
        r.setRequisitos(m.getRequisitos());
        r.setVacunado(m.isVacunado());
        r.setEsterilizado(m.isEsterilizado());
        r.setDesparasitado(m.isDesparasitado());
        r.setFotos(m.getFotos());
        r.setEstado(m.getEstado().name());
        r.setFechaPublicacion(m.getFechaPublicacion());
        r.setRefugioId(m.getRefugio().getId());
        r.setRefugioNombre(refugioNombre);
        r.setRefugioDistrito(m.getRefugio().getDistrito());
        r.setRefugioTelefono(m.getRefugio().getTelefono());
        r.setEsFavorito(esFavorito);
        return r;
    }
}
