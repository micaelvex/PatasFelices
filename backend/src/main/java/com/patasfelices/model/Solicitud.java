package com.patasfelices.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes")
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "adoptante_id", nullable = false)
    private Usuario adoptante;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;

    @Column(columnDefinition = "TEXT")
    private String motivacion;

    private boolean tieneExperiencia;

    @Enumerated(EnumType.STRING)
    private TipoVivienda tipoVivienda;

    private boolean hayNinos;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSolicitud estado;

    @Column(nullable = false)
    private LocalDateTime fechaSolicitud;

    public Solicitud() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Usuario getAdoptante() { return adoptante; }
    public void setAdoptante(Usuario adoptante) { this.adoptante = adoptante; }
    public Mascota getMascota() { return mascota; }
    public void setMascota(Mascota mascota) { this.mascota = mascota; }
    public String getMotivacion() { return motivacion; }
    public void setMotivacion(String motivacion) { this.motivacion = motivacion; }
    public boolean isTieneExperiencia() { return tieneExperiencia; }
    public void setTieneExperiencia(boolean tieneExperiencia) { this.tieneExperiencia = tieneExperiencia; }
    public TipoVivienda getTipoVivienda() { return tipoVivienda; }
    public void setTipoVivienda(TipoVivienda tipoVivienda) { this.tipoVivienda = tipoVivienda; }
    public boolean isHayNinos() { return hayNinos; }
    public void setHayNinos(boolean hayNinos) { this.hayNinos = hayNinos; }
    public EstadoSolicitud getEstado() { return estado; }
    public void setEstado(EstadoSolicitud estado) { this.estado = estado; }
    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
}
