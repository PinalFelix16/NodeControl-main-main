// services/api/expediente.js
// -------------------------------------------------------------
// Mantiene tu UI intacta y agrega robustez a llamadas.
// -------------------------------------------------------------

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api')
  .replace(/\/+$/, '');

const TOKEN_KEY = 'token';
const getToken = () =>
  (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null);
const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

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

// ---------- Helpers ----------
function _pid(x) { // ID de programa en catálogo
  return String(
    x?.id_programa ?? x?.programa_id ?? x?.id ?? x?.programa ?? ''
  ).trim();
}

// ID de PROGRAMA cuando el objeto es un PAGO (¡no usar .id/.folio!)
function _pidPago(x) {
  return String(x?.programa_id ?? x?.id_programa ?? '').trim();
}

// Palabras que NO son nombre de programa
const BAD_LABEL = /^(INSCRIPCION|INSCRIPCIÓN|RECARGO|MENSUALIDAD)$/i;

// ================== GETs ==================
export const fetchAlumnosStatus = (id_alumno) =>
  getJSON(`/alumnos/${id_alumno}/expediente`);

export const fetchInformacionAlumno = (id_alumno) =>
  getJSON(`/alumnos/${id_alumno}`);

// HISTORIAL del alumno
export async function fetchHistorialAlumno(alumnoId) {
  const headers = { ...authHeaders() };

  const normalizeList = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  };

  // 1) endpoint preferido
  let lista = [];
  try {
    const url = `${API_BASE}/alumnos/${alumnoId}/historial?all=1&nopage=1&per_page=1000`;
    const r = await fetch(url, { headers, cache: 'no-store' });
    if (r.ok) lista = normalizeList(await r.json());
  } catch {}

  // 2) fallback
  if (lista.length === 0) {
    try {
      const url2 = `${API_BASE}/pagos?alumno_id=${alumnoId}&all=1&nopage=1&per_page=1000`;
      const r2 = await fetch(url2, { headers, cache: 'no-store' });
      if (r2.ok) lista = normalizeList(await r2.json());
    } catch {}
  }

  // 3) programas para enriquecer
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

  // 4) enriquecer
  const enriquecida = lista.map((p) => {
    const ya = (p.programa ?? p.programa_nombre ?? p.nombre_programa ?? '').trim();
    if (ya && !BAD_LABEL.test(ya)) return p;

    const id = _pidPago(p);
    let nombre = (id ? nameById.get(id) : '') || '';

    if (!nombre) {
      const campo = (p.periodo ?? p.referencia ?? '').toString();
      const partes = campo.split(/[\|\uFF5C]/); // '|' ASCII o '｜' full-width
      if (partes.length > 1) {
        const posible = (partes[partes.length - 1] || '').trim();
        if (posible && !BAD_LABEL.test(posible)) nombre = posible;
      }
    }

    return nombre
      ? { ...p, programa: nombre, nombre_programa: nombre, programa_nombre: nombre }
      : p;
  });

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

/**
 * Da de baja al alumno de un PROGRAMA.
 * Ruta oficial: POST /alumnos/{alumno}/baja-programa (InscripcionesController@bajaPrograma).
 * Fallback opcional: si falla y mandas opts.claseIds, intenta POST /clases/{id}/quitar-alumno.
 */
export async function bajaProgramaAlumno(id_alumno, id_programa, opts = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...authHeaders(),
  };

  // 1) Ruta oficial (la única que intentamos por programa)
  const url1 = `${API_BASE}/alumnos/${id_alumno}/baja-programa`;
  try {
    const res = await fetch(url1, {
      method: 'POST',
      headers,
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({
        programa_id: Number(id_programa),
        remove_deuda_actual: Boolean(opts.remove_deuda_actual),
      }),
    });

    let data = null;
    try { data = await res.json(); } catch {}

    if (res.ok) return data ?? { ok: true };

    // Si no ok, y NO tenemos fallback, lanzamos error directo
    if (!Array.isArray(opts.claseIds) || opts.claseIds.length === 0) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }
  } catch (e) {
    // seguimos al fallback si hay claseIds; si no, re-lanzamos
    if (!Array.isArray(opts.claseIds) || opts.claseIds.length === 0) {
      clearTimeout(timeout);
      throw e;
    }
  }

  // 2) Fallback por CLASE: quitar alumno de cada clase del programa
  try {
    await Promise.all(
      (opts.claseIds || []).map((cid) =>
        fetch(`${API_BASE}/clases/${cid}/quitar-alumno`, {
          method: 'POST',
          headers,
          cache: 'no-store',
          body: JSON.stringify({ alumno_id: id_alumno }),
        }).then(async (r) => {
          // no necesitamos respuesta estricta; si falla alguna, que lance para cortar
          if (!r.ok) {
            let d = null; try { d = await r.json(); } catch {}
            const msg = (d && (d.message || d.error)) || `HTTP ${r.status}`;
            throw new Error(msg);
          }
        })
      )
    );
    return { ok: true, fallback: 'clases' };
  } finally {
    clearTimeout(timeout);
  }
}
