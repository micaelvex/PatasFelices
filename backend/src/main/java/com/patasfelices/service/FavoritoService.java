package com.patasfelices.service;

import com.patasfelices.dto.MascotaResponse;
import com.patasfelices.model.*;
import com.patasfelices.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final MascotaRepository mascotaRepository;
    private final MascotaService mascotaService;

    public FavoritoService(FavoritoRepository favoritoRepository, MascotaRepository mascotaRepository,
                           MascotaService mascotaService) {
        this.favoritoRepository = favoritoRepository;
        this.mascotaRepository = mascotaRepository;
        this.mascotaService = mascotaService;
    }

    public void agregar(Long mascotaId, Usuario adoptante) {
        if (favoritoRepository.existsByAdoptanteIdAndMascotaId(adoptante.getId(), mascotaId)) return;
        Mascota mascota = mascotaRepository.findById(mascotaId)
                .orElseThrow(() -> new NoSuchElementException("Mascota no encontrada"));
        favoritoRepository.save(new Favorito(adoptante, mascota));
    }

    @Transactional
    public void quitar(Long mascotaId, Usuario adoptante) {
        favoritoRepository.deleteByAdoptanteIdAndMascotaId(adoptante.getId(), mascotaId);
    }

    public List<MascotaResponse> listar(Usuario adoptante) {
        return favoritoRepository.findByAdoptanteId(adoptante.getId()).stream()
                .map(f -> mascotaService.toResponse(f.getMascota(), adoptante.getId()))
                .collect(Collectors.toList());
    }
}
