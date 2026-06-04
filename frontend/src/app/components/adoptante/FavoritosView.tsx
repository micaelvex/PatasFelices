import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";
import { api } from "../../../services/api";
import {
  MascotaResponse,
  formatEdad,
  formatEspecie,
  getFotoUrl,
} from "../../../types/mascota";
import { MascotaDetalle } from "./MascotaDetalle";

interface Props {
  onClose: () => void;
}

export function FavoritosView({ onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [favoritos, setFavoritos] = useState<MascotaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [seleccionada, setSeleccionada] = useState<MascotaResponse | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => setVisible(true));
    cargarFavoritos();
    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(frame);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const cargarFavoritos = async () => {
    setLoading(true);
    try {
      const data = await api.get<MascotaResponse[]>("/favoritos");
      setFavoritos(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const quitarFavorito = async (e: React.MouseEvent, mascota: MascotaResponse) => {
    e.stopPropagation();
    try {
      await api.delete(`/favoritos/${mascota.id}`);
      setFavoritos((prev) => prev.filter((m) => m.id !== mascota.id));
    } catch {}
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div
          onClick={handleClose}
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Panel drawer */}
        <div
          className={`relative w-full max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col transition-transform duration-300 ease-out ${
            visible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8ECF0] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                <Heart size={16} className="text-[#EF5350] fill-[#EF5350]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#0F172A]">Mis favoritos</h2>
                {!loading && (
                  <p className="text-xs text-[#94A3B8]">
                    {favoritos.length} guardada{favoritos.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full border border-[#E8ECF0] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-[#64748B]" />
            </button>
          </div>

          {/* Contenido */}
          <div className="overflow-y-auto flex-1 p-4">
            {/* Cargando */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <div className="w-8 h-8 border-[3px] border-[#E8ECF0] border-t-[#EF5350] rounded-full animate-spin" />
                <p className="text-xs text-[#94A3B8]">Cargando...</p>
              </div>
            )}

            {/* Sin favoritos */}
            {!loading && favoritos.length === 0 && (
              <div className="flex flex-col items-center justify-center h-52 gap-3 text-center px-6">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                  <Heart size={26} className="text-[#EF5350]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A] mb-1">Sin favoritos aún</p>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Toca el corazón en cualquier mascota del catálogo para guardarla aquí
                  </p>
                </div>
              </div>
            )}

            {/* Lista */}
            {!loading && favoritos.length > 0 && (
              <div className="space-y-2.5">
                {favoritos.map((mascota) => {
                  const fotoUrl = getFotoUrl(mascota.fotos);
                  return (
                    <div
                      key={mascota.id}
                      onClick={() => setSeleccionada(mascota)}
                      className="group flex items-center gap-3 p-3 rounded-2xl border border-[#E8ECF0] bg-white hover:border-[#CBD5E1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] transition-all duration-150 cursor-pointer"
                    >
                      {/* Foto */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#EFF6FF] shrink-0">
                        {fotoUrl ? (
                          <img
                            src={fotoUrl}
                            alt={mascota.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                            <div className="w-10 h-10 rounded-xl bg-[#E2E8F0] flex items-center justify-center">
                              <span className="text-[#94A3B8] text-sm font-bold">
                                {mascota.especie === "PERRO" ? "P" : mascota.especie === "GATO" ? "G" : "?"}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#94A3B8]">{formatEspecie(mascota.especie)}</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className="text-sm font-semibold text-[#0F172A] truncate">
                            {mascota.nombre}
                          </p>
                          <span className="text-xs text-[#94A3B8] shrink-0">
                            {formatEdad(mascota.edadMeses)}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] truncate mb-1.5">
                          {mascota.raza || "Mestizo"} · {formatEspecie(mascota.especie)}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {mascota.refugioDistrito && (
                            <span className="text-[10px] px-2 py-0.5 bg-[#F8FAFC] border border-[#E8ECF0] text-[#475569] rounded-md">
                              {mascota.refugioDistrito}
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 bg-[#F8FAFC] border border-[#E8ECF0] text-[#475569] rounded-md">
                            {mascota.sexo === "MACHO" ? "Macho" : "Hembra"}
                          </span>
                        </div>
                      </div>

                      {/* Quitar favorito */}
                      <button
                        onClick={(e) => quitarFavorito(e, mascota)}
                        title="Quitar de favoritos"
                        className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors shrink-0"
                      >
                        <Heart size={15} className="fill-[#EF5350] text-[#EF5350]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer con acción */}
          {!loading && favoritos.length > 0 && (
            <div className="px-4 py-3 border-t border-[#E8ECF0] shrink-0">
              <p className="text-xs text-center text-[#94A3B8]">
                Haz clic en una tarjeta para ver todos los detalles
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal detalle encima del drawer */}
      {seleccionada && (
        <MascotaDetalle
          mascota={seleccionada}
          onClose={() => setSeleccionada(null)}
          onFavoritoToggle={(id) =>
            setFavoritos((prev) =>
              prev.map((m) => (m.id === id ? { ...m, esFavorito: !m.esFavorito } : m))
            )
          }
        />
      )}
    </>
  );
}
