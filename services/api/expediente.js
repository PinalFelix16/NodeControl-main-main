// services/api/expediente.js (o donde lo tengas)
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

// ⚠️ Estos dependen de que existan esas rutas en tu backend.
// Si aún no existen, te puedo pasar los controllers en Laravel para pagos e información.
export async function fetchHistorialAlumno(id_alumno) {
  const res = await fetch(`${BASE}/api/pagos/${id_alumno}`, {
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
  const res = await fetch(`${BASE}/api/informacion/${id_alumno}`, {
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

// ✅ Programas/clases del alumno SIN tocar backend: traemos todas y filtramos en front
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
  // Ajusta el nombre de la clave si en tu JSON es otro (p. ej. alumnoId, id_alumno, etc.)
  return Array.isArray(all) ? all.filter(c => String(c.alumno_id) === String(id_alumno)) : [];
}

// POSTs
export async function postInscripcion(id_alumno) {
  const res = await fetch(`${BASE}/api/inscripcion/${id_alumno}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({}), // agrega payload si lo necesitas
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
    body: JSON.stringify({}), // agrega payload si lo necesitas
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
