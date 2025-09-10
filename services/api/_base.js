// ---------------------------------------------------------
// Cliente central: todas las peticiones pasan por aquí.
// Evita que alguien ponga 'http://localhost/.../public/api' por su cuenta.
// ---------------------------------------------------------
const API = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api')
  .replace(/\/+$/, '');

export async function http(path, opts = {}) {
  const url = `${API}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = {
    Accept: 'application/json',
    ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    ...(opts.headers || {}),
  };
  const res = await fetch(url, { ...opts, headers });

  // Si el backend responde con error HTTP, lo hacemos visible.
  if (!res.ok) {
    const txt = await res.text().catch(()=>'');
    throw new Error(`HTTP ${res.status} ${res.statusText} → ${txt.slice(0,200)}`);
  }
  return res.json();
}
