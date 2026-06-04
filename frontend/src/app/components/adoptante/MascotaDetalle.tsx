import { useState, useEffect } from "react";
import { X, Heart, Phone, MapPin, CheckCircle, XCircle, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { SolicitudModal } from "./SolicitudModal";
import {
  MascotaResponse,
  formatEdad,
  formatTamanio,
  formatEspecie,
  formatSexo,
} from "../../../types/mascota";

interface Props {
  mascota: MascotaResponse;
  onClose: () => void;
  onFavoritoToggle: (id: number) => void;
}

export function MascotaDetalle({ mascota, onClose, onFavoritoToggle }: Props) {
  const { user } = useAuth();
  const [esFavorito, setEsFavorito] = useState(mascota.esFavorito);
  const [fotoActiva, setFotoActiva] = useState(0);
  const [mostrarSolicitud, setMostrarSolicitud] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const totalFotos = mascota.fotos?.length ?? 0;
  const fotoUrl = totalFotos > 0
    ? `http://localhost:8080/uploads/${mascota.fotos[fotoActiva]}`
    : null;

  const prevFoto = () => setFotoActiva((i) => (i - 1 + totalFotos) % totalFotos);
  const nextFoto = () => setFotoActiva((i) => (i + 1) % totalFotos);

  const toggleFavorito = async () => {
    if (!user) return;
    try {
      if (esFavorito) {
        await api.delete(`/favoritos/${mascota.id}`);
      } else {
        await api.post(`/favoritos/${mascota.id}`, {});
      }
      setEsFavorito(!esFavorito);
      onFavoritoToggle(mascota.id);
    } catch {}
  };

  const stats = [
    { label: "Especie", value: formatEspecie(mascota.especie) },
    { label: "Sexo",    value: formatSexo(mascota.sexo) },
    { label: "Tamaño",  value: formatTamanio(mascota.tamanio) },
    { label: "Edad",    value: formatEdad(mascota.edadMeses) },
    { label: "Raza",    value: mascota.raza || "Mestizo" },
  ];

  const saludItems = [
    { label: "Vacunado",      ok: mascota.vacunado },
    { label: "Esterilizado",  ok: mascota.esterilizado },
    { label: "Desparasitado", ok: mascota.desparasitado },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" onClick={onClose} />

        {/* Modal — ancho, una sola columna */}
        <div className="relative bg-white rounded-3xl w-full max-w-3xl shadow-2xl z-10 overflow-hidden">

          {/* ── Imagen arriba ── */}
          <div className="relative w-full h-56 bg-[#EFF6FF]">
            {fotoUrl ? (
              <img src={fotoUrl} alt={mascota.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-[#E2E8F0] flex items-center justify-center">
                  <span className="text-[#94A3B8] text-xl font-bold">
                    {mascota.especie === "PERRO" ? "P" : mascota.especie === "GATO" ? "G" : "?"}
                  </span>
                </div>
                <span className="text-xs text-[#94A3B8]">{formatEspecie(mascota.especie)}</span>
              </div>
            )}

            {/* Overlay inferior para transición suave */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Badge especie */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#1E88E5] rounded-xl text-xs font-semibold shadow-sm">
                {formatEspecie(mascota.especie)}
              </span>
            </div>

            {/* Favorito + Cerrar */}
            <div className="absolute top-4 right-4 flex gap-2">
              {user && (
                <button onClick={toggleFavorito}
                  className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform">
                  <Heart size={17} className={esFavorito ? "fill-[#EF5350] text-[#EF5350]" : "text-[#94A3B8]"} />
                </button>
              )}
              <button onClick={onClose}
                className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors">
                <X size={16} className="text-[#64748B]" />
              </button>
            </div>

            {/* Navegación fotos */}
            {totalFotos > 1 && (
              <>
                <button onClick={prevFoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/85 rounded-full shadow flex items-center justify-center hover:bg-white transition-colors">
                  <ChevronLeft size={16} className="text-[#334155]" />
                </button>
                <button onClick={nextFoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/85 rounded-full shadow flex items-center justify-center hover:bg-white transition-colors">
                  <ChevronRight size={16} className="text-[#334155]" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {mascota.fotos.map((_, idx) => (
                    <button key={idx} onClick={() => setFotoActiva(idx)}
                      className={`rounded-full transition-all ${idx === fotoActiva ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60"}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Información debajo ── */}
          <div className="px-7 py-5 space-y-4">

            {/* Nombre + refugio */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#0F172A]">{mascota.nombre}</h1>
                <p className="text-sm text-[#64748B] mt-0.5">{mascota.refugioNombre}</p>
              </div>
              {/* Info refugio inline */}
              <div className="flex items-center gap-3 shrink-0 text-xs text-[#64748B] mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-[#94A3B8]" />
                  {mascota.refugioDistrito}
                </span>
                {mascota.refugioTelefono && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-[#94A3B8]" />
                    {mascota.refugioTelefono}
                  </span>
                )}
              </div>
            </div>

            {/* Stats — fila única de 5 */}
            <div className="grid grid-cols-5 divide-x divide-[#E8ECF0] bg-[#F8FAFC] rounded-2xl border border-[#E8ECF0] overflow-hidden">
              {stats.map((s) => (
                <div key={s.label} className="px-4 py-3">
                  <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">{s.label}</p>
                  <p className="text-sm font-semibold text-[#0F172A] truncate">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Salud + Descripción en fila */}
            <div className="grid grid-cols-2 gap-4">
              {/* Estado de salud */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-[#E8ECF0] px-4 py-3.5">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Shield size={12} className="text-[#1E88E5]" />
                  <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Estado de salud</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {saludItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      {item.ok ? (
                        <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle size={14} className="text-[#CBD5E1] shrink-0" />
                      )}
                      <span className={`text-xs ${item.ok ? "text-[#334155]" : "text-[#94A3B8]"}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Descripción / Requisitos */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-[#E8ECF0] px-4 py-3.5">
                {mascota.descripcion ? (
                  <>
                    <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                      Sobre {mascota.nombre}
                    </p>
                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-4">{mascota.descripcion}</p>
                  </>
                ) : mascota.requisitos ? (
                  <>
                    <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mb-2">Requisitos</p>
                    <p className="text-xs text-amber-700 leading-relaxed line-clamp-4">{mascota.requisitos}</p>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs text-[#CBD5E1]">Sin descripción</p>
                  </div>
                )}
              </div>
            </div>

            {/* Requisitos separados si hay descripción */}
            {mascota.descripcion && mascota.requisitos && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 flex items-start gap-2">
                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider shrink-0 mt-0.5">Requisitos</p>
                <p className="text-xs text-amber-700 leading-relaxed line-clamp-2">{mascota.requisitos}</p>
              </div>
            )}

            {/* CTA */}
            {user?.rol === "ADOPTANTE" ? (
              <button
                onClick={() => setMostrarSolicitud(true)}
                className="w-full py-3.5 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-semibold rounded-2xl transition-all shadow-[0_4px_14px_rgba(30,136,229,0.30)] hover:shadow-[0_6px_20px_rgba(30,136,229,0.40)] active:scale-[0.99]">
                Solicitar adopción
              </button>
            ) : !user ? (
              <div className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl text-center">
                <p className="text-sm text-[#1E88E5]">Inicia sesión como adoptante para enviar una solicitud</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {mostrarSolicitud && (
        <SolicitudModal mascota={mascota} onClose={() => setMostrarSolicitud(false)} />
      )}
    </>
  );
}
