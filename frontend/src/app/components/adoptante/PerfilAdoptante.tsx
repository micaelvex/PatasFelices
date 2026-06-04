import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Eye, EyeOff, User, ClipboardList } from "lucide-react";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

interface PerfilData {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  estado: string;
  fechaRegistro: string;
}

interface SolicitudResponse {
  id: number;
  mascotaNombre: string;
  mascotaEspecie: string;
  mascotaFoto: string | null;
  motivacion: string;
  estado: string;
  fechaSolicitud: string;
  refugioNombre: string;
}

interface Props {
  onClose: () => void;
}

type Tab = "perfil" | "solicitudes";

const estadoConfig: Record<string, { style: string; label: string; border: string }> = {
  PENDIENTE: {
    style: "bg-amber-50 text-amber-700 border border-amber-200",
    label: "Pendiente",
    border: "border-l-amber-400",
  },
  APROBADA: {
    style: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    label: "Aprobada",
    border: "border-l-emerald-400",
  },
  RECHAZADA: {
    style: "bg-red-50 text-red-600 border border-red-200",
    label: "Rechazada",
    border: "border-l-red-400",
  },
};

export function PerfilAdoptante({ onClose }: Props) {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState<Tab>("perfil");

  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [savingPerfil, setSavingPerfil] = useState(false);
  const [perfilOk, setPerfilOk] = useState(false);
  const [perfilError, setPerfilError] = useState("");

  const [passForm, setPassForm] = useState({ passwordActual: "", nuevaPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [passOk, setPassOk] = useState(false);
  const [passError, setPassError] = useState("");

  const [solicitudes, setSolicitudes] = useState<SolicitudResponse[]>([]);
  const [loadingSol, setLoadingSol] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => setVisible(true));
    cargarPerfil();
    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (tab === "solicitudes") cargarSolicitudes();
  }, [tab]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const cargarPerfil = async () => {
    try {
      const data = await api.get<PerfilData>("/perfil");
      setPerfil(data);
    } catch {}
  };

  const cargarSolicitudes = async () => {
    setLoadingSol(true);
    try {
      const data = await api.get<SolicitudResponse[]>("/solicitudes/mis-solicitudes");
      setSolicitudes(data);
    } catch {
    } finally {
      setLoadingSol(false);
    }
  };

  const guardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) return;
    setPerfilError("");
    setSavingPerfil(true);
    try {
      await api.put("/perfil", { nombre: perfil.nombre, telefono: perfil.telefono });
      setPerfilOk(true);
      setTimeout(() => setPerfilOk(false), 3000);
    } catch (err: unknown) {
      setPerfilError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSavingPerfil(false);
    }
  };

  const cambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setSavingPass(true);
    try {
      await api.put("/perfil/password", passForm);
      setPassOk(true);
      setPassForm({ passwordActual: "", nuevaPassword: "" });
      setTimeout(() => setPassOk(false), 3000);
    } catch (err: unknown) {
      setPassError(err instanceof Error ? err.message : "Error al cambiar contraseña");
    } finally {
      setSavingPass(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-[#E8ECF0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all bg-white";

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
        className={`relative bg-white rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-hidden shadow-2xl z-10 flex flex-col transition-all duration-200 ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-lg font-bold text-[#1E88E5] shrink-0">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{user?.nombre}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-2 py-0.5 bg-[#EFF6FF] text-[#1E88E5] rounded-md font-medium border border-[#BFDBFE]">
                  Adoptante
                </span>
                {perfil?.fechaRegistro && (
                  <span className="text-xs text-[#94A3B8]">
                    Desde{" "}
                    {new Date(perfil.fechaRegistro).toLocaleDateString("es-PE", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full border border-[#E8ECF0] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-[#64748B]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 pb-3 border-b border-[#E8ECF0] shrink-0">
          <div className="flex gap-1 bg-[#F1F5F9] rounded-xl p-1">
            {(
              [
                { id: "perfil" as Tab, label: "Mi Perfil", Icon: User },
                {
                  id: "solicitudes" as Tab,
                  label: `Solicitudes${solicitudes.length > 0 ? ` (${solicitudes.length})` : ""}`,
                  Icon: ClipboardList,
                },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === id
                    ? "bg-white text-[#0F172A] shadow-sm"
                    : "text-[#64748B] hover:text-[#334155]"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {/* ── Tab Perfil ── */}
          {tab === "perfil" && (
            <div className="space-y-5">
              {/* Datos personales */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-[#E8ECF0] p-5">
                <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Datos personales</h3>
                {perfil && (
                  <form onSubmit={guardarPerfil} className="space-y-3.5">
                    {perfilError && (
                      <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" />
                        {perfilError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={perfil.nombre}
                        onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        value={perfil.email}
                        disabled
                        className={`${inputClass} bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={perfil.telefono ?? ""}
                        onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                        placeholder="Ej: 951 234 567"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={savingPerfil}
                        className="px-5 py-2.5 bg-[#1E88E5] text-white rounded-xl hover:bg-[#1976D2] disabled:opacity-60 font-medium text-sm transition-colors"
                      >
                        {savingPerfil ? "Guardando..." : "Guardar cambios"}
                      </button>
                      {perfilOk && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-sm">
                          <CheckCircle size={14} /> Guardado
                        </span>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* Cambiar contraseña */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-[#E8ECF0] p-5">
                <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Cambiar contraseña</h3>
                <form onSubmit={cambiarPassword} className="space-y-3.5">
                  {passError && (
                    <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                      <AlertCircle size={15} className="shrink-0 mt-0.5" />
                      {passError}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                      Contraseña actual
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={passForm.passwordActual}
                        onChange={(e) =>
                          setPassForm({ ...passForm, passwordActual: e.target.value })
                        }
                        required
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                      Nueva contraseña
                    </label>
                    <input
                      type={showPass ? "text" : "password"}
                      value={passForm.nuevaPassword}
                      onChange={(e) =>
                        setPassForm({ ...passForm, nuevaPassword: e.target.value })
                      }
                      required
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={savingPass}
                      className="px-5 py-2.5 bg-[#334155] text-white rounded-xl hover:bg-[#1E293B] disabled:opacity-60 font-medium text-sm transition-colors"
                    >
                      {savingPass ? "Cambiando..." : "Cambiar contraseña"}
                    </button>
                    {passOk && (
                      <span className="flex items-center gap-1.5 text-emerald-600 text-sm">
                        <CheckCircle size={14} /> Actualizada
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── Tab Solicitudes ── */}
          {tab === "solicitudes" && (
            <div className="space-y-3">
              {loadingSol && (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-[3px] border-[#E8ECF0] border-t-[#1E88E5] rounded-full animate-spin" />
                </div>
              )}

              {!loadingSol && solicitudes.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] border border-[#E8ECF0] flex items-center justify-center mx-auto mb-3">
                    <ClipboardList size={20} className="text-[#CBD5E1]" />
                  </div>
                  <p className="text-sm font-medium text-[#0F172A] mb-1">Sin solicitudes aún</p>
                  <p className="text-xs text-[#94A3B8]">
                    Explora el catálogo y solicita adoptar a tu mascota ideal
                  </p>
                </div>
              )}

              {!loadingSol && solicitudes.length > 0 && (
                <>
                  <p className="text-xs text-[#94A3B8] mb-3">
                    {solicitudes.length} solicitud{solicitudes.length !== 1 ? "es" : ""} enviada
                    {solicitudes.length !== 1 ? "s" : ""}
                  </p>
                  {solicitudes.map((sol) => {
                    const cfg = estadoConfig[sol.estado];
                    return (
                      <div
                        key={sol.id}
                        className={`bg-white rounded-xl border border-[#E8ECF0] border-l-4 overflow-hidden ${
                          cfg?.border ?? "border-l-[#E8ECF0]"
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                                <span className="text-[#1E88E5] text-xs font-bold">
                                  {sol.mascotaEspecie === "PERRO" ? "P" : sol.mascotaEspecie === "GATO" ? "G" : "?"}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#0F172A]">
                                  {sol.mascotaNombre}
                                </p>
                                <p className="text-xs text-[#64748B]">{sol.refugioNombre}</p>
                                <p className="text-xs text-[#94A3B8] mt-0.5">
                                  {new Date(sol.fechaSolicitud).toLocaleDateString("es-PE", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            {cfg && (
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${cfg.style}`}
                              >
                                {cfg.label}
                              </span>
                            )}
                          </div>

                          {sol.estado === "APROBADA" && (
                            <div className="mt-3 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-700">
                              ¡Tu solicitud fue aprobada! El refugio se pondrá en contacto pronto.
                            </div>
                          )}
                          {sol.estado === "RECHAZADA" && (
                            <div className="mt-3 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                              No fue posible en esta ocasión. ¡Sigue buscando tu mascota ideal!
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
