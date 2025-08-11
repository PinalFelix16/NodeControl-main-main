const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Expediente del alumno
export async function fetchExpedienteAlumno(id_alumno) {
  const res = await fetch(`${BASE}/api/alumnos/${id_alumno}/expediente`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Error expediente: ${res.status}`);
  return res.json();
}

// Programas/clases (filtramos en front por alumno_id)
export async function fetchProgramasAlumno(id_alumno) {
  const res = await fetch(`${BASE}/api/clases`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Error clases: ${res.status}`);
  const all = await res.json();
  return Array.isArray(all) ? all.filter(c => String(c.alumno_id) === String(id_alumno)) : [];
}
