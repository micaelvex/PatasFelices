import { useState, useEffect } from "react";
import {
  FileText,
  X,
  Check,
  ChevronDown,
  Phone,
  Building2,
  Home as HomeIcon,
  Shield,
  Users,
  RefreshCw,
} from "lucide-react";
import { api } from "../../../services/api";

interface SolicitudResponse {
  id: number;
  mascotaId: number;
  mascotaNombre: string;
  mascotaEspecie: string;
  adoptanteNombre: string;
  adoptanteEmail: string;
  adoptanteTelefono: string;
  motivacion: string;
  tieneExperiencia: boolean;
  tipoVivienda: string;
  hayNinos: boolean;
  estado: string;
  fechaSolicitud: string;
}

type SolFilter = "TODAS" | "PENDIENTE" | "APROBADA" | "RECHAZADA";

interface Props {
  onClose: () => void;
}

const estadoBadge = (estado: string) => {
  switch (estado) {
    case "PENDIENTE":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200">
          Pendiente
        </span>
      );
    case "APROBADA":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
          Aprobada
        </span>
      );
    case "RECHAZADA":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border bg-red-50 text-red-700 border-red-200">
          Rechazada
        </span>
      );
    default:
      return null;
  }
};

export function SolicitudesDrawer({ onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [solicitudes, setSolicitudes] = useState<SolicitudResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [solFilter, setSolFilter] = useState<SolFilter>("TODAS");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => setVisible(true));
    cargarSolicitudes();
    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(frame);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await api.get<SolicitudResponse[]>("/solicitudes/recibidas");
      setSolicitudes(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id: number, estado: "APROBADA" | "RECHAZADA") => {
    try {
      await api.put(`/solicitudes/${id}/estado`, { estado });
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado } : s))
      );
    } catch {}
  };

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pendientes = solicitudes.filter((s) => s.estado === "PENDIENTE").length;
  const aprobadas = solicitudes.filter((s) => s.estado === "APROBADA").length;
  const rechazadas = solicitudes.filter((s) => s.estado === "RECHAZADA").length;

  const solicitudesFiltradas =
    solFilter === "TODAS"
      ? solicitudes
      : solicitudes.filter((s) => s.estado === solFilter);

  const filterOptions: { key: SolFilter; label: string; count: number }[] = [
    { key: "TODAS", label: "Todas", count: solicitudes.length },
    { key: "PENDIENTE", label: "Pendientes", count: pendientes },
    { key: "APROBADA", label: "Aprobadas", count: aprobadas },
    { key: "RECHAZADA", label: "Rechazadas", count: rechazadas },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`relative w-full max-w-[580px] bg-white h-full flex flex-col shadow-2xl z-10 transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8ECF0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
              <FileText size={18} className="text-[#1E88E5]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#0F172A]">Solicitudes</h2>
              {!loading && (
                <p className="text-xs text-[#94A3B8]">
                  {solicitudes.length} total · {pendientes} pendiente{pendientes !== 1 ? "s" : ""} · {aprobadas} aprobada{aprobadas !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cargarSolicitudes}
              className="w-8 h-8 rounded-full border border-[#E8ECF0] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors"
              title="Actualizar"
            >
              <RefreshCw size={14} className={`text-[#64748B] ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full border border-[#E8ECF0] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-[#64748B]" />
            </button>
          </div>
        </div>

        {/* ── Filter pills ── */}
        <div className="flex gap-2 px-5 py-3 border-b border-[#E8ECF0] shrink-0 flex-wrap">
          {filterOptions.map(({ key, label, count }) => {
            const active = solFilter === key;
            return (
              <button
                key={key}
                onClick={() => setSolFilter(key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? "bg-[#1E88E5] text-white"
                    : "border border-[#E8ECF0] text-[#64748B] hover:bg-[#F8FAFC]"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* ── List ── */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-[#94A3B8]">
              <RefreshCw size={24} className="mb-3 animate-spin" />
              <p className="text-sm">Cargando solicitudes...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && solicitudesFiltradas.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-4">
                <FileText size={24} className="text-[#94A3B8]" />
              </div>
              <p className="font-medium text-[#0F172A]">No hay solicitudes</p>
              <p className="text-sm text-[#64748B] mt-1">
                {solFilter !== "TODAS"
                  ? "Prueba con otro filtro"
                  : "Las solicitudes de adopción aparecerán aquí"}
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading &&
            solicitudesFiltradas.map((sol) => {
              const isExpanded = expandedIds.has(sol.id);
              const borderColor =
                sol.estado === "PENDIENTE"
                  ? "border-l-amber-400"
                  : sol.estado === "APROBADA"
                  ? "border-l-emerald-400"
                  : "border-l-red-400";

              return (
                <div
                  key={sol.id}
                  className={`rounded-2xl border border-[#E8ECF0] bg-white overflow-hidden border-l-4 ${borderColor}`}
                >
                  {/* Card header */}
                  <div className="p-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <h3 className="font-bold text-[#0F172A] text-sm">
                          {sol.mascotaNombre}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#EFF6FF] text-[#1E88E5] shrink-0">
                          {sol.mascotaEspecie === "PERRO" ? "Perro" : sol.mascotaEspecie === "GATO" ? "Gato" : "Otro"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {estadoBadge(sol.estado)}

                        {sol.estado === "PENDIENTE" && (
                          <>
                            <button
                              onClick={() => cambiarEstado(sol.id, "APROBADA")}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-medium hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                              title="Aprobar"
                            >
                              <Check size={12} /> Aprobar
                            </button>
                            <button
                              onClick={() => cambiarEstado(sol.id, "RECHAZADA")}
                              className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-medium hover:bg-red-100 flex items-center gap-1 transition-colors"
                              title="Rechazar"
                            >
                              <X size={12} /> Rechazar
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-[#64748B] truncate">
                          {sol.adoptanteNombre} · {sol.adoptanteEmail}
                        </p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">
                          {new Date(sol.fechaSolicitud).toLocaleDateString("es-PE", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleExpanded(sol.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#E8ECF0] text-xs text-[#64748B] hover:bg-[#F8FAFC] transition-colors shrink-0"
                      >
                        Ver detalles
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expandable detail — CSS grid trick */}
                  <div
                    className={`grid transition-all duration-300 ${
                      isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4 pt-2 border-t border-[#E8ECF0] bg-[#F8FAFC]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Motivación */}
                          <div>
                            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-1.5">
                              Motivación
                            </p>
                            <p className="text-sm text-[#0F172A] leading-relaxed">
                              {sol.motivacion}
                            </p>
                          </div>

                          {/* Info items */}
                          <div>
                            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-1.5">
                              Información del adoptante
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-[#0F172A]">
                                <Phone size={13} className="text-[#64748B] shrink-0" />
                                {sol.adoptanteTelefono}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-[#0F172A]">
                                {sol.tipoVivienda === "CASA" ? (
                                  <HomeIcon size={13} className="text-[#64748B] shrink-0" />
                                ) : (
                                  <Building2 size={13} className="text-[#64748B] shrink-0" />
                                )}
                                {sol.tipoVivienda === "CASA" ? "Casa" : "Departamento"}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Shield
                                  size={13}
                                  className={`shrink-0 ${
                                    sol.tieneExperiencia
                                      ? "text-emerald-500"
                                      : "text-[#94A3B8]"
                                  }`}
                                />
                                <span className="text-[#0F172A]">
                                  {sol.tieneExperiencia
                                    ? "Con experiencia en mascotas"
                                    : "Sin experiencia previa"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Users
                                  size={13}
                                  className={`shrink-0 ${
                                    sol.hayNinos
                                      ? "text-emerald-500"
                                      : "text-[#94A3B8]"
                                  }`}
                                />
                                <span className="text-[#0F172A]">
                                  {sol.hayNinos
                                    ? "Hay niños en el hogar"
                                    : "Sin niños en el hogar"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
