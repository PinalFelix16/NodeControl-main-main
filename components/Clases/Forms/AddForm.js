// components/Clases/Forms/AddForm.js
"use client";
import React, { useEffect, useMemo, useState } from "react";
//import { createProgramaWithClases } from "services/api/programas";
import { fetchMaestros } from "services/api/maestros";
import { createProgramaWithClases } from "services/api/programas";

const NIVELES = [
  "INFANTIL",
  "ADULTOS",
  "MULTINIVEL",
  "PRINCIPIANTE",
  "INTERMEDIO",
  "INTERMEDIO/AVANZADO",
  "AVANZADO",
];

export default function AddForm({ setView }) {
  const [prog, setProg] = useState({
    nombre: "",
    mensualidad: "600.00",
    nivel: NIVELES[0],
    complex: 0,
  });

  const [clases, setClases] = useState([
    { nombre: "", id_maestro: "", informacion: "", porcentaje: "0", personal: "0" },
  ]);

  const [maestros, setMaestros] = useState([]);
  const maestroOptions = useMemo(
    () =>
      Array.isArray(maestros)
        ? maestros.map((m) => ({
            id: m.id_maestro ?? m.id ?? m.idMaestro,
            nombre: m.nombre_maestro ?? m.nombre,
          }))
        : [],
    [maestros]
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const m = await fetchMaestros();
        setMaestros(Array.isArray(m) ? m : []);
      } catch {
        setMaestros([]);
      }
    })();
  }, []);

  // Handlers
  const onProgChange = (e) => {
    const { id, value } = e.target;
    setProg((s) => ({ ...s, [id]: value }));
  };
  const onProgSelect = (id, value) => setProg((s) => ({ ...s, [id]: value }));

  const onClaseChange = (i, e) => {
    const { id, value } = e.target;
    setClases((arr) => {
      const copy = [...arr];
      copy[i] = { ...copy[i], [id]: value };
      return copy;
    });
  };

  const addRow = () =>
    setClases((arr) => [
      ...arr,
      { nombre: "", id_maestro: "", informacion: "", porcentaje: "0", personal: "0" },
    ]);

  const removeRow = (i) =>
    setClases((arr) => (arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr));

  // Submit
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!prog.nombre.trim()) return alert("El nombre del programa es obligatorio");

    for (let i = 0; i < clases.length; i++) {
      const c = clases[i];
      if (!c.nombre.trim()) return alert(`La clase #${i + 1} necesita un nombre`);
      if (!c.id_maestro) return alert(`Selecciona maestro en la clase #${i + 1}`);
    }

    const payload = {
      programa: {
        nombre: prog.nombre.trim(),
        mensualidad: prog.mensualidad ? Number(prog.mensualidad) : 0,
        nivel: prog.nivel || null,
        complex: Number(prog.complex) === 1 ? 1 : 0,
      },
      clases: clases.map((c) => ({
        nombre: c.nombre.trim(),
        id_maestro: String(c.id_maestro),
        informacion: c.informacion?.trim() || "",
        porcentaje: c.porcentaje !== "" ? Number(c.porcentaje) : 0,
        personal: c.personal !== "" ? parseInt(c.personal, 10) : 0,
      })),
    };

    setSaving(true);
    try {
      await createProgramaWithClases(payload);
      alert(`Programa creado con ${clases.length} clase(s).`);
      setView?.("Table");
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo crear el programa.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6 space-y-6 mt-8 md:mt-10">
        {/* PROGRAMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium" htmlFor="nombre">
              Nombre del programa
            </label>
            <input
              id="nombre"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Ej. Natación Infantil"
              value={prog.nombre}
              onChange={onProgChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium" htmlFor="mensualidad">
              Mensualidad $
            </label>
            <input
              id="mensualidad"
              type="number"
              step="0.01"
              min="0"
              className="w-full border rounded-lg px-3 py-2"
              value={prog.mensualidad}
              onChange={onProgChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Nivel</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={prog.nivel}
              onChange={(e) => onProgSelect("nivel", e.target.value)}
            >
              {NIVELES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Complejo</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={prog.complex}
              onChange={(e) => onProgSelect("complex", e.target.value)}
            >
              <option value={0}>No</option>
              <option value={1}>Sí</option>
            </select>
          </div>
        </div>

        {/* CLASES */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Clases: {clases.length}</h3>

          {clases.map((c, idx) => (
            <div key={idx} className="border rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Nombre de la clase</label>
                  <input
                    id="nombre"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder={`Ej. Natación ${idx + 1}`}
                    value={c.nombre}
                    onChange={(e) => onClaseChange(idx, e)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Maestro</label>
                  <select
                    id="id_maestro"
                    className="w-full border rounded-lg px-3 py-2"
                    value={c.id_maestro}
                    onChange={(e) => onClaseChange(idx, e)}
                  >
                    <option value="">-- Selecciona maestro --</option>
                    {maestroOptions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">% Avance</label>
                  <input
                    id="porcentaje"
                    type="number"
                    min="0"
                    max="100"
                    className="w-full border rounded-lg px-3 py-2"
                    value={c.porcentaje}
                    onChange={(e) => onClaseChange(idx, e)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Personal</label>
                  <input
                    id="personal"
                    type="number"
                    min="0"
                    className="w-full border rounded-lg px-3 py-2"
                    value={c.personal}
                    onChange={(e) => onClaseChange(idx, e)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block mb-1 text-sm font-medium">Información</label>
                <input
                  id="informacion"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Notas u observaciones"
                  value={c.informacion}
                  onChange={(e) => onClaseChange(idx, e)}
                />
              </div>

              {clases.length > 1 && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="text-sm px-3 py-2 rounded-lg shadow !bg-red-600 hover:!bg-red-700 !text-white"
                  >
                    Quitar esta clase
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Botón Agregar clase — ABAJO DERECHA */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={addRow}
              className="px-5 py-2 rounded-lg text-white shadow !bg-blue-600 hover:!bg-blue-700"
              style={{ backgroundColor: "#2563eb", color: "#fff" }}
            >
              + Agregar clase
            </button>
          </div>
        </div>

        {/* Submit centrado */}
        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-lg text-white shadow !bg-blue-600 hover:!bg-blue-700 disabled:opacity-60"
            style={{ backgroundColor: "#2563eb", color: "#fff" }}
          >
            {saving ? "Guardando..." : "Crear programa y clases"}
          </button>
        </div>
      </div>
    </form>
  );
}
