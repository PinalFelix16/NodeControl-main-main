// services/api/alumnos.js
const API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:8000/api";

async function http(path, options = {}) {
  const url = `${API}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });

  const text = await res.text();
  let data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ===== Alumnos =====
export function fetchAlumnos(q) {
  return http(`/alumnos${q ? `?${q}` : ""}`, { method: "GET" });
}
export function fetchAlumnoAllData(id) {
  if (id == null) throw new Error("id requerido");
  return http(`/alumnos/${id}`, { method: "GET" });
}

// 👉 Nombre que usa tu AddForm
export function storeAlumno(payload) {
  return http(`/alumnos`, { method: "POST", body: JSON.stringify(payload) });
}

// También dejamos update/delete por si los usas
export function updateAlumno(payload, id) {
  if (id == null) throw new Error("id requerido");
  return http(`/alumnos/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}
export function deleteAlumno(id) {
  if (id == null) throw new Error("id requerido");
  return http(`/alumnos/${id}`, { method: "DELETE" });
}

// (opcional) export default por comodidad
export default { fetchAlumnos, fetchAlumnoAllData, storeAlumno, updateAlumno, deleteAlumno };
