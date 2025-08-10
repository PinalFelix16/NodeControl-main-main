export default class NominasService {
  constructor() {
    const base = process.env.NEXT_PUBLIC_API || "http://localhost:8000/api";
    this.url = base.endsWith("/") ? base : base + "/";
    this.prefix = "nominas/";
  }

  // --- util interno para fetch seguro ---
  async http(input, init = {}) {
    const res = await fetch(input, {
      // credentials: "include", // ← descomenta si usas cookies/sanctum
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });
    // Evita crashear si el backend regresa HTML de error
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = { message: text }; }

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return data;
  }

  // --- CRUD / listas ---
  async getAll() {
    return this.http(this.url + this.prefix);
  }

  async create(data) {
    return this.http(this.url + this.prefix, { method: "POST", body: JSON.stringify(data) });
  }

  async edit(id, data) {
    return this.http(this.url + this.prefix + id, { method: "PUT", body: JSON.stringify(data) });
  }

  async delete(id) {
    await this.http(this.url + this.prefix + id, { method: "DELETE" });
    return true;
  }

  // --- filtros/utilidades ---
  async getYears() {
    const data = await this.http(this.url + this.prefix + "anios");
    return Array.isArray(data) ? data : [];
  }

  async getByYear(year) {
    return this.http(this.url + this.prefix + "mostrar/" + year);
  }

  async getUsers() {
    return this.http(this.url + "usuarios");
  }

  async getInforme(id) {
    return this.http(this.url + this.prefix + id + "/informe");
  }

  async generarNomina(id) {
    return this.http(this.url + this.prefix + "generar", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  }

  // --- helpers para botones ---
  informePrintUrl(id) { return this.url + this.prefix + id + "/informe/print"; }
  informePdfUrl(id)   { return this.url + this.prefix + id + "/informe/pdf"; }
}
