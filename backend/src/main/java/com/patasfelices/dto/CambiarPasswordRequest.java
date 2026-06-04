package com.patasfelices.dto;

import jakarta.validation.constraints.*;

public class CambiarPasswordRequest {
    @NotBlank
    private String passwordActual;
    @NotBlank @Size(min = 6)
    private String nuevaPassword;

    public String getPasswordActual() { return passwordActual; }
    public void setPasswordActual(String passwordActual) { this.passwordActual = passwordActual; }
    public String getNuevaPassword() { return nuevaPassword; }
    public void setNuevaPassword(String nuevaPassword) { this.nuevaPassword = nuevaPassword; }
}
