package com.patasfelices.model;

import jakarta.persistence.*;

@Entity
@Table(name = "favoritos", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"adoptante_id", "mascota_id"})
})
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "adoptante_id", nullable = false)
    private Usuario adoptante;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;

    public Favorito() {}

    public Favorito(Usuario adoptante, Mascota mascota) {
        this.adoptante = adoptante;
        this.mascota = mascota;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Usuario getAdoptante() { return adoptante; }
    public void setAdoptante(Usuario adoptante) { this.adoptante = adoptante; }
    public Mascota getMascota() { return mascota; }
    public void setMascota(Mascota mascota) { this.mascota = mascota; }
}
