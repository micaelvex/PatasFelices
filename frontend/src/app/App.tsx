import { useState } from "react";
import { LogOut, User, Heart, ChevronDown, FileText, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/auth/ResetPasswordPage";
import { AdopterView } from "./components/adoptante/AdopterView";
import { FavoritosView } from "./components/adoptante/FavoritosView";
import { PerfilAdoptante } from "./components/adoptante/PerfilAdoptante";
import { ShelterPanel } from "./components/refugio/ShelterPanel";
import { SolicitudesDrawer } from "./components/refugio/SolicitudesDrawer";
import { MisMascotasPanel } from "./components/refugio/MisMascotasPanel";
import { PerfilRefugioModal } from "./components/refugio/PerfilRefugioModal";
import { AdminPanel } from "./components/admin/AdminPanel";

type AuthPage = "landing" | "login" | "register" | "forgot" | "reset";

export default function App() {
  const { user, logout, isLoading } = useAuth();
  const [authPage, setAuthPage] = useState<AuthPage>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has("token") ? "reset" : "landing";
  });
  const [menuOpen, setMenuOpen] = useState(false);

  // Adoptante overlays
  const [showPerfil,     setShowPerfil]     = useState(false);
  const [showFavoritos,  setShowFavoritos]  = useState(false);

  // Refugio overlays
  const [showSolicitudes,  setShowSolicitudes]  = useState(false);
  const [showMascotas,     setShowMascotas]     = useState(false);
  const [showPerfilRefugio,setShowPerfilRefugio] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-[#E8ECF0] border-t-[#1E88E5] rounded-full animate-spin" />
          <p className="text-[#64748B] text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authPage === "register")
      return <RegisterPage onGoToLogin={() => setAuthPage("login")} onBack={() => setAuthPage("landing")} />;
    if (authPage === "forgot")
      return <ForgotPasswordPage onVolver={() => setAuthPage("login")} />;
    if (authPage === "reset")
      return <ResetPasswordPage onVolver={() => setAuthPage("login")} />;
    if (authPage === "login")
      return (
        <LoginPage
          onGoToRegister={() => setAuthPage("register")}
          onForgotPassword={() => setAuthPage("forgot")}
          onBack={() => setAuthPage("landing")}
        />
      );
    return (
      <LandingPage
        onLogin={() => setAuthPage("login")}
        onRegister={() => setAuthPage("register")}
      />
    );
  }

  const rolLabel =
    user.rol === "ADOPTANTE" ? "Adoptante" :
    user.rol === "REFUGIO"   ? "Refugio"   : "Admin";

  const navItem = (
    icon: React.ReactNode,
    label: string,
    onClick: () => void,
    iconBg = "bg-[#F1F5F9]"
  ) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#334155] hover:bg-[#F8FAFC] transition-colors"
    >
      <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#E8ECF0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <button className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <h1 className="text-xl font-semibold text-[#0F172A]">Patas Felices</h1>
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center text-sm font-bold text-[#1E88E5]">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium text-[#334155]">
                  {user.nombre}
                </span>
                <span className="hidden md:block text-xs bg-[#EFF6FF] text-[#1E88E5] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
                  {rolLabel}
                </span>
                <ChevronDown size={15} className="text-[#94A3B8]" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#E8ECF0] shadow-xl py-2 z-50">

                  {/* Adoptante items */}
                  {user.rol === "ADOPTANTE" && (
                    <>
                      {navItem(<User size={14} className="text-[#64748B]" />, "Mi perfil", () => { setShowPerfil(true); setMenuOpen(false); })}
                      {navItem(<Heart size={14} className="text-[#EF5350]" />, "Mis favoritos", () => { setShowFavoritos(true); setMenuOpen(false); }, "bg-red-50")}
                    </>
                  )}

                  {/* Refugio items */}
                  {user.rol === "REFUGIO" && (
                    <>
                      {navItem(<FileText size={14} className="text-[#1E88E5]" />, "Solicitudes", () => { setShowSolicitudes(true); setMenuOpen(false); }, "bg-[#EFF6FF]")}
                      {navItem(<Home size={14} className="text-emerald-600" />, "Mis mascotas", () => { setShowMascotas(true); setMenuOpen(false); }, "bg-emerald-50")}
                      {navItem(<User size={14} className="text-[#64748B]" />, "Perfil del refugio", () => { setShowPerfilRefugio(true); setMenuOpen(false); })}
                    </>
                  )}

                  <div className="border-t border-[#E8ECF0] my-1.5 mx-3" />
                  {navItem(<LogOut size={14} className="text-[#EF4444]" />, "Cerrar sesión", () => { logout(); setMenuOpen(false); }, "bg-red-50")}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
      )}

      {/* Vistas principales */}
      {user.rol === "ADOPTANTE" && <AdopterView />}
      {user.rol === "REFUGIO"   && (
        <ShelterPanel
          onOpenSolicitudes={() => setShowSolicitudes(true)}
          onOpenMascotas={() => setShowMascotas(true)}
        />
      )}
      {user.rol === "ADMIN"     && <AdminPanel />}

      {/* Overlays adoptante */}
      {user.rol === "ADOPTANTE" && showFavoritos && (
        <FavoritosView onClose={() => setShowFavoritos(false)} />
      )}
      {user.rol === "ADOPTANTE" && showPerfil && (
        <PerfilAdoptante onClose={() => setShowPerfil(false)} />
      )}

      {/* Overlays refugio */}
      {user.rol === "REFUGIO" && showSolicitudes && (
        <SolicitudesDrawer onClose={() => setShowSolicitudes(false)} />
      )}
      {user.rol === "REFUGIO" && showMascotas && (
        <MisMascotasPanel onClose={() => setShowMascotas(false)} />
      )}
      {user.rol === "REFUGIO" && showPerfilRefugio && (
        <PerfilRefugioModal onClose={() => setShowPerfilRefugio(false)} />
      )}
    </div>
  );
}
