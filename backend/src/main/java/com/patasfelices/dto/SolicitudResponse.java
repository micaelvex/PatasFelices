package com.patasfelices.dto;

import java.time.LocalDateTime;

public class SolicitudResponse {
    private Long id;
    private Long mascotaId;
    private String mascotaNombre;
    private String mascotaEspecie;
    private String mascotaFoto;
    private Long adoptanteId;
    private String adoptanteNombre;
    private String adoptanteEmail;
    private String adoptanteTelefono;
    private String motivacion;
    private boolean tieneExperiencia;
    private String tipoVivienda;
    private boolean hayNinos;
    private String estado;
    private LocalDateTime fechaSolicitud;
    private String refugioNombre;

    public SolicitudResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMascotaId() { return mascotaId; }
    public void setMascotaId(Long mascotaId) { this.mascotaId = mascotaId; }
    public String getMascotaNombre() { return mascotaNombre; }
    public void setMascotaNombre(String mascotaNombre) { this.mascotaNombre = mascotaNombre; }
    public String getMascotaEspecie() { return mascotaEspecie; }
    public void setMascotaEspecie(String mascotaEspecie) { this.mascotaEspecie = mascotaEspecie; }
    public String getMascotaFoto() { return mascotaFoto; }
    public void setMascotaFoto(String mascotaFoto) { this.mascotaFoto = mascotaFoto; }
    public Long getAdoptanteId() { return adoptanteId; }
    public void setAdoptanteId(Long adoptanteId) { this.adoptanteId = adoptanteId; }
    public String getAdoptanteNombre() { return adoptanteNombre; }
    public void setAdoptanteNombre(String adoptanteNombre) { this.adoptanteNombre = adoptanteNombre; }
    public String getAdoptanteEmail() { return adoptanteEmail; }
    public void setAdoptanteEmail(String adoptanteEmail) { this.adoptanteEmail = adoptanteEmail; }
    public String getAdoptanteTelefono() { return adoptanteTelefono; }
    public void setAdoptanteTelefono(String adoptanteTelefono) { this.adoptanteTelefono = adoptanteTelefono; }
    public String getMotivacion() { return motivacion; }
    public void setMotivacion(String motivacion) { this.motivacion = motivacion; }
    public boolean isTieneExperiencia() { return tieneExperiencia; }
    public void setTieneExperiencia(boolean tieneExperiencia) { this.tieneExperiencia = tieneExperiencia; }
    public String getTipoVivienda() { return tipoVivienda; }
    public void setTipoVivienda(String tipoVivienda) { this.tipoVivienda = tipoVivienda; }
    public boolean isHayNinos() { return hayNinos; }
    public void setHayNinos(boolean hayNinos) { this.hayNinos = hayNinos; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
    public String getRefugioNombre() { return refugioNombre; }
    public void setRefugioNombre(String refugioNombre) { this.refugioNombre = refugioNombre; }
}
