"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function toISODate(d) {
  // admite "30/07/2025" y lo pasa a "2025-07-30"
  if (!d) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }
  return d; // ya viene como yyyy-mm-dd
}

export default function AddForm({ setView }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    celular: "",
    telefono: "",
    telefono_2: "",
    tutor: "",
    tutor_2: "",
    fecha_nacimiento: "", // debe ser YYYY-MM-DD para el input date
    hist_medico: "",
    beca: "",
    status: 1,
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "fecha_nacimiento" ? toISODate(value) : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const res = await fetch(`${BASE}/alumnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, fecha_nacimiento: toISODate(form.fecha_nacimiento) }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data?.errors
          ? Object.entries(data.errors).map(([k, v]) => `• ${k}: ${Array.isArray(v) ? v[0] : v}`).join("\n")
          : (data?.message || "Error al guardar");
        throw new Error(msg);
      }

      await Swal.fire("Listo", "Alumno agregado correctamente", "success");
      setView?.("Table");
    } catch (err) {
      Swal.fire("Error", String(err.message || err), "error");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border p-2 rounded" name="nombre" placeholder="Nombre *" value={form.nombre} onChange={onChange} required />
        <input className="border p-2 rounded" name="apellido" placeholder="Apellido" value={form.apellido} onChange={onChange} />
        <input type="email" className="border p-2 rounded" name="correo" placeholder="Correo" value={form.correo} onChange={onChange} />
        <input className="border p-2 rounded" name="celular" placeholder="Celular" value={form.celular} onChange={onChange} />
        <input className="border p-2 rounded" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={onChange} />
        <input className="border p-2 rounded" name="telefono_2" placeholder="Teléfono 2" value={form.telefono_2} onChange={onChange} />
        <input className="border p-2 rounded" name="tutor" placeholder="Tutor" value={form.tutor} onChange={onChange} />
        <input className="border p-2 rounded" name="tutor_2" placeholder="Tutor 2" value={form.tutor_2} onChange={onChange} />
        <input
          type="date"
          className="border p-2 rounded"
          name="fecha_nacimiento"
          value={form.fecha_nacimiento}
          onChange={onChange}
          placeholder="YYYY-MM-DD"
        />
        <input className="border p-2 rounded" name="beca" placeholder="Beca" value={form.beca} onChange={onChange} />
      </div>

      <textarea className="border p-2 rounded w-full mt-4" name="hist_medico" placeholder="Historial médico" value={form.hist_medico} onChange={onChange} />

      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm">Estatus:</label>
        <select className="border p-2 rounded" name="status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: Number(e.target.value) }))}>
          <option value={1}>Activo</option>
          <option value={0}>Inactivo</option>
        </select>
      </div>

      <div className="mt-6 flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>
          {saving ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" onClick={() => setView?.("Table")} className="px-4 py-2 border rounded">
          Cancelar
        </button>
      </div>
    </form>
  );
}