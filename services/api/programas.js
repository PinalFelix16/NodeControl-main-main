// services/api/programas.js
import { API_BASE } from "./clases";

const TOKEN_KEY = "token";
const getToken = (explicit) =>
  explicit ?? (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
const authHeaders = (t) => (t ? { Authorization: `Bearer ${t}` } : {});

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

  let data = null;
  try { data = await res.json(); } catch { try { data = await res.text(); } catch {} }
  if (!res.ok) {
    const msg = (data && data.message) || (typeof data === "string" && data) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data ?? null;
}

export const fetchProgramas = (token) =>
  request(`/programas?_t=${Date.now()}`, { token });

export const fetchProgramaById = (id, token) =>
  request(`/programas/${id}`, { token });

const toNum = (x) => (Number.isFinite(Number(x)) ? Number(x) : null);

function extractProgramaId(resp) {
  if (resp == null) return null;
  const direct = toNum(resp);
  if (direct != null) return direct;
  const candidates = [
    resp.id_programa, resp.id,
    resp?.programa?.id_programa, resp?.programa?.id,
    resp?.data?.id_programa, resp?.data?.id,
    resp?.lastInsertId, resp?.insert_id,
  ];
  for (const c of candidates) {
    const n = toNum(c);
    if (n != null) return n;
  }
  if (Array.isArray(resp) && resp.length) {
    const n = toNum(resp[0]?.id_programa ?? resp[0]?.id);
    if (n != null) return n;
  }
  return null;
}

export async function createProgramaWithClases(payload, token) {
  if (!payload || typeof payload !== "object") throw new Error("Payload inválido");

  // 1) Crear PROGRAMA (o reutilizar si ya existe)
  const programaBody = {
    nombre: String(payload.programa?.nombre || "").trim(),
    mensualidad:
      payload.programa?.mensualidad != null ? Number(payload.programa.mensualidad) : 0,
    ...(payload.programa?.nivel ? { nivel: payload.programa.nivel } : {}),
    ...(payload.programa?.complex != null ? { complex: Number(payload.programa.complex) } : {}),
  };
  if (!programaBody.nombre) throw new Error("El nombre del programa es obligatorio");

  let respPrograma, id_programa = null;

  try {
    respPrograma = await request("/programas", {
      method: "POST",
      body: programaBody,
      token,
    });
    id_programa = extractProgramaId(respPrograma);
  } catch (err) {
    const isDuplicate = /duplicate entry/i.test(err.message || "");
    if (!isDuplicate) throw err;

    // Duplicado: buscamos el existente
    const lista = await fetchProgramas(token);
    const arr = Array.isArray(lista) ? lista : (Array.isArray(lista?.data) ? lista.data : []);
    const coincidentes = arr.filter(
      (p) =>
        String(p.nombre).trim().toLowerCase() === programaBody.nombre.toLowerCase() &&
        toNum(p.mensualidad) === toNum(programaBody.mensualidad)
    );
    if (coincidentes.length) {
      id_programa = coincidentes
        .map((p) => toNum(p.id_programa ?? p.id))
        .filter((n) => n != null)
        .sort((a, b) => b - a)[0];
    } else if (arr.length) {
      id_programa = arr
        .map((p) => toNum(p.id_programa ?? p.id))
        .filter((n) => n != null)
        .sort((a, b) => b - a)[0];
    }
    if (id_programa == null) throw new Error("No se pudo localizar el programa existente");
  }

  if (id_programa == null) {
    // Fallback extra: listado por si el POST devolvió algo raro
    const lista = await fetchProgramas(token);
    const arr = Array.isArray(lista) ? lista : (Array.isArray(lista?.data) ? lista.data : []);
    if (arr.length) {
      id_programa = arr
        .map((p) => toNum(p.id_programa ?? p.id))
        .filter((n) => n != null)
        .sort((a, b) => b - a)[0];
    }
  }

  if (id_programa == null) throw new Error("No se pudo obtener id_programa del programa creado");

  // 2) Crear CLASES
  const clases = Array.isArray(payload.clases) ? payload.clases : [];
  for (const c of clases) {
    const informacion = (c?.informacion ?? "");
    const claseBody = {
      id_programa: Number(id_programa),
      alumno_id: 0, // requerido por tu backend
      nombre: String(c?.nombre || "").trim(),     // en BD: 'nombre'
      id_maestro: c?.id_maestro ? String(c.id_maestro) : "",
      informacion: typeof informacion === "string" ? informacion : String(informacion),
      porcentaje: c?.porcentaje != null ? Number(c.porcentaje) : 0,
      personal: c?.personal != null ? Number(c.personal) : 0,
    };
    if (!claseBody.nombre) throw new Error("Cada clase requiere nombre");
    await request("/clases", { method: "POST", body: claseBody, token });
  }

  return { id_programa: Number(id_programa), programa: respPrograma };
}

export const createPrograma = (payload, token) =>
  request("/programas", { method: "POST", body: payload, token });

export const updatePrograma = (id, payload, token) =>
  request(`/programas/${id}`, { method: "PUT", body: payload, token });

export const deletePrograma = (id, token) =>
  request(`/programas/${id}`, { method: "DELETE", token });
