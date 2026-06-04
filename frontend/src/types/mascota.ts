export interface MascotaResponse {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edadMeses: number;
  sexo: string;
  tamanio: string;
  descripcion: string;
  requisitos: string;
  fotos: string[];
  estado: string;
  vacunado: boolean;
  esterilizado: boolean;
  desparasitado: boolean;
  refugioId: number;
  refugioNombre: string;
  refugioDistrito: string;
  refugioTelefono: string;
  esFavorito: boolean;
}

export function formatEdad(meses: number): string {
  if (!meses) return "Edad desconocida";
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const anios = Math.floor(meses / 12);
  return `${anios} ${anios === 1 ? "año" : "años"}`;
}

export function formatTamanio(t: string): string {
  const map: Record<string, string> = {
    PEQUENIO: "Pequeño",
    MEDIANO: "Mediano",
    GRANDE: "Grande",
  };
  return map[t] || t;
}

export function formatEspecie(e: string): string {
  const map: Record<string, string> = {
    PERRO: "Perro",
    GATO:  "Gato",
    OTRO:  "Otro",
  };
  return map[e] || e;
}

export function formatSexo(s: string): string {
  return s === "MACHO" ? "♂ Macho" : "♀ Hembra";
}

export function getFotoUrl(fotos: string[]): string | null {
  if (!fotos || fotos.length === 0) return null;
  return `http://localhost:8080/uploads/${fotos[0]}`;
}
