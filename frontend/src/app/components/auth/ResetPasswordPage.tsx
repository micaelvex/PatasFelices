import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { api } from "../../../services/api";

interface Props {
  onVolver: () => void;
}

export function ResetPasswordPage({ onVolver }: Props) {
  const [token, setToken] = useState("");
  const [form, setForm] = useState({ nuevaPassword: "", confirmarPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exitoso, setExitoso] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
    else setError("Enlace inválido. Solicita uno nuevo.");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nuevaPassword !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        nuevaPassword: form.nuevaPassword,
        confirmarPassword: form.confirmarPassword,
      });
      setExitoso(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "El enlace expiró o ya fue usado");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-[12px] border border-[#E0E0E0] text-[#2C3E50] placeholder-[#BDBDBD] focus:outline-none focus:border-[#1E88E5] transition-colors";

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐾</div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Patas Felices</h1>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E0E0E0] p-8 shadow-sm">
          {exitoso ? (
            <div className="text-center py-4">
              <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#2C3E50] mb-2">
                Contraseña actualizada
              </h2>
              <p className="text-[#757575] text-sm mb-6">
                Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <button
                onClick={onVolver}
                className="px-6 py-3 bg-[#1E88E5] text-white rounded-[12px] hover:bg-[#1976D2]"
              >
                Iniciar sesión
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-[#2C3E50] mb-2">
                Nueva contraseña
              </h2>
              <p className="text-[#757575] text-sm mb-6">
                Escribe tu nueva contraseña (mínimo 6 caracteres).
              </p>

              {error && (
                <div className="flex items-center gap-2 bg-[#FFCDD2] text-red-700 px-4 py-3 rounded-[12px] mb-4 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.nuevaPassword}
                      onChange={(e) => setForm({ ...form, nuevaPassword: e.target.value })}
                      required minLength={6}
                      placeholder="Mínimo 6 caracteres"
                      className={`${inputClass} pr-12`}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575]">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                    Confirmar contraseña
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.confirmarPassword}
                    onChange={(e) => setForm({ ...form, confirmarPassword: e.target.value })}
                    required minLength={6}
                    placeholder="Repite la contraseña"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full py-3 bg-[#1E88E5] text-white rounded-[12px] hover:bg-[#1976D2] disabled:opacity-60 font-medium"
                >
                  {loading ? "Guardando..." : "Guardar contraseña"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
