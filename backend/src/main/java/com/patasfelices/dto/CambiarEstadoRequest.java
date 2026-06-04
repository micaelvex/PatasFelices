package com.patasfelices.dto;

import jakarta.validation.constraints.*;

public class CambiarEstadoRequest {
    @NotBlank
    private String estado;

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
