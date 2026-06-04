package com.patasfelices.dto;

import jakarta.validation.constraints.*;

public class MascotaRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    @NotBlank(message = "La especie es obligatoria")
    private String especie;
    private String raza;
    private Integer edadMeses;
    @NotBlank(message = "El sexo es obligatorio")
    private String sexo;
    @NotBlank(message = "El tamanio es obligatorio")
    private String tamanio;
    private String descripcion;
    private String requisitos;
    private boolean vacunado;
    private boolean esterilizado;
    private boolean desparasitado;

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
}
