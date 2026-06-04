package com.patasfelices.repository;

import com.patasfelices.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    List<Solicitud> findByAdoptanteId(Long adoptanteId);
    List<Solicitud> findByMascotaRefugioId(Long refugioId);
    boolean existsByAdoptanteIdAndMascotaIdAndEstado(Long adoptanteId, Long mascotaId, EstadoSolicitud estado);
}
