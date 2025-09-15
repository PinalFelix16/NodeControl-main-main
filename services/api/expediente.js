// services/api/expediente.js
// -------------------------------------------------------------
// OBJETIVO: no tocar tu UI. Mantenemos los mismos nombres
// de funciones, pero arreglamos la base URL y mapeamos los
// POSTs a rutas reales del backend.
// -------------------------------------------------------------



// 1) Base correcta: sin /public y SIN duplicar /api
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api')
  .replace(/\/+$/, ''); // quita barras finales

// 2) Token opcional (si usas Bearer)
const TOKEN_KEY = 'token';
const getToken = () =>
  (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null);
const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// 3) Helper con logs útiles (para no “Failed to fetch” a ciegas)
async function getJSON(path, opts = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...authHeaders(),
      ...(opts.headers || {}),
    },
    cache: 'no-store',
    ...opts,
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    console.error('[API ERROR]', url, msg, data || text);
    throw new Error(msg);
  }
  return data;
}

// ================== GETs ==================

export const fetchAlumnosStatus = (id_alumno) =>
  getJSON(`/alumnos/${id_alumno}/expediente`);

export const fetchHistorialAlumno = (id_alumno) =>
  getJSON(`/alumnos/${id_alumno}/pagos`);

export const fetchInformacionAlumno = (id_alumno) =>
  getJSON(`/alumnos/${id_alumno}`);

// Programas/clases del alumno (filtrando en front)
export async function fetchProgramasAlumno(id_alumno) {
  const all = await getJSON('/clases');
  return Array.isArray(all)
    ? all.filter((c) => String(c.alumno_id) === String(id_alumno))
    : [];
}

// ================== POSTs ==================
// Mantengo los NOMBRES que ya usas en la UI, pero
// mapeo a la ruta que sí existe: POST /api/pagos.
// Puedes pasar campos extra (importe, concepto, id_programa, etc.)

export function postInscripcion(id_alumno, extra = {}) {
  const payload = { alumno_id: id_alumno, tipo: 'inscripcion', ...extra };
  return getJSON('/pagos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function postRecargo(id_alumno, extra = {}) {
  const payload = { alumno_id: id_alumno, tipo: 'recargo', ...extra };
  return getJSON('/pagos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
