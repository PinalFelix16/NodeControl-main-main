// services/api/clases.js
export async function fetchClases(params = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const qs = new URLSearchParams(params).toString();
  const url = `${base}/api/clases${qs ? `?${qs}` : ''}`;

  const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
  if (!res.ok) {
    // Muestra el mensaje del backend si vino en JSON (útil para depurar 500)
    let msg = `Error fetching clases: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message || body?.error) msg += ` - ${body.message || body.error}`;
    } catch (e) {}
    throw new Error(msg);
  }
  return res.json();
}
