package com.patasfelices.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    @NotBlank @Email(message = "Correo invalido")
    private String email;
    @NotBlank @Size(min = 6, message = "La contrasena debe tener al menos 6 caracteres")
    private String password;
    @NotBlank(message = "El telefono es obligatorio")
    private String telefono;
    @NotBlank(message = "El rol es obligatorio")
    private String rol;
    private String nombreOrganizacion;
    private String distrito;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getNombreOrganizacion() { return nombreOrganizacion; }
    public void setNombreOrganizacion(String n) { this.nombreOrganizacion = n; }
    public String getDistrito() { return distrito; }
    public void setDistrito(String distrito) { this.distrito = distrito; }
}
