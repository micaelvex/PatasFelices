package com.patasfelices.dto;

public class StatsResponse {
    private long totalUsuarios;
    private long totalAdoptantes;
    private long totalRefugios;
    private long totalMascotas;
    private long mascotasDisponibles;
    private long mascotasAdoptadas;
    private long totalSolicitudes;
    private long solicitudesPendientes;

    public StatsResponse() {}

    public long getTotalUsuarios() { return totalUsuarios; }
    public void setTotalUsuarios(long v) { this.totalUsuarios = v; }
    public long getTotalAdoptantes() { return totalAdoptantes; }
    public void setTotalAdoptantes(long v) { this.totalAdoptantes = v; }
    public long getTotalRefugios() { return totalRefugios; }
    public void setTotalRefugios(long v) { this.totalRefugios = v; }
    public long getTotalMascotas() { return totalMascotas; }
    public void setTotalMascotas(long v) { this.totalMascotas = v; }
    public long getMascotasDisponibles() { return mascotasDisponibles; }
    public void setMascotasDisponibles(long v) { this.mascotasDisponibles = v; }
    public long getMascotasAdoptadas() { return mascotasAdoptadas; }
    public void setMascotasAdoptadas(long v) { this.mascotasAdoptadas = v; }
    public long getTotalSolicitudes() { return totalSolicitudes; }
    public void setTotalSolicitudes(long v) { this.totalSolicitudes = v; }
    public long getSolicitudesPendientes() { return solicitudesPendientes; }
    public void setSolicitudesPendientes(long v) { this.solicitudesPendientes = v; }
}
