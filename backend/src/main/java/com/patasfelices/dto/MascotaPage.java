package com.patasfelices.dto;

import java.util.List;

public class MascotaPage {
    private List<MascotaResponse> content;
    private int paginaActual;
    private int totalPaginas;
    private long totalElementos;
    private boolean primera;
    private boolean ultima;

    public MascotaPage() {}

    public List<MascotaResponse> getContent() { return content; }
    public void setContent(List<MascotaResponse> content) { this.content = content; }
    public int getPaginaActual() { return paginaActual; }
    public void setPaginaActual(int paginaActual) { this.paginaActual = paginaActual; }
    public int getTotalPaginas() { return totalPaginas; }
    public void setTotalPaginas(int totalPaginas) { this.totalPaginas = totalPaginas; }
    public long getTotalElementos() { return totalElementos; }
    public void setTotalElementos(long totalElementos) { this.totalElementos = totalElementos; }
    public boolean isPrimera() { return primera; }
    public void setPrimera(boolean primera) { this.primera = primera; }
    public boolean isUltima() { return ultima; }
    public void setUltima(boolean ultima) { this.ultima = ultima; }
}
