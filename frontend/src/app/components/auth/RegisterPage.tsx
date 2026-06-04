import { useState } from "react";
import { useAuth, RegisterData } from "../../../context/AuthContext";
import { Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, Mail, Lock, Phone, User, Building2, Check, MapPin } from "lucide-react";

interface Props {
  onGoToLogin: () => void;
  onBack: () => void;
}

type Rol = "ADOPTANTE" | "REFUGIO";

const panels: Record<Rol, {
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  features: string[];
}> = {
  ADOPTANTE: {
    image: "/fondoregistroadop.png",
    tag: "Para adoptantes",
    title: "Dale una segunda\noportunidad",
    subtitle: "Miles de mascotas esperan un hogar. Encuentra a tu compañero ideal y transforma dos vidas.",
    features: [
      "Explora mascotas disponibles en tu zona",
      "Guarda y compara tus favoritos",
      "Solicita adopciones en minutos",
    ],
  },
  REFUGIO: {
    image: "/fondoregistrorefu.png",
    tag: "Para refugios y albergues",
    title: "Gestiona tus\nadopciones",
    subtitle: "Publica animales rescatados, recibe solicitudes y encuentra familias responsables.",
    features: [
      "Publica mascotas con fotos y detalles",
      "Recibe y gestiona solicitudes fácilmente",
      "Panel completo de seguimiento",
    ],
  },
};

export function RegisterPage({ onGoToLogin, onBack }: Props) {
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterData>({
    nombre: "", email: "", password: "", telefono: "",
    rol: "ADOPTANTE", nombreOrganizacion: "", distrito: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [fading, setFading]   = useState(false);

  const set = (field: keyof RegisterData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const changeRol = (newRol: string) => {
    if (newRol === form.rol) return;
    setFading(true);
    setTimeout(() => { set("rol", newRol); setFading(false); }, 220);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  const panel = panels[form.rol as Rol];

  const inputClass =
    "w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-[#E8ECF0] rounded-xl text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:bg-white focus:border-[#1E88E5] focus:shadow-[0_0_0_3px_rgba(30,136,229,0.08)] transition-all";

  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none";

  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo ── */}
      <div className="hidden lg:block lg:w-[42%] sticky top-0 h-screen overflow-hidden">
        <img
          key={panel.image}
          src={panel.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.22s ease" }}
        />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(8,15,30,0.40) 0%, rgba(8,15,30,0.15) 35%, rgba(8,15,30,0.75) 100%)" }} />

        <div
          className="absolute inset-0 flex flex-col justify-between p-10"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(10px)" : "translateY(0)",
            transition: "opacity 0.22s ease, transform 0.22s ease",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center text-3xl shadow-lg">
              🐾
            </div>
            <div>
              <p className="text-white font-bold text-2xl tracking-tight leading-none drop-shadow">Patas Felices</p>
              <p className="text-white/50 text-xs mt-1 tracking-wide">Puno, Perú</p>
            </div>
          </div>

          <div>
            <span className="inline-block text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
              {panel.tag}
            </span>
            <h2 className="text-[2.6rem] font-bold text-white leading-[1.12] mb-4 tracking-tight whitespace-pre-line">
              {panel.title}
            </h2>
            <p className="text-white/60 text-[15px] leading-relaxed mb-8 max-w-[280px]">
              {panel.subtitle}
            </p>
            <div className="space-y-3">
              {panel.features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-white/70 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Panel formulario ── */}
      <div className="w-full lg:w-[58%] bg-white flex items-center justify-center px-6 py-6 min-h-screen">
        <div className="w-full max-w-[460px]">

          {/* Volver a inicio */}
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#1E88E5] text-sm font-medium mb-6 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Volver al inicio
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-2xl">🐾</div>
            <div>
              <p className="text-xl font-bold text-[#0F172A] leading-none">Patas Felices</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">Puno, Perú</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Crear cuenta</h1>
            <p className="text-[#94A3B8] mt-0.5 text-sm">Únete y comienza a hacer la diferencia</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* Selector de tipo */}
            <div>
              <p className="text-xs font-medium text-[#475569] mb-1.5">Tipo de cuenta</p>
              <div className="flex p-1 bg-[#F1F5F9] rounded-xl gap-1">
                {[
                  { value: "ADOPTANTE", label: "Adoptante" },
                  { value: "REFUGIO",   label: "Refugio / Albergue" },
                ].map((opt) => (
                  <button key={opt.value} type="button" onClick={() => changeRol(opt.value)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      form.rol === opt.value
                        ? "bg-white text-[#0F172A] shadow-[0_1px_4px_rgba(0,0,0,0.10)]"
                        : "text-[#64748B] hover:text-[#334155]"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fila 1: Nombre + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1.5">Nombre completo</label>
                <div className="relative">
                  <User size={15} className={iconClass} />
                  <input type="text" value={form.nombre}
                    onChange={(e) => set("nombre", e.target.value)}
                    placeholder="Tu nombre"
                    required autoComplete="name" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1.5">Correo electrónico</label>
                <div className="relative">
                  <Mail size={15} className={iconClass} />
                  <input type="email" value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="tu@correo.com"
                    required autoComplete="email" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Fila 2: Contraseña + Teléfono */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock size={15} className={iconClass} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Mín. 6 caracteres"
                    required minLength={6} autoComplete="new-password"
                    className={`${inputClass} pr-9`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1.5">Teléfono</label>
                <div className="relative">
                  <Phone size={15} className={iconClass} />
                  <input type="tel" value={form.telefono}
                    onChange={(e) => set("telefono", e.target.value)}
                    placeholder="987 654 321"
                    required autoComplete="tel" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Campos refugio con animación */}
            <div style={{
              maxHeight: form.rol === "REFUGIO" ? "120px" : "0",
              opacity: form.rol === "REFUGIO" ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.4s ease, opacity 0.3s ease",
            }}>
              <div className="grid grid-cols-2 gap-3 pt-0.5">
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1.5">Nombre de la organización</label>
                  <div className="relative">
                    <Building2 size={15} className={iconClass} />
                    <input type="text" value={form.nombreOrganizacion}
                      onChange={(e) => set("nombreOrganizacion", e.target.value)}
                      placeholder="Nombre del refugio"
                      required={form.rol === "REFUGIO"}
                      className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1.5">Distrito donde operan</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                    <select value={form.distrito}
                      onChange={(e) => set("distrito", e.target.value)}
                      required={form.rol === "REFUGIO"}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-[#E8ECF0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#1E88E5] focus:shadow-[0_0_0_3px_rgba(30,136,229,0.08)] transition-all cursor-pointer">
                      <option value="">Selecciona</option>
                      <option value="Puno">Puno</option>
                      <option value="Juliaca">Juliaca</option>
                      <option value="Caracoto">Caracoto</option>
                      <option value="Ilave">Ilave</option>
                      <option value="Ayaviri">Ayaviri</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-[0_4px_16px_rgba(30,136,229,0.35)] hover:shadow-[0_6px_20px_rgba(30,136,229,0.45)] active:scale-[0.98]">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Crear cuenta <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-[#F1F5F9]" />
            <span className="text-[#CBD5E1] text-xs">¿Ya tienes cuenta?</span>
            <div className="flex-1 h-px bg-[#F1F5F9]" />
          </div>

          <button onClick={onGoToLogin}
            className="w-full py-2.5 rounded-xl border border-[#E8ECF0] text-[#334155] font-medium text-sm hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all active:scale-[0.98]">
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
