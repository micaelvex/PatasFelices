import { useEffect, useState } from "react";
import { Users, PawPrint, FileText, RefreshCw, Lock, Unlock } from "lucide-react";
import { api } from "../../../services/api";

interface UsuarioResponse {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  estado: string;
  fechaRegistro: string;
  nombreOrganizacion?: string;
  distrito?: string;
}

interface StatsResponse {
  totalUsuarios: number;
  totalAdoptantes: number;
  totalRefugios: number;
  totalMascotas: number;
  mascotasDisponibles: number;
  mascotasAdoptadas: number;
  totalSolicitudes: number;
  solicitudesPendientes: number;
}

const rolBadge = (rol: string) => {
  switch (rol) {
    case "ADMIN":
      return <span className="px-3 py-1 bg-[#E1BEE7] text-[#6A1B9A] rounded-full text-sm">Admin</span>;
    case "REFUGIO":
      return <span className="px-3 py-1 bg-[#E3F2FD] text-[#1E88E5] rounded-full text-sm">Refugio</span>;
    default:
      return <span className="px-3 py-1 bg-[#F5F5F5] text-[#757575] rounded-full text-sm">Adoptante</span>;
  }
};

export function AdminPanel() {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroRol, setFiltroRol] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [u, s] = await Promise.all([
        api.get<UsuarioResponse[]>("/admin/usuarios"),
        api.get<StatsResponse>("/admin/stats"),
      ]);
      setUsuarios(u);
      setStats(s);
    } catch {} finally {
      setLoading(false);
    }
  };

  const toggleBloqueo = async (id: number) => {
    try {
      const updated = await api.put<UsuarioResponse>(`/admin/usuarios/${id}/toggle-bloqueo`);
      setUsuarios((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch {}
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideRol = !filtroRol || u.rol === filtroRol;
    const coincideBusqueda =
      !busqueda ||
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase());
    return coincideRol && coincideBusqueda;
  });

  const statCards = stats
    ? [
        { label: "Total usuarios", value: stats.totalUsuarios, icon: Users, color: "#1E88E5", sub: `${stats.totalAdoptantes} adoptantes · ${stats.totalRefugios} refugios` },
        { label: "Mascotas", value: stats.totalMascotas, icon: PawPrint, color: "#66BB6A", sub: `${stats.mascotasDisponibles} disponibles · ${stats.mascotasAdoptadas} adoptadas` },
        { label: "Solicitudes", value: stats.totalSolicitudes, icon: FileText, color: "#FFA726", sub: `${stats.solicitudesPendientes} pendientes` },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2C3E50]">Panel de Administrador</h1>
            <p className="text-[#757575] mt-1">Gestiona usuarios y supervisa la plataforma</p>
          </div>
          <button
            onClick={cargarDatos}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E0E0E0] rounded-[12px] text-[#757575] hover:bg-[#F5F5F5] transition-colors"
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="text-center py-12 text-[#757575]">Cargando datos...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[16px] border border-[#E0E0E0] hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-[12px]" style={{ backgroundColor: `${stat.color}20` }}>
                      <stat.icon size={24} style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-[#757575] text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-[#2C3E50]">{stat.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#757575] ml-16">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white rounded-[16px] border border-[#E0E0E0] overflow-hidden">
              <div className="p-6 border-b border-[#E0E0E0]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold text-[#2C3E50]">
                    Gestión de Usuarios
                    <span className="ml-2 text-sm font-normal text-[#757575]">
                      ({usuariosFiltrados.length} de {usuarios.length})
                    </span>
                  </h2>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Buscar por nombre o email..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="px-4 py-2 rounded-[12px] border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#1E88E5] w-56"
                    />
                    <select
                      value={filtroRol}
                      onChange={(e) => setFiltroRol(e.target.value)}
                      className="px-4 py-2 rounded-[12px] border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#1E88E5]"
                    >
                      <option value="">Todos los roles</option>
                      <option value="ADOPTANTE">Adoptantes</option>
                      <option value="REFUGIO">Refugios</option>
                      <option value="ADMIN">Admins</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5F5F5]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#2C3E50]">Nombre</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#2C3E50]">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#2C3E50]">Rol</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#2C3E50]">Estado</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#2C3E50]">Registrado</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#2C3E50]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0E0E0]">
                    {usuariosFiltrados.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[#2C3E50]">{u.nombre}</p>
                            {u.nombreOrganizacion && (
                              <p className="text-xs text-[#757575]">{u.nombreOrganizacion}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#757575] text-sm">{u.email}</td>
                        <td className="px-6 py-4">{rolBadge(u.rol)}</td>
                        <td className="px-6 py-4">
                          {u.estado === "ACTIVO" ? (
                            <span className="px-3 py-1 bg-[#C8E6C9] text-[#2E7D32] rounded-full text-sm">Activo</span>
                          ) : (
                            <span className="px-3 py-1 bg-[#FFCDD2] text-[#C62828] rounded-full text-sm">Bloqueado</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#757575] text-sm">
                          {u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleDateString("es-PE") : "-"}
                        </td>
                        <td className="px-6 py-4">
                          {u.rol !== "ADMIN" && (
                            <button
                              onClick={() => toggleBloqueo(u.id)}
                              title={u.estado === "ACTIVO" ? "Bloquear cuenta" : "Desbloquear cuenta"}
                              className={`p-2 rounded-[12px] transition-colors ${
                                u.estado === "ACTIVO"
                                  ? "bg-[#FFCDD2] text-[#C62828] hover:bg-[#EF9A9A]"
                                  : "bg-[#C8E6C9] text-[#2E7D32] hover:bg-[#A5D6A7]"
                              }`}
                            >
                              {u.estado === "ACTIVO" ? <Lock size={16} /> : <Unlock size={16} />}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {usuariosFiltrados.length === 0 && (
                  <div className="text-center py-12 text-[#757575]">
                    No se encontraron usuarios con ese filtro
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
