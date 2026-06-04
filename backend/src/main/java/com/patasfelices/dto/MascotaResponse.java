package com.patasfelices.dto;

import java.time.LocalDateTime;
import java.util.List;

public class MascotaResponse {
    private Long id;
    private String nombre;
    private String especie;
    private String raza;
    private Integer edadMeses;
    private String sexo;
    private String tamanio;
    private String descripcion;
    private String requisitos;
    private boolean vacunado;
    private boolean esterilizado;
    private boolean desparasitado;
    private List<String> fotos;
    private String estado;
    private LocalDateTime fechaPublicacion;
    private Long refugioId;
    private String refugioNombre;
    private String refugioDistrito;
    private String refugioTelefono;
    private boolean esFavorito;

    public MascotaResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }
    public String getRaza() { return raza; }
    public void setRaza(String raza) { this.raza = raza; }
    public Integer getEdadMeses() { return edadMeses; }
    public void setEdadMeses(Integer edadMeses) { this.edadMeses = edadMeses; }
    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }
    public String getTamanio() { return tamanio; }
    public void setTamanio(String tamanio) { this.tamanio = tamanio; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getRequisitos() { return requisitos; }
    public void setRequisitos(String requisitos) { this.requisitos = requisitos; }
    public boolean isVacunado() { return vacunado; }
    public void setVacunado(boolean vacunado) { this.vacunado = vacunado; }
    public boolean isEsterilizado() { return esterilizado; }
    public void setEsterilizado(boolean esterilizado) { this.esterilizado = esterilizado; }
    public boolean isDesparasitado() { return desparasitado; }
    public void setDesparasitado(boolean desparasitado) { this.desparasitado = desparasitado; }
    public List<String> getFotos() { return fotos; }
    public void setFotos(List<String> fotos) { this.fotos = fotos; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFechaPublicacion() { return fechaPublicacion; }
    public void setFechaPublicacion(LocalDateTime fechaPublicacion) { this.fechaPublicacion = fechaPublicacion; }
    public Long getRefugioId() { return refugioId; }
    public void setRefugioId(Long refugioId) { this.refugioId = refugioId; }
    public String getRefugioNombre() { return refugioNombre; }
    public void setRefugioNombre(String refugioNombre) { this.refugioNombre = refugioNombre; }
    public String getRefugioDistrito() { return refugioDistrito; }
    public void setRefugioDistrito(String refugioDistrito) { this.refugioDistrito = refugioDistrito; }
    public String getRefugioTelefono() { return refugioTelefono; }
    public void setRefugioTelefono(String refugioTelefono) { this.refugioTelefono = refugioTelefono; }
    public boolean isEsFavorito() { return esFavorito; }
    public void setEsFavorito(boolean esFavorito) { this.esFavorito = esFavorito; }
}
