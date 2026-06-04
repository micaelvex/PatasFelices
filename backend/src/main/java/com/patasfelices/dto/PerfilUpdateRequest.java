package com.patasfelices.dto;

public class PerfilUpdateRequest {
    private String nombre;
    private String telefono;
    private String nombreOrganizacion;
    private String distrito;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getNombreOrganizacion() { return nombreOrganizacion; }
    public void setNombreOrganizacion(String n) { this.nombreOrganizacion = n; }
    public String getDistrito() { return distrito; }
    public void setDistrito(String distrito) { this.distrito = distrito; }
}
