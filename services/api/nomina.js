export default class NominasService {
  constructor() {
    this.url = "http://localhost:8000/api/";
    this.prefix = "nominas/";
  }

  async getAll() {
    const response = await fetch(this.url + this.prefix);
    const data = await response.json();
    return data;
  }

  async create(data) {
    const response = await fetch(this.url + this.prefix, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res;
  }

  async edit(id, data) {
    const response = await fetch(this.url + this.prefix + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res;
  }

  async delete(id) {
    await fetch(this.url + this.prefix + id, {
      method: "DELETE",
    });
  }

  async getYears() {
    const response = await fetch(this.url + "anios/");
    const data = await response.json();
    return data;
  }

  async getByYear(year) {
    const response = await fetch(this.url + this.prefix + "anios/" + year);
    const data = await response.json();
    return data;
  }

  async getUsers() {
    const response = await fetch(this.url + "lista-usuarios/");
    const data = await response.json();
    return data;
  }

  async getInforme(id) {
    const response = await fetch(this.url + "informe-nomina/" + id);
    const data = await response.json();
    return data;
  }

  async generarNomina(id) {
    const response = await fetch(this.url + "generar-nomina/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    return data;
  }
}
