import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Building2, MapPin } from "lucide-react";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

interface PerfilData {
  nombre: string;
  email: string;
  telefono: string;
  nombreOrganizacion: string;
  distrito: string;
}

interface Props {
  onClose: () => void;
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-[#E8ECF0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all bg-white";

const DISTRITOS = ["Puno", "Juliaca", "Caracoto", "Ilave", "Ayaviri"];

export function PerfilRefugioModal({ onClose }: Props) {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [saving, setSaving] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => setVisible(true));
    cargarPerfil();
    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(frame);
    };
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) return;
    setError("");
    setSaving(true);
    try {
      await api.put("/perfil", {
        nombre: perfil.nombre,
        telefono: perfil.telefono,
        nombreOrganizacion: perfil.nombreOrganizacion,
        distrito: perfil.distrito,
      });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const orgName = perfil?.nombreOrganizacion || user?.nombre || "R";
  const orgInitial = orgName.charAt(0).toUpperCase();

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
        className={`relative bg-white rounded-2xl w-full max-w-lg max-h-[88vh] overflow-hidden shadow-2xl z-10 flex flex-col transition-all duration-200 ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1E88E5] flex items-center justify-center text-white font-bold text-lg shrink-0">
              {orgInitial}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">
                {perfil?.nombreOrganizacion || user?.nombre || "Mi Refugio"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-2 py-0.5 bg-[#EFF6FF] text-[#1E88E5] rounded-md font-medium border border-[#BFDBFE]">
                  Refugio
                </span>
                {perfil?.distrito && (
                  <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                    <MapPin size={10} />
                    {perfil.distrito}
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

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {!perfil && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-[3px] border-[#E8ECF0] border-t-[#1E88E5] rounded-full animate-spin" />
            </div>
          )}

          {perfil && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Información de contacto */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
                  Información de contacto
                </p>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                      Nombre del representante
                    </label>
                    <input
                      type="text"
                      value={perfil.nombre}
                      onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                      required
                      placeholder="Nombre completo"
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
                </div>
              </div>

              {/* Información del refugio */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
                  Información del refugio
                </p>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Building2 size={11} />
                        Nombre de la organización
                      </span>
                    </label>
                    <input
                      type="text"
                      value={perfil.nombreOrganizacion ?? ""}
                      onChange={(e) =>
                        setPerfil({ ...perfil, nombreOrganizacion: e.target.value })
                      }
                      placeholder="Nombre del refugio u organización"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} />
                        Distrito
                      </span>
                    </label>
                    <select
                      value={perfil.distrito ?? ""}
                      onChange={(e) => setPerfil({ ...perfil, distrito: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Seleccionar distrito</option>
                      {DISTRITOS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-3 pt-1 pb-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#1E88E5] text-white rounded-xl hover:bg-[#1976D2] disabled:opacity-60 font-medium text-sm transition-colors"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                {guardado && (
                  <span className="flex items-center gap-1.5 text-emerald-600 text-sm">
                    <CheckCircle size={14} />
                    Guardado
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
