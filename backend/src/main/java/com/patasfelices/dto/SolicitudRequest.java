package com.patasfelices.dto;

import jakarta.validation.constraints.*;

public class SolicitudRequest {
    @NotNull(message = "La mascota es obligatoria")
    private Long mascotaId;
    @NotBlank(message = "La motivacion es obligatoria")
    private String motivacion;
    private boolean tieneExperiencia;
    @NotBlank(message = "El tipo de vivienda es obligatorio")
    private String tipoVivienda;
    private boolean hayNinos;

    public Long getMascotaId() { return mascotaId; }
    public void setMascotaId(Long mascotaId) { this.mascotaId = mascotaId; }
    public String getMotivacion() { return motivacion; }
    public void setMotivacion(String motivacion) { this.motivacion = motivacion; }
    public boolean isTieneExperiencia() { return tieneExperiencia; }
    public void setTieneExperiencia(boolean tieneExperiencia) { this.tieneExperiencia = tieneExperiencia; }
    public String getTipoVivienda() { return tipoVivienda; }
    public void setTipoVivienda(String tipoVivienda) { this.tipoVivienda = tipoVivienda; }
    public boolean isHayNinos() { return hayNinos; }
    public void setHayNinos(boolean hayNinos) { this.hayNinos = hayNinos; }
}
