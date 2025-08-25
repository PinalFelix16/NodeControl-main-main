// services/api/clases.js
import { fetchMaestros as _fetchMaestros } from "./maestros";

const RAW  = process.env.NEXT_PUBLIC_API_URL || "http://localhost/LaravelControl-master/public";
const ROOT = RAW.replace(/\/+$/, "");
export const API_BASE = ROOT.endsWith("/api") ? ROOT : `${ROOT}/api`;

const TOKEN_KEY = "token";
const getToken = () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

async function getJSON(url, opts = {}) {
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

// ===== ALUMNOS =====
export async function fetchExpedienteAlumno(id_alumno) {
  if (id_alumno == null) throw new Error("id_alumno requerido");
  return getJSON(`${API_BASE}/alumnos/${id_alumno}/expediente`);
}
export async function fetchProgramasAlumno(id_alumno) {
  const all = await getJSON(`${API_BASE}/clases`);
  return Array.isArray(all)
    ? all.filter((c) => String(c.alumno_id) === String(id_alumno))
    : [];
}

// ===== CLASES / PROGRAMAS =====
export const fetchClasesRaw    = () =>
  getJSON(`${API_BASE}/clases?status=1&_t=${Date.now()}`);
export const fetchProgramasRaw = () => getJSON(`${API_BASE}/programas`);
export const fetchMaestrosRaw  = () => (_fetchMaestros ? _fetchMaestros().catch(() => []) : Promise.resolve([]));

export async function fetchClases() {
  const [programas, clasesRaw, maestros] = await Promise.all([
    fetchProgramasRaw(),
    fetchClasesRaw(),
    fetchMaestrosRaw(),
  ]);

  const byMaestro = new Map(
    (Array.isArray(maestros) ? maestros : []).map((m) => [
      String(m.id_maestro),
      m.nombre ?? m.nombre_maestro ?? "",
    ])
  );

  const clases = Array.isArray(clasesRaw) ? clasesRaw : [];
  const classesByPrograma = clases.reduce((acc, c) => {
    const k = String(c.id_programa ?? "");
    (acc[k] ||= []).push({
      id_clase: c.id_clase ?? c.id,
      nombre: c.nombre ?? "",
      informacion: c.informacion ?? "",
      nombre_maestro: byMaestro.get(String(c.id_maestro ?? "")) || "",
    });
    return acc;
  }, {});

  return (Array.isArray(programas) ? programas : []).map((p) => {
    const idp = String(p.id_programa ?? p.id ?? "");
    return {
      id_programa: p.id_programa ?? p.id ?? null,
      nombre_programa: p.nombre,
      mensualidad: Number(p.mensualidad) || 0,
      clases: classesByPrograma[idp] || [],
    };
  });
}

export async function createPrograma(payload) {
  return getJSON(`${API_BASE}/programas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
export async function createClase(payload) {
  return getJSON(`${API_BASE}/clases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
export function fetchClaseById(id) {
  if (id == null) throw new Error("id clase requerido");
  return getJSON(`${API_BASE}/clases/${id}`);
}
export const getClase = fetchClaseById;
export function updateClase(id, body) {
  if (id == null) throw new Error("id clase requerido");
  return getJSON(`${API_BASE}/clases/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
export function deleteClase(id) {
  if (id == null) throw new Error("id clase requerido");
  return (async () => {
    const res = await fetch(`${API_BASE}/clases/${id}`, {
      method: "DELETE",
      cache: "no-store",
      headers: { ...authHeaders() },
    });
    if (!res.ok && res.status !== 204) {
      let msg = "";
      try { msg = await res.text(); } catch {}
      throw new Error(`DELETE ${res.status}: ${msg || "No se pudo eliminar"}`);
    }
    return true;
  })();
}
