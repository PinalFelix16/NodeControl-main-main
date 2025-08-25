// services/api/programas.js
import { API_BASE } from "./clases"; // base URL normalizada (…/public/api)

// ====== Helpers de autorización ======
const TOKEN_KEY = "token";
const getToken = (explicit) =>
  explicit ?? (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
const authHeaders = (t) => (t ? { Authorization: `Bearer ${t}` } : {});

// ====== Helper de fetch (sin cookies) ======
async function request(path, { method = "GET", body, token, headers } = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, {
    method,
    credentials: "omit",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...authHeaders(getToken(token)),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Intentar leer JSON; si no, texto
  let data = null;
  try {
    data = await res.json();
  } catch {
    try { data = await res.text(); } catch {}
  }

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === "string" && data) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data ?? null;
}

// ====== Endpoints de Programas ======
export const fetchProgramas = (token) =>
  request("/programas", { token });

export const fetchProgramaById = (id, token) =>
  request(`/programas/${id}`, { token });

// ✔ Crear programa + clases (POST /programas/with-clases)
export const createProgramaWithClases = (payload, token) =>
  request("/pgwc", { method: "POST", body: payload, token }); 

// CRUD simple
export const createPrograma = (payload, token) =>
  request("/programas", { method: "POST", body: payload, token });

export const updatePrograma = (id, payload, token) =>
  request(`/programas/${id}`, { method: "PUT", body: payload, token });

export const deletePrograma = (id, token) =>
  request(`/programas/${id}`, { method: "DELETE", token });
