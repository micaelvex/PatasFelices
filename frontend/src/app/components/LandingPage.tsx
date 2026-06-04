import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Heart, ClipboardList, CheckCircle, Menu, X, Shield, Users, Star } from "lucide-react";

interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

export function LandingPage({ onLogin, onRegister }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm border-b border-[#E8ECF0] shadow-sm" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐾</span>
            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? "text-[#0F172A]" : "text-white"}`}>
              Patas Felices
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Cómo funciona", id: "como-funciona" },
              { label: "Para refugios", id: "refugios" },
              { label: "Nosotros", id: "nosotros" },
            ].map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className={`text-sm font-medium transition-colors hover:opacity-100 ${
                  scrolled ? "text-[#64748B] hover:text-[#0F172A]" : "text-white/80 hover:text-white"
                }`}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={onLogin}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                scrolled
                  ? "text-[#334155] hover:bg-[#F8FAFC] border border-[#E8ECF0]"
                  : "text-white/90 hover:text-white hover:bg-white/10 border border-white/30"
              }`}>
              Iniciar sesión
            </button>
            <button onClick={onRegister}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#1E88E5] hover:bg-[#1565C0] text-white transition-all shadow-[0_2px_8px_rgba(30,136,229,0.35)]">
              Registrarse
            </button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden transition-colors ${scrolled ? "text-[#0F172A]" : "text-white"}`}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#E8ECF0] px-6 py-4 space-y-3">
            {[
              { label: "Cómo funciona", id: "como-funciona" },
              { label: "Para refugios", id: "refugios" },
              { label: "Nosotros", id: "nosotros" },
            ].map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="block w-full text-left text-sm font-medium text-[#64748B] py-2">
                {item.label}
              </button>
            ))}
            <div className="flex gap-3 pt-2 border-t border-[#F1F5F9]">
              <button onClick={onLogin} className="flex-1 py-2.5 rounded-xl border border-[#E8ECF0] text-sm font-medium text-[#334155]">
                Iniciar sesión
              </button>
              <button onClick={onRegister} className="flex-1 py-2.5 rounded-xl bg-[#1E88E5] text-sm font-semibold text-white">
                Registrarse
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Fondo con imagen */}
        <div className="absolute inset-0">
          <img src="/imagensup.png" alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(105deg, rgba(8,15,30,0.82) 0%, rgba(8,15,30,0.65) 50%, rgba(8,15,30,0.30) 100%)"
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1E88E5]" />
              <span className="text-white/60 text-sm font-medium tracking-widest uppercase">
                Puno, Perú
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.08] mb-6 tracking-tight">
              Conectamos mascotas
              <span className="block text-[#60A5FA]">con hogares</span>
            </h1>

            <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-lg">
              La plataforma de adopción animal de la región Puno. Encuentra a tu compañero ideal o publica mascotas en busca de un hogar.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={onRegister}
                className="flex items-center gap-2.5 px-7 py-4 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-semibold rounded-2xl transition-all shadow-[0_8px_24px_rgba(30,136,229,0.40)] hover:shadow-[0_12px_32px_rgba(30,136,229,0.50)] active:scale-[0.98] text-base">
                Quiero adoptar <ArrowRight size={18} />
              </button>
              <button onClick={onRegister}
                className="flex items-center gap-2.5 px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all border border-white/25 backdrop-blur-sm text-base">
                Soy un refugio
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 mt-12">
              {[
                { icon: Heart, text: "50+ mascotas disponibles" },
                { icon: Shield, text: "Refugios verificados" },
                { icon: MapPin, text: "Región Puno" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <Icon size={13} className="text-white/70" />
                  </div>
                  <span className="text-white/60 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-0.5 h-8 bg-white/30 rounded-full" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#0F172A] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50+",   label: "Mascotas disponibles" },
              { value: "5+",    label: "Refugios registrados" },
              { value: "100%",  label: "Proceso en línea" },
              { value: "Puno",  label: "Región de cobertura" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-white mb-2">{s.value}</p>
                <p className="text-sm text-white/40 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section id="como-funciona" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-[#1E88E5] uppercase tracking-widest mb-3">Proceso simple</p>
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Adoptar es fácil</h2>
            <p className="text-[#64748B] text-lg max-w-xl mx-auto">
              En tres pasos puedes encontrar a tu nuevo compañero de vida
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Heart,
                title: "Explora mascotas",
                desc: "Navega por el catálogo de mascotas disponibles. Filtra por especie, tamaño, distrito y más.",
                color: "bg-[#EFF6FF] text-[#1E88E5]",
              },
              {
                step: "02",
                icon: ClipboardList,
                title: "Envía una solicitud",
                desc: "Cuéntanos sobre ti y tu hogar. El refugio revisará tu solicitud y te dará una respuesta.",
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Dale un hogar",
                desc: "Una vez aprobada tu solicitud, el refugio se pondrá en contacto para coordinar la adopción.",
                color: "bg-violet-50 text-violet-600",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative bg-white rounded-3xl p-8 border border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all group">
                  <span className="absolute top-7 right-7 text-6xl font-black text-[#F1F5F9] group-hover:text-[#E8ECF0] transition-colors select-none">
                    {item.step}
                  </span>
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-6`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-3">{item.title}</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button onClick={onRegister}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-semibold rounded-2xl transition-all shadow-[0_4px_14px_rgba(30,136,229,0.30)]">
              Comenzar ahora <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Para refugios ── */}
      <section id="refugios" className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Imagen */}
            <div className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img src="/imagenmed.png" alt="Refugio" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#EFF6FF] rounded-3xl -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#F8FAFC] rounded-2xl border border-[#E8ECF0] -z-10" />
            </div>

            {/* Contenido */}
            <div className="order-1 lg:order-2">
              <p className="text-xs font-bold text-[#1E88E5] uppercase tracking-widest mb-4">Para organizaciones</p>
              <h2 className="text-4xl font-bold text-[#0F172A] mb-5 leading-tight">
                Gestiona tus adopciones desde un solo lugar
              </h2>
              <p className="text-[#64748B] text-lg leading-relaxed mb-8">
                Registra tu refugio, publica animales rescatados y recibe solicitudes de adoptantes verificados. Todo 100% en línea.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "Publica mascotas con fotos y descripción detallada",
                  "Recibe y gestiona solicitudes de adopción",
                  "Aprueba o rechaza solicitudes con un clic",
                  "Panel de estadísticas de tu refugio",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle size={13} className="text-emerald-600" />
                    </div>
                    <span className="text-sm text-[#475569]">{item}</span>
                  </div>
                ))}
              </div>

              <button onClick={onRegister}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold rounded-2xl transition-all">
                Registrar mi refugio <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nosotros ── */}
      <section id="nosotros" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-[#1E88E5] uppercase tracking-widest mb-4">Nuestra misión</p>
          <h2 className="text-4xl font-bold text-[#0F172A] mb-6 leading-tight">
            Cada mascota merece<br />un hogar lleno de amor
          </h2>
          <p className="text-[#64748B] text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            Patas Felices nació para conectar los refugios y albergues de la región Puno con familias que buscan un compañero de vida. Creemos que la adopción responsable cambia tanto la vida del animal como la de quienes los acogen.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Heart,    value: "Amor",        desc: "Promovemos el vínculo entre mascotas y familias" },
              { icon: Shield,   value: "Confianza",   desc: "Refugios y adoptantes verificados en nuestra plataforma" },
              { icon: Users,    value: "Comunidad",   desc: "Construimos una red de cuidadores en toda la región" },
            ].map(({ icon: Icon, value, desc }) => (
              <div key={value} className="bg-white rounded-2xl border border-[#E8ECF0] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-[#1E88E5]" />
                </div>
                <p className="text-base font-bold text-[#0F172A] mb-2">{value}</p>
                <p className="text-sm text-[#64748B] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/imageninf.png" alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(8,15,30,0.88) 0%, rgba(21,101,192,0.80) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-white/80 text-sm font-medium">Adopción responsable</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            ¿Listo para cambiar<br />una vida?
          </h2>
          <p className="text-white/65 text-xl mb-10 leading-relaxed">
            Únete a Patas Felices hoy y sé parte de la comunidad de adopción animal más activa de Puno.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={onRegister}
              className="flex items-center gap-2.5 px-8 py-4 bg-white text-[#1E88E5] font-bold rounded-2xl hover:bg-[#F8FAFC] transition-all shadow-xl text-base">
              Crear cuenta gratis <ArrowRight size={18} />
            </button>
            <button onClick={onLogin}
              className="flex items-center gap-2.5 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all border border-white/25 text-base">
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0F172A] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🐾</span>
            <span className="text-white font-semibold">Patas Felices</span>
            <span className="text-white/30 text-sm ml-2">· Puno, Perú</span>
          </div>
          <p className="text-white/30 text-sm">
            © 2026 Patas Felices. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            <button onClick={onLogin} className="text-white/40 hover:text-white/80 text-sm transition-colors">
              Iniciar sesión
            </button>
            <button onClick={onRegister} className="text-white/40 hover:text-white/80 text-sm transition-colors">
              Registrarse
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
