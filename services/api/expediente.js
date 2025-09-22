// services/api/expediente.js
// -------------------------------------------------------------
// OBJETIVO: mantener tu UI intacta. Solo corregimos los POST
// y robustecemos el cruce Programas/Clases sin romper nada.
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

// 3) Helper con logs útiles
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

// ------------------ Programas y clases del alumno ------------------
// Devuelve SOLO programas que tengan al menos una clase.
// Usa normalización de IDs para evitar duplicados/ruidos.
export async function fetchProgramasAlumno(id_alumno) {
  const [programasAll, clasesAll] = await Promise.all([
    getJSON('/programas'),
    getJSON('/clases'),
  ]);

  // Normaliza el id de programa
  const toPid = (obj) =>
    String(
      obj?.id_programa ??
      obj?.programa_id ??
      obj?.id ??
      obj?.programa ?? ''
    ).trim();

  // Indexa clases por programa
  const clasesPorPrograma = new Map();
  (Array.isArray(clasesAll) ? clasesAll : []).forEach((c) => {
    const pid = toPid(c);
    if (!pid) return;
    if (!clasesPorPrograma.has(pid)) clasesPorPrograma.set(pid, []);
    clasesPorPrograma.get(pid).push({
      id_clase:    c.id_clase ?? c.id ?? null,
      nombre:      c.nombre ?? c.titulo ?? '',
      informacion: c.informacion ?? c.descripcion ?? '',
      maestro:     c.maestro ?? c.docente ?? '',
      horario:     c.horario ?? c.hora ?? '',
      alumno_id:   c.alumno_id ?? null,
      mensualidad: Number(c.mensualidad ?? c.precio ?? 0),
    });
  });

  // SOLO programas que tienen al menos una clase
  const list = (Array.isArray(programasAll) ? programasAll : [])
    .map((p) => {
      const pid = toPid(p);
      const clases = clasesPorPrograma.get(pid) || [];
      const inscrito = clases.some((c) => String(c.alumno_id) === String(id_alumno));
      return {
        id_programa: Number(((p.id_programa ?? p.programa_id ?? p.id ?? pid) || 0)),
        nombre:      p.nombre || 'Programa',
        mensualidad: Number(p.mensualidad ?? 0) || 0,
        clases,
        inscrito,
      };
    })
    .filter((p) => Array.isArray(p.clases) && p.clases.length > 0) // ← clave para volver al comportamiento anterior
    .sort((a, b) => Number(b.inscrito) - Number(a.inscrito));

  return list;
}



// ================== POSTs ==================
// Enviamos `concepto` y campos comunes con valores por defecto.
// La UI puede seguir llamando postInscripcion(id) y postRecargo(id).

function buildCommonPayload(id_alumno, extra = {}) {
  const now = new Date();
  const meses = [
    'ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO',
    'JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'
  ];
  const periodo = extra.periodo || `${meses[now.getMonth()]}/${now.getFullYear()}`;

  // YYYY-MM-DD para Laravel
  const fechaISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  const importe = Number(extra.importe ?? 0);

  return {
    // IDs (duplicados por compatibilidad)
    alumno_id: id_alumno,
    id_alumno: id_alumno,

    // Campos requeridos por validación
    periodo,               // p.ej. "SEPTIEMBRE/2025"
    importe,               // si el backend lo usa
    monto: importe,        // alias común en backend
    fecha_pago: extra.fecha_pago || fechaISO,
    fecha: extra.fecha || fechaISO, // por si valida con 'fecha'

    // Opcionales
    id_programa: extra.id_programa ?? null,

    // Permite sobreescritura si envías manualmente algún campo
    ...extra,
  };
}

export function postInscripcion(id_alumno, extra = {}) {
  const payload = {
    ...buildCommonPayload(id_alumno, extra),
    concepto: extra.concepto || 'INSCRIPCION',
    tipo: 'inscripcion',
  };
  return getJSON('/pagos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function postRecargo(id_alumno, extra = {}) {
  const payload = {
    ...buildCommonPayload(id_alumno, extra),
    concepto: extra.concepto || 'RECARGO',
    tipo: 'recargo',
  };
  return getJSON('/pagos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function postMensualidad(id_alumno, extra = {}) {
  const payload = {
    ...buildCommonPayload(id_alumno, extra),
    concepto: extra.concepto || 'MENSUALIDAD',
    tipo: 'mensualidad',
  };
  return getJSON('/pagos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
