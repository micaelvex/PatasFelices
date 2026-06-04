import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../services/api";

export interface AuthUser {
  id: number;
  nombre: string;
  rol: "ADOPTANTE" | "REFUGIO" | "ADMIN";
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  rol: string;
  nombreOrganizacion?: string;
  distrito?: string;
}

interface AuthResponse {
  token: string;
  rol: string;
  nombre: string;
  id: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("pf_token");
    const savedUser = localStorage.getItem("pf_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const saveSession = (data: AuthResponse) => {
    const authUser: AuthUser = {
      id: data.id,
      nombre: data.nombre,
      rol: data.rol as AuthUser["rol"],
    };
    localStorage.setItem("pf_token", data.token);
    localStorage.setItem("pf_user", JSON.stringify(authUser));
    setToken(data.token);
    setUser(authUser);
  };

  const login = async (email: string, password: string) => {
    const data = await api.post<AuthResponse>("/auth/login", { email, password });
    saveSession(data);
  };

  const register = async (data: RegisterData) => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    saveSession(response);
  };

  const logout = () => {
    localStorage.removeItem("pf_token");
    localStorage.removeItem("pf_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
