// services/api/auth.js

// Normaliza la base: usa tu .env local
// NEXT_PUBLIC_API_URL=http://localhost/LaravelControl-master/public
const RAW  = process.env.NEXT_PUBLIC_API_URL || "http://localhost/LaravelControl-master/public";
const ROOT = RAW.replace(/\/+$/, "");
export const API_BASE = ROOT.endsWith("/api") ? ROOT : `${ROOT}/api`;

// Conservamos tu clave "token" para no romper lo ya guardado
const TOKEN_KEY   = "token";
const USER_KEY    = "usuario";

// Helpers de token
export const getToken   = () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
export const setToken   = (t) => { if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, t); };
export const clearToken = ()   => { if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY); };

export const getUsuario = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
};
export const setUsuario = (u) => { if (typeof window !== "undefined") localStorage.setItem(USER_KEY, JSON.stringify(u || null)); };
export const clearUsuario = () => { if (typeof window !== "undefined") localStorage.removeItem(USER_KEY); };

/**
 * Login con { usuario, password }.
 * Guarda token y (opcionalmente) el usuario devuelto por el backend.
 */
export async function login(formData) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
    // NO usamos credentials con tokens
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  if (data?.token) setToken(data.token);
  if (data?.usuario) setUsuario(data.usuario);

  return data; // { usuario, token }
}

/**
 * Logout: llama al endpoint protegido y limpia el storage SIEMPRE.
 * Si el backend no responde, igual limpiamos el storage.
 */
export async function logout({ redirectTo = "/login" } = {}) {
  const token = getToken();

  if (token) {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // si falla la red o el backend, ignoramos y limpiamos igual
    }
  }

  // Limpieza local siempre
  clearToken();
  clearUsuario();

  // Redirección opcional en cliente
  if (typeof window !== "undefined" && redirectTo) {
    window.location.href = redirectTo;
  }
}

/** Cabecera Authorization para tus otros fetch */
export function authHeader() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
