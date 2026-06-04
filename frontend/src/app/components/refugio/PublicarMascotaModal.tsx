import { useState, useRef } from "react";
import { X, CheckCircle, AlertCircle, Camera, Trash2, Plus } from "lucide-react";
import { api } from "../../../services/api";

interface Props {
  onClose: () => void;
  onPublicada: () => void;
}

interface MascotaCreada {
  id: number;
}

export function PublicarMascotaModal({ onClose, onPublicada }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    especie: "PERRO",
    raza: "",
    edadMeses: "",
    sexo: "MACHO",
    tamanio: "MEDIANO",
    descripcion: "",
    requisitos: "",
    vacunado: false,
    esterilizado: false,
    desparasitado: false,
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exitoso, setExitoso] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5 MB");
      return;
    }
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
    setError("");
  };

  const quitarFoto = () => {
    setFoto(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const mascota = await api.post<MascotaCreada>("/mascotas", {
        nombre: form.nombre,
        especie: form.especie,
        raza: form.raza || null,
        edadMeses: form.edadMeses ? parseInt(form.edadMeses) : null,
        sexo: form.sexo,
        tamanio: form.tamanio,
        descripcion: form.descripcion,
        requisitos: form.requisitos || null,
        vacunado: form.vacunado,
        esterilizado: form.esterilizado,
        desparasitado: form.desparasitado,
      });

      if (foto && mascota?.id) {
        await api.uploadFile(`/mascotas/${mascota.id}/fotos`, foto);
      }

      setExitoso(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-[#E8ECF0] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all bg-white";

  const selectClass =
    "w-full px-4 py-2.5 rounded-xl border border-[#E8ECF0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all bg-white cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl z-10 max-h-[92vh] overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#E8ECF0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <Plus size={18} className="text-[#1E88E5]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">Nueva publicación</h2>
              <p className="text-xs text-[#94A3B8]">Completa los datos de la mascota</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#E8ECF0] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-[#64748B]" />
          </button>
        </div>

        {exitoso ? (
          <div className="px-6 py-14 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">¡Publicada con éxito!</h3>
            <p className="text-[#64748B] text-sm mb-6 max-w-xs mx-auto">
              La mascota ya aparece en el catálogo público de adopciones.
            </p>
            <button
              onClick={() => { onPublicada(); onClose(); }}
              className="px-8 py-3 bg-[#1E88E5] text-white rounded-xl hover:bg-[#1976D2] transition-colors font-medium text-sm"
            >
              Ver mis publicaciones
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Foto */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
                Foto
                <span className="ml-1 font-normal normal-case text-[#94A3B8]">JPG, PNG o WebP · máx. 5 MB</span>
              </label>
              {fotoPreview ? (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-[#E8ECF0]">
                  <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={quitarFoto}
                    className="absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-36 rounded-2xl border-2 border-dashed border-[#E8ECF0] hover:border-[#1E88E5] hover:bg-[#EFF6FF]/40 transition-all flex flex-col items-center justify-center gap-2 text-[#94A3B8] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] group-hover:bg-[#EFF6FF] flex items-center justify-center transition-colors">
                    <Camera size={20} className="group-hover:text-[#1E88E5] transition-colors" />
                  </div>
                  <span className="text-sm group-hover:text-[#1E88E5] transition-colors">Seleccionar foto</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFoto}
                className="hidden"
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                Nombre <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                placeholder="Nombre de la mascota"
                required
                className={inputClass}
              />
            </div>

            {/* Especie + Sexo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                  Especie <span className="text-[#EF4444]">*</span>
                </label>
                <select value={form.especie} onChange={(e) => set("especie", e.target.value)} className={selectClass}>
                  <option value="PERRO">Perro</option>
                  <option value="GATO">Gato</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                  Sexo <span className="text-[#EF4444]">*</span>
                </label>
                <select value={form.sexo} onChange={(e) => set("sexo", e.target.value)} className={selectClass}>
                  <option value="MACHO">Macho</option>
                  <option value="HEMBRA">Hembra</option>
                </select>
              </div>
            </div>

            {/* Especificar tipo de animal cuando es OTRO */}
            {form.especie === "OTRO" && (
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                  ¿Qué tipo de animal es? <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  value={form.raza}
                  onChange={(e) => set("raza", e.target.value)}
                  placeholder="Ej: Conejo, Loro, Hamster, Iguana..."
                  required
                  className={inputClass}
                />
              </div>
            )}

            {/* Raza + Edad */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                  Raza
                </label>
                <input
                  type="text"
                  value={form.raza}
                  onChange={(e) => set("raza", e.target.value)}
                  placeholder="Ej: Labrador"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                  Edad (meses)
                </label>
                <input
                  type="number"
                  value={form.edadMeses}
                  onChange={(e) => set("edadMeses", e.target.value)}
                  placeholder="Ej: 12"
                  min="0"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Tamaño */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                Tamaño <span className="text-[#EF4444]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "PEQUENIO", label: "Pequeño" },
                  { value: "MEDIANO", label: "Mediano" },
                  { value: "GRANDE", label: "Grande" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("tamanio", opt.value)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.tamanio === opt.value
                        ? "border-[#1E88E5] bg-[#EFF6FF] text-[#1E88E5]"
                        : "border-[#E8ECF0] text-[#64748B] hover:border-[#CBD5E1]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                Descripción
              </label>
              <textarea
                value={form.descripcion}
                onChange={(e) => set("descripcion", e.target.value)}
                rows={3}
                placeholder="Personalidad y carácter de la mascota..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Requisitos */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                Requisitos para adoptar
                <span className="ml-1 font-normal normal-case text-[#94A3B8]">(opcional)</span>
              </label>
              <textarea
                value={form.requisitos}
                onChange={(e) => set("requisitos", e.target.value)}
                rows={2}
                placeholder="Ej: Debe tener casa con jardín..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Estado de salud */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
                Estado de salud
              </label>
              <div className="flex gap-3">
                {[
                  { field: "vacunado", label: "Vacunado" },
                  { field: "esterilizado", label: "Esterilizado" },
                  { field: "desparasitado", label: "Desparasitado" },
                ].map((item) => (
                  <label key={item.field} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={form[item.field as keyof typeof form] as boolean}
                      onChange={(e) => set(item.field, e.target.checked)}
                    />
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      form[item.field as keyof typeof form]
                        ? "bg-[#1E88E5] border-[#1E88E5]"
                        : "border-[#CBD5E1] bg-white"
                    }`}>
                      {form[item.field as keyof typeof form] && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-[#334155]">{item.label}</span>
                  </label>
                ))}
              </div>
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
                {loading ? (foto ? "Subiendo foto..." : "Publicando...") : "Publicar mascota"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
