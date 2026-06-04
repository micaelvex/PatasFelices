import { useState, useEffect } from "react";
import { X, Plus, Pencil, Trash2, CheckCircle, RefreshCw, Home } from "lucide-react";
import { api } from "../../../services/api";
import { PublicarMascotaModal } from "./PublicarMascotaModal";
import { EditarMascotaModal } from "./EditarMascotaModal";
import { MascotaResponse, formatEdad, formatTamanio, formatEspecie, getFotoUrl } from "../../../types/mascota";

interface Props {
  onClose: () => void;
}

export function MisMascotasPanel({ onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [mascotas, setMascotas] = useState<MascotaResponse[]>([]);
  const [loadingMascotas, setLoadingMascotas] = useState(false);
  const [mostrarPublicar, setMostrarPublicar] = useState(false);
  const [editando, setEditando] = useState<MascotaResponse | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => setVisible(true));
    cargarMascotas();
    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(frame);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const cargarMascotas = async () => {
    setLoadingMascotas(true);
    try {
      const data = await api.get<MascotaResponse[]>("/mascotas/mis-publicaciones");
      setMascotas(data);
    } catch {
    } finally {
      setLoadingMascotas(false);
    }
  };

  const marcarAdoptada = async (id: number) => {
    try {
      await api.put(`/mascotas/${id}/adoptar`);
      setMascotas((prev) =>
        prev.map((m) => (m.id === id ? { ...m, estado: "ADOPTADA" } : m))
      );
    } catch {}
  };

  const eliminarMascota = async (id: number) => {
    try {
      await api.delete(`/mascotas/${id}`);
      setMascotas((prev) => prev.filter((m) => m.id !== id));
    } catch {
    } finally {
      setEliminandoId(null);
    }
  };

  const mascotasDisponibles = mascotas.filter((m) => m.estado === "DISPONIBLE").length;
  const mascotasAdoptadas = mascotas.filter((m) => m.estado === "ADOPTADA").length;

  const especieLetra = (especie: string) =>
    especie === "PERRO" ? "P" : especie === "GATO" ? "G" : "?";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-[3px] transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl z-10 flex flex-col transition-all duration-200 ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8ECF0] shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
              <Home size={20} className="text-[#1E88E5]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">Mis Mascotas</p>
              <p className="text-xs text-[#64748B] mt-0.5">
                {mascotas.length} publicacion{mascotas.length !== 1 ? "es" : ""} · {mascotasDisponibles} disponible{mascotasDisponibles !== 1 ? "s" : ""} · {mascotasAdoptadas} adoptada{mascotasAdoptadas !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMostrarPublicar(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1E88E5] hover:bg-[#1976D2] text-white text-xs font-medium rounded-xl transition-colors"
            >
              <Plus size={14} />
              Nueva publicación
            </button>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full border border-[#E8ECF0] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-[#64748B]" />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="px-6 py-3 border-b border-[#E8ECF0] bg-[#F8FAFC] shrink-0 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E8ECF0] rounded-lg text-sm text-[#0F172A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
            Total: <strong>{mascotas.length}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E8ECF0] rounded-lg text-sm text-[#0F172A]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Disponibles: <strong>{mascotasDisponibles}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E8ECF0] rounded-lg text-sm text-[#0F172A]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Adoptadas: <strong>{mascotasAdoptadas}</strong>
          </span>
          <button
            onClick={cargarMascotas}
            className="ml-auto p-1.5 rounded-lg border border-[#E8ECF0] bg-white hover:bg-[#F8FAFC] text-[#64748B] transition-colors"
            title="Recargar"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {loadingMascotas && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-[3px] border-[#E8ECF0] border-t-[#1E88E5] rounded-full animate-spin" />
            </div>
          )}

          {!loadingMascotas && mascotas.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF0] flex items-center justify-center mb-4">
                <Home size={28} className="text-[#CBD5E1]" />
              </div>
              <p className="text-sm font-semibold text-[#0F172A] mb-1">Sin publicaciones aún</p>
              <p className="text-xs text-[#94A3B8] mb-5">
                Publica tu primera mascota para comenzar a recibir solicitudes de adopción
              </p>
              <button
                onClick={() => setMostrarPublicar(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1E88E5] hover:bg-[#1976D2] text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Plus size={15} />
                Publicar primera mascota
              </button>
            </div>
          )}

          {!loadingMascotas && mascotas.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mascotas.map((mascota) => {
                const fotoUrl = getFotoUrl(mascota.fotos);
                const disponible = mascota.estado === "DISPONIBLE";
                return (
                  <div
                    key={mascota.id}
                    className="bg-white rounded-2xl border border-[#E8ECF0] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                  >
                    {/* Photo area */}
                    <div className="relative h-40 bg-[#EFF6FF] overflow-hidden rounded-t-xl">
                      {fotoUrl ? (
                        <img
                          src={fotoUrl}
                          alt={mascota.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                          <div className="w-10 h-10 rounded-xl bg-[#E2E8F0] flex items-center justify-center">
                            <span className="text-[#94A3B8] text-sm font-bold">{especieLetra(mascota.especie)}</span>
                          </div>
                          <span className="text-[10px] text-[#94A3B8]">{mascota.especie === "PERRO" ? "Perro" : mascota.especie === "GATO" ? "Gato" : "Otro"}</span>
                        </div>
                      )}
                      {/* Status badge */}
                      <span
                        className={`absolute top-2 right-2 px-2 py-0.5 rounded-lg text-xs font-medium border ${
                          disponible
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {disponible ? "Disponible" : "Adoptado"}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-3 flex flex-col flex-1">
                      <p className="font-semibold text-[#0F172A] text-sm truncate">{mascota.nombre}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{formatEspecie(mascota.especie)}</p>

                      <div className="mt-1.5 space-y-0.5">
                        {mascota.raza && (
                          <p className="text-xs text-[#94A3B8] truncate">{mascota.raza}</p>
                        )}
                        <p className="text-xs text-[#94A3B8]">
                          {formatEdad(mascota.edadMeses)} · {formatTamanio(mascota.tamanio)}
                        </p>
                      </div>

                      {/* Health chips */}
                      {(mascota.vacunado || mascota.esterilizado || mascota.desparasitado) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {mascota.vacunado && (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[10px] font-medium">
                              Vacunado
                            </span>
                          )}
                          {mascota.esterilizado && (
                            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-100 rounded text-[10px] font-medium">
                              Esterilizado
                            </span>
                          )}
                          {mascota.desparasitado && (
                            <span className="px-1.5 py-0.5 bg-teal-50 text-teal-600 border border-teal-100 rounded text-[10px] font-medium">
                              Desparasitado
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-auto pt-3 flex items-center gap-1.5">
                        <button
                          onClick={() => setEditando(mascota)}
                          className="p-2 rounded-lg border border-[#E8ECF0] text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                          title="Editar"
                        >
                          <Pencil size={13} />
                        </button>
                        {disponible && (
                          <button
                            onClick={() => marcarAdoptada(mascota.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs font-medium transition-colors"
                            title="Marcar como adoptado"
                          >
                            <CheckCircle size={12} />
                            Adoptado
                          </button>
                        )}
                        <button
                          onClick={() => setEliminandoId(mascota.id)}
                          className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors ml-auto"
                          title="Eliminar"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {eliminandoId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setEliminandoId(null)}
          />
          <div className="relative bg-white rounded-2xl border border-[#E8ECF0] shadow-2xl p-6 w-full max-w-sm z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <p className="text-sm font-semibold text-[#0F172A] mb-1">¿Eliminar publicación?</p>
            <p className="text-xs text-[#64748B] mb-5">
              Esta acción no se puede deshacer. Se eliminará la mascota y todas sus fotos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setEliminandoId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8ECF0] text-sm text-[#64748B] hover:bg-[#F8FAFC] font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminarMascota(eliminandoId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PublicarMascotaModal */}
      {mostrarPublicar && (
        <PublicarMascotaModal
          onClose={() => setMostrarPublicar(false)}
          onPublicada={() => {
            setMostrarPublicar(false);
            cargarMascotas();
          }}
        />
      )}

      {/* EditarMascotaModal */}
      {editando && (
        <EditarMascotaModal
          mascota={editando}
          onClose={() => setEditando(null)}
          onGuardada={(updated) => {
            setMascotas((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
            setEditando(null);
          }}
        />
      )}
    </div>
  );
}
