package com.patasfelices.dto;

import jakarta.validation.constraints.*;

public class ResetPasswordRequest {
    @NotBlank
    private String token;
    @NotBlank @Size(min = 6)
    private String nuevaPassword;
    @NotBlank
    private String confirmarPassword;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getNuevaPassword() { return nuevaPassword; }
    public void setNuevaPassword(String nuevaPassword) { this.nuevaPassword = nuevaPassword; }
    public String getConfirmarPassword() { return confirmarPassword; }
    public void setConfirmarPassword(String confirmarPassword) { this.confirmarPassword = confirmarPassword; }
}
