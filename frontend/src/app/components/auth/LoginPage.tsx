import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, Mail, Lock, Check } from "lucide-react";

interface Props {
  onGoToRegister: () => void;
  onForgotPassword: () => void;
  onBack: () => void;
}

export function LoginPage({ onGoToRegister, onForgotPassword, onBack }: Props) {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E8ECF0] rounded-xl text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:bg-white focus:border-[#1E88E5] focus:shadow-[0_0_0_3px_rgba(30,136,229,0.08)] transition-all";

  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo con foto ── */}
      <div className="hidden lg:block lg:w-[48%] sticky top-0 h-screen overflow-hidden">
        {/* Imagen de fondo */}
        <img
          src="/fondoinicio.png"
          alt="Mascota en adopción"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlay degradado para legibilidad */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,15,30,0.45) 0%, rgba(8,15,30,0.25) 40%, rgba(8,15,30,0.70) 100%)",
          }}
        />

        {/* Contenido sobre la imagen */}
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          {/* Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center text-3xl shadow-lg">
              🐾
            </div>
            <div>
              <p className="text-white font-bold text-2xl tracking-tight leading-none drop-shadow">
                Patas Felices
              </p>
              <p className="text-white/50 text-xs mt-1 tracking-wide">Puno, Perú</p>
            </div>
          </div>

          {/* Texto principal en la parte inferior */}
          <div>
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-4">
              Plataforma de adopción animal · Puno
            </p>
            <h2 className="text-[3rem] font-bold text-white leading-[1.1] mb-5 tracking-tight">
              Adoptar es<br />el acto más<br />humano
            </h2>
            <p className="text-white/65 text-base leading-relaxed mb-8 max-w-xs">
              Conectamos mascotas rescatadas con familias que les brindan un hogar lleno de amor.
            </p>

            {/* Features sin emojis */}
            <div className="space-y-3">
              {[
                "Más de 50 mascotas disponibles en la región",
                "Proceso de adopción 100% en línea",
                "Refugios y albergues verificados",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-white/75 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Panel formulario ── */}
      <div className="w-full lg:w-[52%] flex items-center justify-center bg-white px-6 py-16 min-h-screen">
        <div className="w-full max-w-[400px]">

          {/* Volver a inicio */}
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#1E88E5] text-sm font-medium mb-8 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Volver al inicio
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-2xl">
              🐾
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A] leading-none">Patas Felices</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">Puno, Perú</p>
            </div>
          </div>

          <div className="mb-9">
            <h1 className="text-[2rem] font-bold text-[#0F172A] tracking-tight">Bienvenido</h1>
            <p className="text-[#94A3B8] mt-1.5 text-[15px]">Inicia sesión para continuar</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3.5 rounded-2xl mb-6 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required autoComplete="email"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#334155]">Contraseña</label>
                <button type="button" onClick={onForgotPassword}
                  className="text-xs text-[#1E88E5] hover:text-[#1565C0] font-medium transition-colors">
                  ¿La olvidaste?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required autoComplete="current-password"
                  className={`${inputClass} pr-11`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors p-1">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-[0_4px_16px_rgba(30,136,229,0.35)] hover:shadow-[0_6px_20px_rgba(30,136,229,0.45)] active:scale-[0.98] mt-1"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Iniciar sesión <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[#F1F5F9]" />
            <span className="text-[#CBD5E1] text-xs">¿Sin cuenta?</span>
            <div className="flex-1 h-px bg-[#F1F5F9]" />
          </div>

          <button
            onClick={onGoToRegister}
            className="w-full py-3 rounded-xl border border-[#E8ECF0] text-[#334155] font-medium text-sm hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all active:scale-[0.98]"
          >
            Crear una cuenta nueva
          </button>
        </div>
      </div>
    </div>
  );
}
