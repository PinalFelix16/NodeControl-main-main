
// ===== Base URL normalizada =====
const RAW  = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const ROOT = RAW.replace(/\/+$/, "");
export const API_BASE = ROOT.endsWith("/api") ? ROOT : `${ROOT}/api`;

// ===== Token (opcional) =====
const TOKEN_KEY = "token";
const getToken = () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// ===== Helper =====
async function requestJSON(url, opts = {}) {
  const { headers, ...rest } = opts;
  const res = await fetch(url, {
    credentials: "omit",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "pragma": "no-cache",
      "cache-control": "no-cache, no-store, must-revalidate",
      ...(headers || {}),
      ...authHeaders(),
    },
    ...rest,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
  return data ?? null;
}

// Normaliza respuesta: [], {data: []}, {maestros: []}
function normalizeList(x) {
  if (Array.isArray(x)) return x;
  if (x && Array.isArray(x.data)) return x.data;
  if (x && Array.isArray(x.maestros)) return x.maestros;
  return [];
}

// ============ API ============
export async function fetchMaestros(status = "") {
  const q = status !== "" && status !== null && status !== undefined ? `?status=${status}` : "";
  try {
    const raw = await requestJSON(`${API_BASE}/maestros${q}`);
    return normalizeList(raw);
  } catch (e) {
    console.warn("[fetchMaestros] fallback []:", e?.message || e);
    return [];
  }
}

export async function fetchMaestroAllData(id) {
  if (id == null) throw new Error("id maestro requerido");
  return requestJSON(`${API_BASE}/maestros/${id}`);
}

export async function storeMaestro(payload) {
  return requestJSON(`${API_BASE}/maestros`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
}

export async function updateMaestro(payload, id) {
  if (id == null) throw new Error("id maestro requerido");
  return requestJSON(`${API_BASE}/maestros/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
}
