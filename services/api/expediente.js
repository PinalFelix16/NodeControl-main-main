// services/api/expediente.js
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ✅ EXPEDIENTE (antes adeudos)
export async function fetchAlumnosStatus(id_alumno) {
  const res = await fetch(`${BASE}/api/alumnos/${id_alumno}/expediente`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    let msg = `Error fetching expediente: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message || body?.error) msg += ` - ${body.message || body.error}`;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// ✅ Historial de pagos por alumno (ruta nueva del backend)
export async function fetchHistorialAlumno(id_alumno) {
  const res = await fetch(`${BASE}/api/alumnos/${id_alumno}/pagos`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    let msg = `Error fetching historial: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message || body?.error) msg += ` - ${body.message || body.error}`;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchInformacionAlumno(id_alumno) {
  const res = await fetch(`${BASE}/api/alumnos/${id_alumno}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    let msg = `Error fetching información: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message || body?.error) msg += ` - ${body.message || body.error}`;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// ✅ Programas/clases del alumno (filtrando en front)
export async function fetchProgramasAlumno(id_alumno) {
  const res = await fetch(`${BASE}/api/clases`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    let msg = `Error fetching clases: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message || body?.error) msg += ` - ${body.message || body.error}`;
    } catch {}
    throw new Error(msg);
  }
  const all = await res.json();
  // Ajusta la clave según tu API: c.alumno_id vs c.id_alumno
  return Array.isArray(all) ? all.filter(c => String(c.alumno_id) === String(id_alumno)) : [];
}

// POSTs
export async function postInscripcion(id_alumno) {
  const res = await fetch(`${BASE}/api/inscripcion/${id_alumno}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    let msg = `Error creando inscripción: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message || body?.error) msg += ` - ${body.message || body.error}`;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function postRecargo(id_alumno) {
  const res = await fetch(`${BASE}/api/registrar-recargo/${id_alumno}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    let msg = `Error registrando recargo: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message || body?.error) msg += ` - ${body.message || body.error}`;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
