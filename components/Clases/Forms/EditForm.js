// components/Clases/Forms/EditForm.js
import React, { useEffect, useState, useMemo } from "react";
import { fetchMaestros } from "services/api/maestros";
import { fetchClaseById, updateClase } from "services/api/clases";
import { fetchProgramaById } from "services/api/programas";

const DIAS = [
  { key: "L", label: "Lunes" },
  { key: "M", label: "Martes" },
  { key: "X", label: "Miércoles" },
  { key: "J", label: "Jueves" },
  { key: "V", label: "Viernes" },
  { key: "S", label: "Sábado" },
  { key: "D", label: "Domingo" },
];

// ------- Helpers --------------------------------------------------
function pick(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
}
function toArrayDias(d) {
  if (!d) return [];
  if (Array.isArray(d)) return d;
  if (typeof d === "string") {
    return d.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}
const fmtTime = (t) => (t ? String(t).slice(0, 5) : "");
function normalizeMaestros(x) {
  if (Array.isArray(x)) return x;
  if (x && Array.isArray(x.data)) return x.data;
  if (x && Array.isArray(x.maestros)) return x.maestros;
  return [];
}

// ================================================================
export default function EditForm({ setView, selectedUser, onSaved }) {
  // Resuelve id desde prop o sessionStorage (por si cambiaste de vista/ruta)
  const editId = useMemo(() => {
    if (selectedUser != null) return Number(selectedUser);
    if (typeof window !== "undefined") {
      const v = Number(sessionStorage.getItem("editClaseId"));
      return Number.isNaN(v) || v === 0 ? null : v;
    }
    return null;
  }, [selectedUser]);

  const initial = {
    id_programa: "",
    alumno_id: 0,
    nombre: "",
    id_maestro: "",         // ¡guardamos como string para el <select>!
    informacion: "",
    lugar: "",
    hora_inicio: "",
    hora_fin: "",
    dias: [],
    mensualidad: "",
    complejo: 0,
    porcentaje: "",
  };

  const [formData, setFormData] = useState(initial);
  const [maestros, setMaestros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [raw, setRaw] = useState(null); // debug opcional

  // Cargar maestros (tolera distintos formatos y fallos → [])
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchMaestros(1); // intenta sólo activos
        if (alive) setMaestros(normalizeMaestros(data));
      } catch {
        if (alive) setMaestros([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Cargar clase (y completar con programa si falta info)
  useEffect(() => {
    if (!editId) return;

    let cancel = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const c = await fetchClaseById(editId);
        if (cancel) return;
        setRaw(c);

        const id_programa = pick(c?.id_programa, c?.programa_id);
        let nombre = pick(c?.nombre, c?.nombre_clase, c?.nombre_programa);
        let mensualidad = pick(c?.programa_mensualidad, c?.mensualidad, c?.mensualidad_anulacion);

        // Completar con programa si faltan campos
        if ((nombre === "" || mensualidad === "") && id_programa) {
          try {
            const p = await fetchProgramaById(id_programa);
            nombre = pick(nombre, p?.nombre, p?.nombre_programa);
            mensualidad = pick(mensualidad, p?.mensualidad, p?.monto, p?.precio);
          } catch { /* no bloquear edición si falla */ }
        }

        const next = {
          ...initial,
          id_programa: id_programa ?? "",
          alumno_id: pick(c?.alumno_id, c?.id_alumno, 0),
          nombre,
          id_maestro: String(pick(c?.id_maestro, c?.maestro_id, "")), // ← como string
          informacion: pick(c?.informacion, c?.notas, ""),
          lugar: pick(c?.lugar, ""),
          hora_inicio: fmtTime(pick(c?.hora_inicio, c?.hora_entrada, "")),
          hora_fin: fmtTime(pick(c?.hora_fin, c?.hora_salida, "")),
          dias: toArrayDias(pick(c?.dias, c?.dias_semana)),
          mensualidad,
          complejo: Number(pick(c?.complejo, 0)),
          porcentaje: pick(c?.porcentaje, c?.avance, ""),
        };

        if (!cancel) setFormData(next);
      } catch (e) {
        console.error("[EditForm] load error:", e);
        if (!cancel) setError(e.message || "No se pudo cargar la clase");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => { cancel = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  // Opciones normalizadas para el select
  const maestroOptions = useMemo(() => {
    return (maestros || []).map((m) => ({
      id: String(m.id_maestro ?? m.id ?? ""),
      nombre: m.nombre ?? m.nombre_maestro ?? m.nombre_completo ?? "Sin nombre",
    }));
  }, [maestros]);

  // Handlers
  const onChange = (e) => {
    const { id, value } = e.target;
    setFormData((s) => ({ ...s, [id]: id === "id_maestro" ? String(value) : value }));
  };

  const toggleDia = (key) => {
    setFormData((s) => {
      const has = s.dias.includes(key);
      return { ...s, dias: has ? s.dias.filter((d) => d !== key) : [...s.dias, key] };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editId) return alert("ID de clase no definido.");

    const payload = {
      alumno_id: parseInt(formData.alumno_id || 0, 10),
      nombre: formData.nombre,
      id_maestro: formData.id_maestro || null, // ← string o null
      informacion: formData.informacion || "",
      lugar: formData.lugar || null,
      hora_inicio: formData.hora_inicio || null,
      hora_fin: formData.hora_fin || null,
      dias: formData.dias, // array → backend lo castea a CSV
      mensualidad: formData.mensualidad !== "" ? Number(formData.mensualidad) : null,
      complejo: Number(formData.complejo || 0),
      porcentaje: formData.porcentaje !== "" ? Number(formData.porcentaje) : null,
    };

    try {
      setSaving(true);
      await updateClase(editId, payload); // usa token del localStorage si aplica
      alert("Clase actualizada.");

      if (typeof onSaved === "function") {
        onSaved();            // ← vuelve y refresca grilla (Programas2)
      } else {
        setView?.("All");     // ← respaldo si no pasaron onSaved
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  // Sin id en prop ni en sessionStorage
  if (!editId) {
    return (
      <div className="p-4 text-sm text-amber-700 bg-amber-50 rounded">
        Selecciona una clase para editar.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="container mx-auto px-4">
        <div className="w-full lg:w-9/12 mx-auto">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t px-6 py-6">
              <h6 className="text-blueGray-500 text-sm font-bold">Editar clase</h6>
              {loading && <div className="p-3 text-sm">Cargando datos…</div>}
              {!!error && <div className="p-3 text-sm text-red-600">{error}</div>}
              {/* <pre className="text-xs mt-2 bg-white rounded p-2 overflow-auto">{JSON.stringify(raw, null, 2)}</pre> */}
            </div>

            <fieldset disabled={loading || saving}>
              <div className="px-8 pt-6 pb-10 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                {/* Nombre */}
                <div>
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="nombre">
                    Nombre de la clase
                  </label>
                  <input
                    id="nombre"
                    value={formData.nombre}
                    onChange={onChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow w-full"
                    placeholder="Nombre de la clase"
                  />
                </div>

                {/* Maestro */}
                <div>
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="id_maestro">
                    Maestro
                  </label>
                  <select
                    id="id_maestro"
                    value={String(formData.id_maestro ?? "")}
                    onChange={onChange}
                    className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                  >
                    <option value="">-- Selecciona maestro --</option>
                    {maestroOptions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                    {maestroOptions.length === 0 && (
                      <option disabled value="">
                        (No hay maestros)
                      </option>
                    )}
                  </select>
                </div>

                {/* Lugar */}
                <div>
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="lugar">
                    Lugar
                  </label>
                  <input
                    id="lugar"
                    value={formData.lugar}
                    onChange={onChange}
                    className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                    placeholder="Salón / Alberca / Aula"
                  />
                </div>

                {/* Mensualidad */}
                <div>
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="mensualidad">
                    Mensualidad (anulación)
                  </label>
                  <input
                    id="mensualidad"
                    type="number"
                    step="0.01"
                    value={formData.mensualidad}
                    onChange={onChange}
                    className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                    placeholder="Ej. 600.00"
                  />
                </div>

                {/* Complejo */}
                <div>
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="complejo">
                    Complejo
                  </label>
                  <select
                    id="complejo"
                    value={formData.complejo}
                    onChange={onChange}
                    className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                  >
                    <option value={0}>NO</option>
                    <option value={1}>SÍ</option>
                  </select>
                </div>

                {/* Días */}
                <div>
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Días</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-3">
                    {DIAS.map((d) => (
                      <label key={d.key} className="inline-flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.dias.includes(d.key)}
                          onChange={() => toggleDia(d.key)}
                        />
                        <span>{d.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Horas */}
                <div>
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="hora_inicio">
                    Hora de entrada
                  </label>
                  <input
                    id="hora_inicio"
                    type="time"
                    value={formData.hora_inicio}
                    onChange={onChange}
                    className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                  />
                </div>

                <div>
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="hora_fin">
                    Hora de salida
                  </label>
                  <input
                    id="hora_fin"
                    type="time"
                    value={formData.hora_fin}
                    onChange={onChange}
                    className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                  />
                </div>

                {/* Información */}
                <div>
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="informacion">
                    Información
                  </label>
                  <input
                    id="informacion"
                    value={formData.informacion}
                    onChange={onChange}
                    className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                    placeholder="Notas u observaciones"
                  />
                </div>

                {/* % Avance */}
                <div>
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="porcentaje">
                    % Avance
                  </label>
                  <input
                    id="porcentaje"
                    type="number"
                    step="0.1"
                    value={formData.porcentaje}
                    onChange={onChange}
                    className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                    placeholder="0"
                  />
                </div>

                {/* Botones */}
                <div className="md:col-span-2 flex items-center justify-center gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setView?.("All")}
                    className="bg-white text-blueGray-800 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg border"
                    disabled={loading || saving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg disabled:opacity-60"
                    disabled={loading || saving}
                  >
                    {saving ? "Guardando…" : "Guardar cambios"}
                  </button>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </form>
  );
}
