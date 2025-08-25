// components/Programas/NuevoProgramaForm.jsx
import React, { useEffect, useState } from "react";
import { createProgramaConClases } from "services/api/programas";
import { fetchMaestros } from "services/api/maestros";

export default function NuevoProgramaForm({ onCreated }) {
  // ----- estado del programa (parte superior) -----
  const [form, setForm] = useState({
    nombrePrograma: "",
    mensualidad: "",
    nivel: "",
    complejo: false,
  });

  // ----- filas de clases -----
  const emptyRow = { nombre: "", id_maestro: "", informacion: "", porcentaje: "", personal: "" };
  const [filas, setFilas] = useState([ { ...emptyRow } ]);

  // ----- maestros para el select -----
  const [maestros, setMaestros] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchMaestros();
        setMaestros(Array.isArray(list) ? list : []);
      } catch {
        setMaestros([]);
      }
    })();
  }, []);

  // cambios en cabecera del programa
  const onChangePrograma = (e) => {
    const { id, type, checked, value } = e.target;
    setForm((s) => ({ ...s, [id]: type === "checkbox" ? checked : value }));
  };

  // cambios en una fila de clase
  const onChangeFila = (i, key, value) => {
    setFilas((rows) => {
      const copy = [...rows];
      copy[i] = { ...copy[i], [key]: value };
      return copy;
    });
  };

  const addFila = () => setFilas((r) => [...r, { ...emptyRow }]);
  const removeFila = (i) => setFilas((r) => r.filter((_, idx) => idx !== i));

  // ======= AQUÍ VA TU HANDLER =======
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const programa = {
      nombre: form.nombrePrograma,
      mensualidad: Number(form.mensualidad || 0),
      nivel: form.nivel || null,
      complex: form.complejo ? 1 : 0,
    };

    const clases = filas.map((row) => ({
      nombre: row.nombre,
      id_maestro: row.id_maestro,
      informacion: row.informacion || null,
      porcentaje: row.porcentaje ? Number(row.porcentaje) : null,
      personal: row.personal ? Number(row.personal) : 0,
      // si luego agregas más campos, mapea aquí (lugar, hora_inicio, hora_fin, dias, etc.)
    }));

    try {
      const res = await createProgramaConClases({ programa, clases });
      alert(`Programa creado con ${Array.isArray(res?.clases) ? res.clases.length : clases.length} clase(s).`);
      // limpiar o notificar al padre
      setForm({ nombrePrograma: "", mensualidad: "", nivel: "", complejo: false });
      setFilas([ { ...emptyRow } ]);
      onCreated?.(res);
    } catch (err) {
      setError(err.message || "No se pudo crear el programa");
      alert(err.message || "No se pudo crear el programa");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Cabecera del programa */}
      <input
        id="nombrePrograma"
        value={form.nombrePrograma}
        onChange={onChangePrograma}
        className="w-full border rounded px-3 py-2"
        placeholder="Nombre del programa"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          id="mensualidad"
          type="number"
          step="0.01"
          value={form.mensualidad}
          onChange={onChangePrograma}
          className="border rounded px-3 py-2"
          placeholder="Mensualidad $"
        />
        <select
          id="nivel"
          value={form.nivel}
          onChange={onChangePrograma}
          className="border rounded px-3 py-2"
        >
          <option value="">-- Nivel --</option>
          <option value="INFANTIL">INFANTIL</option>
          <option value="ADULTOS">ADULTOS</option>
          <option value="MULTINIVEL">MULTINIVEL</option>
          <option value="PRINCIPIANTE">PRINCIPIANTE</option>
          <option value="INTERMEDIO">INTERMEDIO</option>
          <option value="INTERMEDIO/AVANZADO">INTERMEDIO/AVANZADO</option>
          <option value="AVANZADO">AVANZADO</option>
        </select>
        <label className="inline-flex items-center gap-2">
          <input
            id="complejo"
            type="checkbox"
            checked={form.complejo}
            onChange={onChangePrograma}
          />
          Complejo
        </label>
      </div>

      {/* Filas de clases */}
      <div className="space-y-3">
        {filas.map((row, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-6 gap-3 items-end">
            <input
              value={row.nombre}
              onChange={(e) => onChangeFila(i, "nombre", e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="Clase (ej. Natación 1)"
            />
            <select
              value={row.id_maestro}
              onChange={(e) => onChangeFila(i, "id_maestro", e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">-- Entrenador --</option>
              {maestros.map((m) => (
                <option key={m.id_maestro} value={m.id_maestro}>
                  {m.nombre_maestro}
                </option>
              ))}
            </select>
            <input
              value={row.informacion}
              onChange={(e) => onChangeFila(i, "informacion", e.target.value)}
              className="border rounded px-3 py-2 lg:col-span-2"
              placeholder="Información"
            />
            <input
              type="number"
              step="0.1"
              value={row.porcentaje}
              onChange={(e) => onChangeFila(i, "porcentaje", e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="%"
            />
            <input
              type="number"
              value={row.personal}
              onChange={(e) => onChangeFila(i, "personal", e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="Personal"
            />
            <button type="button" className="text-red-600 text-sm"
              onClick={() => removeFila(i)}>
              Eliminar
            </button>
          </div>
        ))}

        <button type="button" onClick={addFila} className="text-sm text-blue-600">
          + Agregar clase
        </button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 rounded bg-blueGray-800 text-white disabled:opacity-60"
      >
        {saving ? "Guardando…" : "Guardar programa y clases"}
      </button>
    </form>
  );
}
