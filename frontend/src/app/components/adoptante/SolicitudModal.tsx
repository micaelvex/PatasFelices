import { useState } from "react";
import { X, CheckCircle, AlertCircle, Home, Building2 } from "lucide-react";
import { api } from "../../../services/api";
import { MascotaResponse, getFotoUrl } from "../../../types/mascota";

interface Props {
  mascota: MascotaResponse;
  onClose: () => void;
}

export function SolicitudModal({ mascota, onClose }: Props) {
  const [form, setForm] = useState({
    motivacion: "",
    tieneExperiencia: false,
    tipoVivienda: "CASA",
    hayNinos: false,
  });
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const fotoUrl = getFotoUrl(mascota.fotos);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/solicitudes", {
        mascotaId: mascota.id,
        motivacion: form.motivacion,
        tieneExperiencia: form.tieneExperiencia,
        tipoVivienda: form.tipoVivienda,
        hayNinos: form.hayNinos,
      });
      setEnviado(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl z-10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#E8ECF0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#EFF6FF] shrink-0 border border-[#E8ECF0]">
              {fotoUrl ? (
                <img src={fotoUrl} alt={mascota.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#EFF6FF]">
                  <span className="text-[#1E88E5] text-xs font-bold">
                    {mascota.especie === "PERRO" ? "P" : mascota.especie === "GATO" ? "G" : "?"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">Solicitar adopción</h2>
              <p className="text-xs text-[#64748B]">
                {mascota.nombre} · {mascota.refugioNombre}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F8FAFC] flex items-center justify-center transition-colors"
          >
            <X size={17} className="text-[#94A3B8]" />
          </button>
        </div>

        {enviado ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">¡Solicitud enviada!</h3>
            <p className="text-[#64748B] text-sm leading-relaxed max-w-xs mx-auto mb-6">
              El refugio revisará tu solicitud y recibirás una respuesta pronto.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#1E88E5] text-white rounded-xl hover:bg-[#1976D2] transition-colors font-medium text-sm"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Motivación */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                ¿Por qué quieres adoptar a {mascota.nombre}?
                <span className="text-[#EF5350] ml-0.5">*</span>
              </label>
              <textarea
                value={form.motivacion}
                onChange={(e) => setForm({ ...form, motivacion: e.target.value })}
                required
                rows={4}
                placeholder="Cuéntanos sobre ti y por qué serías un buen hogar..."
                className="w-full px-4 py-3 rounded-xl border border-[#E8ECF0] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] resize-none transition-all"
              />
            </div>

            {/* Tipo de vivienda */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Tipo de vivienda
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "CASA", Icon: Home, label: "Casa", desc: "Con jardín o patio" },
                  { value: "DEPARTAMENTO", Icon: Building2, label: "Departamento", desc: "Espacio cerrado" },
                ].map(({ value, Icon, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, tipoVivienda: value })}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                      form.tipoVivienda === value
                        ? "border-[#1E88E5] bg-[#EFF6FF]"
                        : "border-[#E8ECF0] hover:border-[#CBD5E1] bg-white"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        form.tipoVivienda === value
                          ? "bg-[#1E88E5] text-white"
                          : "bg-[#F8FAFC] text-[#94A3B8]"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#0F172A]">{label}</div>
                      <div className="text-xs text-[#94A3B8]">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 bg-[#F8FAFC] rounded-xl p-4 border border-[#E8ECF0]">
              {[
                { field: "tieneExperiencia" as const, label: "Tengo experiencia previa con mascotas" },
                { field: "hayNinos" as const, label: "Hay niños en mi hogar" },
              ].map((item) => (
                <label key={item.field} className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form[item.field]}
                    onChange={(e) => setForm({ ...form, [item.field]: e.target.checked })}
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      form[item.field]
                        ? "bg-[#1E88E5] border-[#1E88E5]"
                        : "border-[#CBD5E1] bg-white"
                    }`}
                  >
                    {form[item.field] && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-[#334155]">{item.label}</span>
                </label>
              ))}
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#E8ECF0] text-[#64748B] hover:bg-[#F8FAFC] transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-[#1E88E5] text-white hover:bg-[#1976D2] transition-colors disabled:opacity-60 font-medium text-sm shadow-[0_4px_12px_rgba(30,136,229,0.28)]"
              >
                {loading ? "Enviando..." : "Enviar solicitud"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
