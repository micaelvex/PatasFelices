package com.patasfelices.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "mascotas")
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "refugio_id", nullable = false)
    private Usuario refugio;

    @Column(nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Especie especie;

    private String raza;
    private Integer edadMeses;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Sexo sexo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tamanio tamanio;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String requisitos;

    private boolean vacunado;
    private boolean esterilizado;
    private boolean desparasitado;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "mascota_fotos", joinColumns = @JoinColumn(name = "mascota_id"))
    @Column(name = "foto_path")
    private List<String> fotos;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoMascota estado;

    @Column(nullable = false)
    private LocalDateTime fechaPublicacion;

    public Mascota() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Usuario getRefugio() { return refugio; }
    public void setRefugio(Usuario refugio) { this.refugio = refugio; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Especie getEspecie() { return especie; }
    public void setEspecie(Especie especie) { this.especie = especie; }
    public String getRaza() { return raza; }
    public void setRaza(String raza) { this.raza = raza; }
    public Integer getEdadMeses() { return edadMeses; }
    public void setEdadMeses(Integer edadMeses) { this.edadMeses = edadMeses; }
    public Sexo getSexo() { return sexo; }
    public void setSexo(Sexo sexo) { this.sexo = sexo; }
    public Tamanio getTamanio() { return tamanio; }
    public void setTamanio(Tamanio tamanio) { this.tamanio = tamanio; }
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
    public EstadoMascota getEstado() { return estado; }
    public void setEstado(EstadoMascota estado) { this.estado = estado; }
    public LocalDateTime getFechaPublicacion() { return fechaPublicacion; }
    public void setFechaPublicacion(LocalDateTime fechaPublicacion) { this.fechaPublicacion = fechaPublicacion; }
}
