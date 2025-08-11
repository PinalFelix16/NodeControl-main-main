// services/api/cortes.js

// 1) Base URL del backend
const API_BASE =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_API_BASE_URL &&
    process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")) ||
  "http://localhost:8000/api";

// 2) Headers con token si existe
function authHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 3) Helper fetch con manejo de JSON/errores
async function http(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(opts.headers || {}),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* puede no venir JSON (204, etc.) */
  }

  if (!res.ok) {
    const msg = data?.message || res.statusText || "Error de red";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// === Endpoints ===

// Crear movimiento de miscelánea (egreso simple)
export async function miscelanea({ descripcion, nombre, monto, corte = 0 }) {
  // el backend acepta (en tu versión) nombre + monto
  return http(`${API_BASE}/miscelanea`, {
    method: "POST",
    body: JSON.stringify({
      nombre: nombre ?? descripcion ?? "MISCELANEA",
      monto: Number(monto) || 0,
      corte, // 0 por defecto
    }),
  });
}

// Realizar el corte (mueve pendientes al corte y crea registro en 'cortes')
export async function realizarCorte({ total, id_autor }) {
  return http(`${API_BASE}/realizar-corte`, {
    method: "POST",
    body: JSON.stringify({
      total: Number(total) || 0,     // el controlador valida numérico
      id_autor: String(id_autor || "1").slice(0, 6), // máx 6 chars
    }),
  });
}

// (Opcional) traer la caja actual
export async function getCorteCaja() {
  return http(`${API_BASE}/corte-caja`);
}
