package com.patasfelices.repository;

import com.patasfelices.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface MascotaRepository extends JpaRepository<Mascota, Long>, JpaSpecificationExecutor<Mascota> {
    List<Mascota> findByRefugioId(Long refugioId);
}
