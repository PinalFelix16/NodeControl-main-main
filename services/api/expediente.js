// services/api/expediente.js
// -------------------------------------------------------------
// Mantiene tu UI intacta y agrega robustez a llamadas.
// -------------------------------------------------------------

// 1) Base correcta de API (sin /public y sin duplicar /api)
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api')
  .replace(/\/+$/, ''); // quita barras finales

// 2) Token opcional (Bearer)
const TOKEN_KEY = 'token';
const getToken = () =>
  (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null);
const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// 3) Helper fetch JSON con manejo de errores
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

// Utilidad para normalizar ID de programa (puede venir con distintas claves)
function _pid(x) {
  return String(
    x?.id_programa ?? x?.programa_id ?? x?.id ?? x?.programa ?? ''
  ).trim();
}

// ================== GETs ==================

// Pendientes / estado del alumno
export const fetchAlumnosStatus = (id_alumno) =>
  getJSON(`/alumnos/${id_alumno}/expediente`);

// INFORMACIÓN del alumno
export const fetchInformacionAlumno = (id_alumno) =>
  getJSON(`/alumnos/${id_alumno}`);

// HISTORIAL del alumno (única definición, con fallback y enriquecimiento de programa)
export async function fetchHistorialAlumno(alumnoId) {
  const headers = { ...authHeaders() };

  const normalizeList = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  };

  // 1) endpoint preferido, pidiendo TODO (sin paginar)
  let lista = [];
  try {
    const url = `${API_BASE}/alumnos/${alumnoId}/historial?all=1&nopage=1&per_page=1000`;
    const r = await fetch(url, { headers, cache: 'no-store' });
    if (r.ok) lista = normalizeList(await r.json());
  } catch {}

  // 2) fallback universal: /pagos?alumno_id=... (también sin paginar)
  if (lista.length === 0) {
    try {
      const url2 = `${API_BASE}/pagos?alumno_id=${alumnoId}&all=1&nopage=1&per_page=1000`;
      const r2 = await fetch(url2, { headers, cache: 'no-store' });
      if (r2.ok) lista = normalizeList(await r2.json());
    } catch {}
  }

  // 3) Traer programas y construir mapa id -> nombre
  let programas = [];
  try {
    const rp = await fetch(`${API_BASE}/programas`, { headers, cache: 'no-store' });
    if (rp.ok) {
      const jp = await rp.json();
      programas = Array.isArray(jp?.data) ? jp.data : (Array.isArray(jp) ? jp : []);
    }
  } catch {}

  const nameById = new Map();
  for (const p of programas) {
    const id = _pid(p);
    const nombre = p?.nombre || p?.nombre_programa || '';
    if (id && nombre) nameById.set(id, nombre);
  }

  // 4) Enriquecer cada pago con "programa" si falta
  const enriquecida = lista.map((p) => {
    const ya = p.programa ?? p.programa_nombre ?? p.nombre_programa ?? '';
    if (ya && String(ya).trim()) return p; // ya trae texto
    const id = _pid(p); // lee id_programa/programa_id/etc. del pago
    const nombre = nameById.get(id) || '';
    return nombre
      ? { ...p, programa: nombre, nombre_programa: nombre, programa_nombre: nombre }
      : p;
  });

  // Devolver en el formato que consume la UI (tu AlumnoTabs acepta .data o array)
  return { data: enriquecida };
}

// Programas y clases del alumno (solo programas con al menos una clase)
export async function fetchProgramasAlumno(id_alumno) {
  const [programasAll, clasesAll] = await Promise.all([
    getJSON('/programas'),
    getJSON('/clases'),
  ]);

  const toPid = (obj) =>
    String(
      obj?.id_programa ??
      obj?.programa_id ??
      obj?.id ??
      obj?.programa ?? ''
    ).trim();

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
    .filter((p) => Array.isArray(p.clases) && p.clases.length > 0)
    .sort((a, b) => Number(b.inscrito) - Number(a.inscrito));

  return list;
}

// ================== POSTs ==================

function buildCommonPayload(id_alumno, extra = {}) {
  const now = new Date();
  const meses = [
    'ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO',
    'JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'
  ];
  const periodo = extra.periodo || `${meses[now.getMonth()]}/${now.getFullYear()}`;

  const fechaISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  const importe = Number(extra.importe ?? 0);

  return {
    alumno_id: id_alumno,
    id_alumno: id_alumno,
    periodo,
    importe,
    monto: importe,
    fecha_pago: extra.fecha_pago || fechaISO,
    fecha: extra.fecha || fechaISO,
    id_programa: extra.id_programa ?? null,
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
