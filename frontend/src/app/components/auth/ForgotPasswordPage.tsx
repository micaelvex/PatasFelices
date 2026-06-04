import { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { api } from "../../../services/api";

interface Props {
  onVolver: () => void;
}

export function ForgotPasswordPage({ onVolver }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setEnviado(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐾</div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Patas Felices</h1>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E0E0E0] p-8 shadow-sm">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 text-[#757575] hover:text-[#2C3E50] mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Volver al login
          </button>

          {enviado ? (
            <div className="text-center py-4">
              <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#2C3E50] mb-2">
                Correo enviado
              </h2>
              <p className="text-[#757575] text-sm mb-6">
                Si el correo <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña. Revisa también tu bandeja de spam.
              </p>
              <button
                onClick={onVolver}
                className="px-6 py-3 bg-[#1E88E5] text-white rounded-[12px] hover:bg-[#1976D2]"
              >
                Volver al login
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-[#2C3E50] mb-2">
                ¿Olvidaste tu contraseña?
              </h2>
              <p className="text-[#757575] text-sm mb-6">
                Ingresa tu correo y te enviaremos un enlace para restablecerla.
              </p>

              {error && (
                <div className="flex items-center gap-2 bg-[#FFCDD2] text-red-700 px-4 py-3 rounded-[12px] mb-4 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    required
                    className="w-full px-4 py-3 rounded-[12px] border border-[#E0E0E0] text-[#2C3E50] placeholder-[#BDBDBD] focus:outline-none focus:border-[#1E88E5] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1E88E5] text-white rounded-[12px] hover:bg-[#1976D2] disabled:opacity-60 font-medium"
                >
                  {loading ? "Enviando..." : "Enviar enlace"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
