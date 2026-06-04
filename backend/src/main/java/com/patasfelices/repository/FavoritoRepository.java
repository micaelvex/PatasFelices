package com.patasfelices.repository;

import com.patasfelices.model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByAdoptanteId(Long adoptanteId);
    boolean existsByAdoptanteIdAndMascotaId(Long adoptanteId, Long mascotaId);
    void deleteByAdoptanteIdAndMascotaId(Long adoptanteId, Long mascotaId);
}
