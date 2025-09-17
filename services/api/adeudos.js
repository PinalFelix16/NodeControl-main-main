import { API_BASE } from "./clases";

export async function upsertAdeudoPrograma({ alumno_id, id_programa, periodo, concepto, importe }) {
  const res = await fetch(`${API_BASE}/adeudos-programas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ alumno_id, id_programa, periodo, concepto, importe }),
  });
  if (!res.ok && res.status !== 409) {
    let msg = `Error adeudo: ${res.status}`;
    try { const b = await res.json(); msg = b?.message || b?.error || msg; } catch {}
    throw new Error(msg);
  }
  try { return await res.json(); } catch { return null; }
}
