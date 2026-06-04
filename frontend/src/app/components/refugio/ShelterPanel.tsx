import { useState, useEffect } from "react";
import { Plus, RefreshCw, CheckCircle, Clock, AlertCircle, ChevronRight, ChevronLeft, TrendingUp } from "lucide-react";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { PublicarMascotaModal } from "./PublicarMascotaModal";
import { MascotaResponse, formatEdad, formatEspecie, getFotoUrl } from "../../../types/mascota";

interface SolicitudResponse {
  id: number;
  mascotaNombre: string;
  mascotaEspecie: string;
  adoptanteNombre: string;
  estado: string;
  fechaSolicitud: string;
}

interface Props {
  onOpenSolicitudes: () => void;
  onOpenMascotas: () => void;
}

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Buenos dias";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
};

const formatDate = () => {
  const d = new Date().toLocaleDateString("es-PE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  return d.charAt(0).toUpperCase() + d.slice(1);
};

const estadoBadge = (estado: string) => {
  const cfg: Record<string, { style: string; label: string }> = {
    PENDIENTE: { style: "bg-amber-50 text-amber-700 border border-amber-200",    label: "Pendiente" },
    APROBADA:  { style: "bg-emerald-50 text-emerald-700 border border-emerald-200", label: "Aprobada" },
    RECHAZADA: { style: "bg-red-50 text-red-600 border border-red-200",          label: "Rechazada" },
  };
  const c = cfg[estado] ?? { style: "bg-[#F8FAFC] text-[#64748B] border border-[#E8ECF0]", label: estado };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${c.style}`}>
      {c.label}
    </span>
  );
};

export function ShelterPanel({ onOpenSolicitudes, onOpenMascotas }: Props) {
  const { user } = useAuth();
  const [mascotas, setMascotas] = useState<MascotaResponse[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarPublicar, setMostrarPublicar] = useState(false);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [m, s] = await Promise.all([
        api.get<MascotaResponse[]>("/mascotas/mis-publicaciones"),
        api.get<SolicitudResponse[]>("/solicitudes/recibidas"),
      ]);
      setMascotas(m);
      setSolicitudes(s);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const disponibles = mascotas.filter((m) => m.estado === "DISPONIBLE").length;
  const adoptadas   = mascotas.filter((m) => m.estado === "ADOPTADA").length;
  const pendientes  = solicitudes.filter((s) => s.estado === "PENDIENTE").length;

  const [slide, setSlide] = useState(0);
  const PER_PAGE = 4;
  const canPrev = slide > 0;
  const canNext = slide + PER_PAGE < mascotas.length;
  const visibleMascotas = mascotas.slice(slide, slide + PER_PAGE);

  const stats = [
    { label: "Total publicadas", value: mascotas.length,  dot: "bg-[#1E88E5]",   sub: `${disponibles} disponibles` },
    { label: "Disponibles",      value: disponibles,       dot: "bg-emerald-400", sub: "listas para adoptar" },
    { label: "Pendientes",       value: pendientes,        dot: "bg-amber-400",   sub: "esperan respuesta" },
    { label: "Adoptadas",        value: adoptadas,         dot: "bg-violet-400",  sub: "encontraron hogar" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-10 py-10 space-y-7">

        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-[#1E88E5] uppercase tracking-widest mb-2">Panel de gestion</p>
            <h1 className="text-4xl font-bold text-[#0F172A]">{getGreeting()}, {user?.nombre?.split(" ")[0]}</h1>
            <p className="text-base text-[#64748B] mt-1.5">{formatDate()}</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={cargarDatos} disabled={loading}
              className="w-10 h-10 rounded-xl border border-[#E8ECF0] bg-white flex items-center justify-center hover:bg-[#F8FAFC] transition-colors">
              <RefreshCw size={16} className={`text-[#64748B] ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => setMostrarPublicar(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#1E88E5] text-white rounded-xl hover:bg-[#1976D2] text-sm font-semibold shadow-[0_4px_12px_rgba(30,136,229,0.28)] transition-all">
              <Plus size={17} /> Nueva publicacion
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {stats.map((s) => (
            <div key={s.label}
              className="bg-white rounded-2xl border border-[#E8ECF0] px-7 py-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-5">
                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest">{s.label}</p>
              </div>
              <p className="text-5xl font-bold text-[#0F172A] tabular-nums">{loading ? "—" : s.value}</p>
              <p className="text-xs text-[#CBD5E1] mt-2">{s.sub}</p>
            </div>
          ))}
        </div>

        {!loading && pendientes > 0 && (
          <button onClick={onOpenSolicitudes}
            className="w-full flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 hover:bg-amber-100 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Clock size={17} className="text-amber-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-amber-800">
                  {pendientes} solicitud{pendientes !== 1 ? "es" : ""} pendiente{pendientes !== 1 ? "s" : ""} de revision
                </p>
                <p className="text-xs text-amber-600">Responde antes de que el adoptante pierda interes</p>
              </div>
            </div>
            <ChevronRight size={17} className="text-amber-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        )}

        <div className="bg-white rounded-2xl border border-[#E8ECF0] shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">Solicitudes recientes</h2>
              <p className="text-sm text-[#94A3B8] mt-0.5">{solicitudes.length} en total</p>
            </div>
            <button onClick={onOpenSolicitudes}
              className="text-sm text-[#1E88E5] hover:underline font-medium flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>

          {loading && <div className="flex justify-center py-10"><div className="w-8 h-8 border-[3px] border-[#E8ECF0] border-t-[#1E88E5] rounded-full animate-spin" /></div>}

          {!loading && solicitudes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <AlertCircle size={28} className="text-[#CBD5E1]" />
              <p className="text-base text-[#94A3B8]">Sin solicitudes aun</p>
            </div>
          )}

          {!loading && solicitudes.slice(0, 5).map((sol) => (
            <div key={sol.id} onClick={onOpenSolicitudes}
              className="flex items-center gap-5 px-7 py-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer border-b border-[#F8FAFC] last:border-0">
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                <span className="text-[#1E88E5] text-sm font-bold">
                  {sol.mascotaEspecie === "PERRO" ? "P" : sol.mascotaEspecie === "GATO" ? "G" : "?"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-[#0F172A] truncate">{sol.mascotaNombre}</p>
                <p className="text-sm text-[#64748B] truncate mt-0.5">
                  {sol.adoptanteNombre} &middot; {new Date(sol.fechaSolicitud).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}
                </p>
              </div>
              {estadoBadge(sol.estado)}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#E8ECF0] shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">Mis mascotas</h2>
              <p className="text-sm text-[#94A3B8] mt-0.5">
                {mascotas.length} publicada{mascotas.length !== 1 ? "s" : ""} &middot; {disponibles} disponible{disponibles !== 1 ? "s" : ""}
              </p>
            </div>
            <button onClick={onOpenMascotas}
              className="text-sm text-[#1E88E5] hover:underline font-medium flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>

          {loading && <div className="flex justify-center py-10"><div className="w-8 h-8 border-[3px] border-[#E8ECF0] border-t-[#1E88E5] rounded-full animate-spin" /></div>}

          {!loading && mascotas.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <p className="text-base text-[#94A3B8]">Aun no has publicado mascotas</p>
              <button onClick={() => setMostrarPublicar(true)} className="text-sm text-[#1E88E5] hover:underline font-medium">
                Publicar primera mascota
              </button>
            </div>
          )}

          {!loading && mascotas.length > 0 && (
            <div className="px-6 pb-6 pt-2">
              {/* Flechas de navegación */}
              <div className="flex items-center justify-end gap-2 mb-4 px-1">
                <span className="text-xs text-[#94A3B8] mr-2">
                  {slide + 1}–{Math.min(slide + PER_PAGE, mascotas.length)} de {mascotas.length}
                </span>
                <button
                  onClick={() => setSlide((p) => Math.max(0, p - PER_PAGE))}
                  disabled={!canPrev}
                  className="w-8 h-8 rounded-xl border border-[#E8ECF0] flex items-center justify-center hover:bg-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} className="text-[#475569]" />
                </button>
                <button
                  onClick={() => setSlide((p) => Math.min(mascotas.length - PER_PAGE, p + PER_PAGE))}
                  disabled={!canNext}
                  className="w-8 h-8 rounded-xl border border-[#E8ECF0] flex items-center justify-center hover:bg-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} className="text-[#475569]" />
                </button>
              </div>

              {/* Cards del carrusel */}
              <div className="grid grid-cols-4 gap-4">
                {visibleMascotas.map((m) => {
                  const foto = getFotoUrl(m.fotos);
                  return (
                    <div key={m.id} onClick={onOpenMascotas}
                      className="group cursor-pointer rounded-2xl border border-[#E8ECF0] bg-[#F8FAFC] hover:border-[#CBD5E1] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all overflow-hidden">
                      {/* Foto */}
                      <div className="relative h-44 bg-[#EFF6FF] overflow-hidden">
                        {foto ? (
                          <img src={foto} alt={m.nombre}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-[#E2E8F0] flex items-center justify-center">
                              <span className="text-[#94A3B8] text-base font-bold">
                                {m.especie === "PERRO" ? "P" : m.especie === "GATO" ? "G" : "?"}
                              </span>
                            </div>
                            <span className="text-xs text-[#94A3B8]">{formatEspecie(m.especie)}</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            m.estado === "DISPONIBLE"
                              ? "bg-emerald-500 text-white"
                              : "bg-[#94A3B8] text-white"
                          }`}>
                            {m.estado === "DISPONIBLE" ? "Disponible" : "Adoptado"}
                          </span>
                        </div>
                      </div>
                      {/* Info */}
                      <div className="px-4 py-3.5 bg-white">
                        <p className="text-sm font-semibold text-[#0F172A] truncate">{m.nombre}</p>
                        <p className="text-xs text-[#94A3B8] mt-0.5 truncate">
                          {formatEspecie(m.especie)} &middot; {formatEdad(m.edadMeses)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Indicadores de página */}
              {mascotas.length > PER_PAGE && (
                <div className="flex justify-center gap-1.5 mt-5">
                  {Array.from({ length: Math.ceil(mascotas.length / PER_PAGE) }).map((_, i) => (
                    <button key={i} onClick={() => setSlide(i * PER_PAGE)}
                      className={`rounded-full transition-all ${
                        Math.floor(slide / PER_PAGE) === i
                          ? "w-5 h-1.5 bg-[#1E88E5]"
                          : "w-1.5 h-1.5 bg-[#CBD5E1] hover:bg-[#94A3B8]"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {!loading && adoptadas > 0 && (
          <div className="bg-white rounded-2xl border border-[#E8ECF0] shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-7 py-5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <TrendingUp size={22} className="text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-[#0F172A]">
                {adoptadas} mascota{adoptadas !== 1 ? "s" : ""} encontro un hogar
              </p>
              <p className="text-sm text-[#64748B] mt-0.5">
                Gracias a tu trabajo, {adoptadas} animal{adoptadas !== 1 ? "es tienen" : " tiene"} una familia
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {Array.from({ length: Math.min(adoptadas, 5) }).map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center">
                  <CheckCircle size={15} className="text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {mostrarPublicar && (
        <PublicarMascotaModal
          onClose={() => setMostrarPublicar(false)}
          onPublicada={() => { setMostrarPublicar(false); cargarDatos(); }}
        />
      )}
    </div>
  );
}
