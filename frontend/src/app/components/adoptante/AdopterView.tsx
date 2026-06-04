import { useState, useEffect, useCallback } from "react";
import { Heart, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { MascotaDetalle } from "./MascotaDetalle";
import {
  MascotaResponse,
  formatEdad,
  formatTamanio,
  formatEspecie,
  getFotoUrl,
} from "../../../types/mascota";

interface MascotaPage {
  content: MascotaResponse[];
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  primera: boolean;
  ultima: boolean;
}

const PAGE_SIZE = 9;

export function AdopterView() {
  const { user } = useAuth();
  const [mascotas, setMascotas] = useState<MascotaResponse[]>([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [filters, setFilters] = useState({ especie: "", tamanio: "", distrito: "", nombre: "", sexo: "" });
  const [inputNombre, setInputNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seleccionada, setSeleccionada] = useState<MascotaResponse | null>(null);

  const cargarMascotas = useCallback(async (page = 0) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.especie) params.append("especie", filters.especie);
      if (filters.tamanio) params.append("tamanio", filters.tamanio);
      if (filters.distrito) params.append("distrito", filters.distrito);
      if (filters.nombre) params.append("nombre", filters.nombre);
      if (filters.sexo) params.append("sexo", filters.sexo);
      params.append("page", String(page));
      params.append("size", String(PAGE_SIZE));
      const data = await api.get<MascotaPage>(`/mascotas?${params.toString()}`);
      setMascotas(data.content);
      setPaginaActual(data.paginaActual);
      setTotalPaginas(data.totalPaginas);
      setTotalElementos(data.totalElementos);
    } catch {
      setError("No se pudo cargar las mascotas. Verifica que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { cargarMascotas(0); }, []);
  useEffect(() => { cargarMascotas(0); }, [filters]);

  const buscar = () => {
    setFilters((prev) => ({ ...prev, nombre: inputNombre }));
    setPaginaActual(0);
  };

  const limpiarFiltros = () => {
    setFilters({ especie: "", tamanio: "", distrito: "", nombre: "", sexo: "" });
    setInputNombre("");
  };

  const hayFiltrosActivos = filters.especie || filters.tamanio || filters.distrito || filters.nombre || filters.sexo;

  const toggleFavorito = async (mascota: MascotaResponse) => {
    if (!user) return;
    // Actualización optimista: refleja el cambio en la UI de inmediato
    setMascotas((prev) =>
      prev.map((m) => m.id === mascota.id ? { ...m, esFavorito: !m.esFavorito } : m)
    );
    try {
      if (mascota.esFavorito) {
        await api.delete(`/favoritos/${mascota.id}`);
      } else {
        await api.post(`/favoritos/${mascota.id}`, {});
      }
    } catch {
      // Revertir si el API falla
      setMascotas((prev) =>
        prev.map((m) => m.id === mascota.id ? { ...m, esFavorito: mascota.esFavorito } : m)
      );
    }
  };

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina < 0 || nuevaPagina >= totalPaginas) return;
    cargarMascotas(nuevaPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginasVisibles = () => {
    const delta = 2;
    const pages: number[] = [];
    for (let i = Math.max(0, paginaActual - delta); i <= Math.min(totalPaginas - 1, paginaActual + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  const selectClass =
    "w-full px-4 py-2.5 bg-white rounded-xl border border-[#E8ECF0] text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all cursor-pointer";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <div className="bg-white border-b border-[#E8ECF0]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-xs font-semibold text-[#1E88E5] tracking-widest uppercase mb-3">
            Adopciones · Puno, Perú
          </p>
          <h1 className="text-4xl font-bold text-[#0F172A] mb-2 leading-tight">
            Encuentra a tu compañero ideal
          </h1>
          <p className="text-[#64748B] text-base">
            Mascotas rescatadas que esperan un hogar lleno de amor
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Panel de búsqueda y filtros */}
        <div className="bg-white rounded-2xl border border-[#E8ECF0] shadow-[0_1px_6px_rgba(0,0,0,0.05)] p-5 mb-8">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
              <input
                type="text"
                value={inputNombre}
                onChange={(e) => setInputNombre(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscar()}
                placeholder="Buscar por nombre..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] rounded-xl border border-[#E8ECF0] text-sm text-[#334155] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
              />
            </div>
            <button
              onClick={buscar}
              className="px-5 py-2.5 bg-[#1E88E5] text-white rounded-xl hover:bg-[#1976D2] transition-colors text-sm font-medium"
            >
              Buscar
            </button>
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="px-4 py-2.5 text-[#64748B] rounded-xl border border-[#E8ECF0] hover:bg-[#F8FAFC] transition-colors text-sm flex items-center gap-1.5"
              >
                <X size={14} />
                Limpiar
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={filters.especie}
              onChange={(e) => setFilters((f) => ({ ...f, especie: e.target.value }))}
              className={selectClass}
            >
              <option value="">Especie: Todas</option>
              <option value="PERRO">Perros</option>
              <option value="GATO">Gatos</option>
              <option value="OTRO">Otros</option>
            </select>
            <select
              value={filters.sexo}
              onChange={(e) => setFilters((f) => ({ ...f, sexo: e.target.value }))}
              className={selectClass}
            >
              <option value="">Sexo: Todos</option>
              <option value="MACHO">Macho</option>
              <option value="HEMBRA">Hembra</option>
            </select>
            <select
              value={filters.tamanio}
              onChange={(e) => setFilters((f) => ({ ...f, tamanio: e.target.value }))}
              className={selectClass}
            >
              <option value="">Tamaño: Todos</option>
              <option value="PEQUENIO">Pequeño</option>
              <option value="MEDIANO">Mediano</option>
              <option value="GRANDE">Grande</option>
            </select>
            <select
              value={filters.distrito}
              onChange={(e) => setFilters((f) => ({ ...f, distrito: e.target.value }))}
              className={selectClass}
            >
              <option value="">Distrito: Todos</option>
              <option value="Puno">Puno</option>
              <option value="Juliaca">Juliaca</option>
              <option value="Caracoto">Caracoto</option>
              <option value="Ilave">Ilave</option>
              <option value="Ayaviri">Ayaviri</option>
            </select>
          </div>
        </div>

        {/* Cargando */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-9 h-9 border-[3px] border-[#E8ECF0] border-t-[#1E88E5] rounded-full animate-spin" />
            <p className="text-[#64748B] text-sm">Buscando mascotas...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <X size={24} className="text-red-400" />
            </div>
            <p className="text-[#64748B] text-sm">{error}</p>
            <button
              onClick={() => cargarMascotas(0)}
              className="px-5 py-2.5 bg-[#1E88E5] text-white rounded-xl hover:bg-[#1976D2] text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && mascotas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-[#EFF6FF] flex items-center justify-center">
              <Search size={24} className="text-[#1E88E5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A]">Sin resultados</h3>
            <p className="text-[#64748B] text-sm max-w-xs">
              Prueba ajustando los filtros para ver más mascotas disponibles
            </p>
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="mt-1 px-5 py-2.5 border border-[#E8ECF0] text-[#64748B] rounded-xl hover:bg-[#F8FAFC] text-sm transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Modal de detalle */}
        {seleccionada && (
          <MascotaDetalle
            mascota={seleccionada}
            onClose={() => setSeleccionada(null)}
            onFavoritoToggle={(id) =>
              setMascotas((prev) =>
                prev.map((m) => m.id === id ? { ...m, esFavorito: !m.esFavorito } : m)
              )
            }
          />
        )}

        {/* Grid de tarjetas */}
        {!loading && !error && mascotas.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-[#64748B]">
                <span className="font-semibold text-[#0F172A]">{totalElementos}</span>{" "}
                mascota{totalElementos !== 1 ? "s" : ""} disponible{totalElementos !== 1 ? "s" : ""}
                {totalPaginas > 1 && (
                  <span className="text-[#94A3B8]"> · pág. {paginaActual + 1} de {totalPaginas}</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mascotas.map((mascota) => {
                const fotoUrl = getFotoUrl(mascota.fotos);
                return (
                  <div
                    key={mascota.id}
                    onClick={() => setSeleccionada(mascota)}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#E8ECF0] shadow-[0_1px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="relative h-52 bg-[#EFF6FF] overflow-hidden">
                      {fotoUrl ? (
                        <img
                          src={fotoUrl}
                          alt={mascota.nombre}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-[#E2E8F0] flex items-center justify-center">
                            <span className="text-[#94A3B8] text-sm font-bold">
                              {mascota.especie === "PERRO" ? "P" : mascota.especie === "GATO" ? "G" : "?"}
                            </span>
                          </div>
                          <span className="text-xs text-[#94A3B8]">{formatEspecie(mascota.especie)}</span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#1E88E5] rounded-lg text-xs font-medium shadow-sm">
                          {formatEspecie(mascota.especie)}
                        </span>
                      </div>

                      {user && (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorito(mascota); }}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <Heart
                            size={16}
                            className={mascota.esFavorito ? "fill-[#EF5350] text-[#EF5350]" : "text-[#94A3B8]"}
                          />
                        </button>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-semibold text-[#0F172A]">{mascota.nombre}</h3>
                        <span className="text-xs text-[#94A3B8] shrink-0 pt-0.5">
                          {formatEdad(mascota.edadMeses)}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748B] mb-3">
                        {mascota.raza || "Mestizo"} · {mascota.sexo === "MACHO" ? "Macho" : "Hembra"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                          <span className="px-2.5 py-1 bg-[#F8FAFC] text-[#475569] rounded-lg text-xs border border-[#E8ECF0]">
                            {formatTamanio(mascota.tamanio)}
                          </span>
                          {mascota.refugioDistrito && (
                            <span className="px-2.5 py-1 bg-[#F8FAFC] text-[#475569] rounded-lg text-xs border border-[#E8ECF0]">
                              {mascota.refugioDistrito}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                <button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 0}
                  className="w-9 h-9 rounded-xl border border-[#E8ECF0] flex items-center justify-center hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={17} className="text-[#64748B]" />
                </button>

                {paginasVisibles().map((p) => (
                  <button
                    key={p}
                    onClick={() => cambiarPagina(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                      p === paginaActual
                        ? "bg-[#1E88E5] text-white shadow-sm"
                        : "border border-[#E8ECF0] text-[#64748B] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {p + 1}
                  </button>
                ))}

                <button
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas - 1}
                  className="w-9 h-9 rounded-xl border border-[#E8ECF0] flex items-center justify-center hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={17} className="text-[#64748B]" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
