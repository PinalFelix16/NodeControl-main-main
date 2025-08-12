// services/api/maestros.js

// Normaliza BASE_URL para que SIEMPRE termine en /api
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"; // <-- PROTOCOLO ROJO: LÍNEA CORREGIDA
const BASE_URL = (() => {                                                    // <-- PROTOCOLO ROJO: LÍNEA AÑADIDA
  const trimmed = RAW_BASE.replace(/\/+$/, "");                              // <-- PROTOCOLO ROJO: LÍNEA AÑADIDA
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;              // <-- PROTOCOLO ROJO: LÍNEA AÑADIDA
})();                                                                        // <-- PROTOCOLO ROJO: LÍNEA AÑADIDA

/**
 * Lista maestros (opcional ?status=0|1)
 */
export async function fetchMaestros(status = "") {
  const url = `${BASE_URL}/maestros${status !== "" && status !== null ? `?status=${status}` : ""}`; // <-- PROTOCOLO ROJO: LÍNEA CORREGIDA
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Error fetching data (${res.status})`);
  return res.json();
}

/**
 * Obtiene un maestro por id
 */
export async function fetchMaestroAllData(id) {
  const res = await fetch(`${BASE_URL}/maestros/${id}`, { headers: { Accept: "application/json" } }); // <-- PROTOCOLO ROJO
  if (!res.ok) throw new Error(`Error fetching maestro (${res.status})`);
  return res.json();
}

/**
 * Crea maestro
 */
export async function storeMaestro(payload) {
  const res = await fetch(`${BASE_URL}/maestros`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { error: data?.message || "Error al crear maestro" };
  return data;
}

/**
 * Actualiza maestro
 */
export async function updateMaestro(payload, id) {
  const res = await fetch(`${BASE_URL}/maestros/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { error: data?.message || "Error al actualizar maestro" };
  return data;
}
