// components/Alumnos/Forms/EditForm.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAlumnoAllData, updateAlumno } from "services/api/alumnos";
import Swal from "sweetalert2";

function getAlumnoId(input) {
  if (input == null) return null;
  if (typeof input === "number" || typeof input === "string") return input;
  return input.id_alumno ?? input.id ?? null;
}

function normalizeFecha(fecha) {
  if (!fecha) return null;
  if (typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function EditForm({ selectedUser, onSaved, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    celular: "",
    telefono: "",
    tutor: "",
    tutor_2: "",
    telefono_2: "",
    correo: "",
    fecha_nac: "",        // en el form usamos fecha_nac; el backend la mapea a fecha_nacimiento
    status: 1,
    beca: "",
    hist_medico: "",
    observaciones: "",
  });

  const alumnoId = useMemo(() => getAlumnoId(selectedUser), [selectedUser]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!alumnoId) {
        setCargando(false);
        return;
      }
      try {
        setCargando(true);
        const data = await fetchAlumnoAllData(alumnoId);
        const a = data?.alumno ?? data ?? {};

        if (!active) return;
        setFormData((prev) => ({
          ...prev,
          nombre: a.nombre ?? "",
          apellido: a.apellido ?? "",
          celular: a.celular ?? "",
          telefono: a.telefono ?? "",
          tutor: a.tutor ?? "",
          tutor_2: a.tutor_2 ?? "",
          telefono_2: a.telefono_2 ?? "",
          correo: a.correo ?? "",
          // La BD tiene "fecha_nacimiento". Si viene, la mostramos como fecha_nac en el form:
          fecha_nac: normalizeFecha(a.fecha_nacimiento ?? a.fecha_nac) || "",
          status: typeof a.status === "number" ? a.status : Number(a.status ?? 1),
          beca: a.beca ?? "", // dejamos string para que el input numérico lo muestre tal cual
          hist_medico: a.hist_medico ?? "",
          observaciones: a.observaciones ?? "",
        }));
      } catch (e) {
        console.error(e);
        Swal.fire("Error", "No se pudo cargar el alumno", "error");
      } finally {
        if (active) setCargando(false);
      }
    })();
    return () => { active = false; };
  }, [alumnoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convertimos status inmediatamente a número para no mandar "1"/"0" como string
    if (name === "status") {
      setFormData((s) => ({ ...s, status: Number(value) }));
    } else if (name === "beca") {
      // permitimos vacío; si no está vacío, guardamos el string y lo convertimos en submit
      setFormData((s) => ({ ...s, beca: value }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alumnoId) {
      Swal.fire("Error", "ID de alumno inválido", "error");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        fecha_nac: normalizeFecha(formData.fecha_nac),           // el backend la mapea a fecha_nacimiento
        status: Number(formData.status),                         // 0/1
        beca:
          formData.beca === "" || formData.beca === null
            ? null
            : Number(formData.beca),                             // numeric o null
      };

      // Si tu BD NO tiene 'apellido', descomenta:
      // delete payload.apellido;

      await updateAlumno(payload, alumnoId);

      Swal.fire("¡Éxito!", "Alumno actualizado correctamente", "success");
      onSaved?.();
    } catch (e) {
      console.error(e);
      // intenta mostrar el primer mensaje de validación si viene del backend
      const first =
        e?.data?.errors && Object.values(e.data.errors)[0]?.[0];
      const msg = first || e?.data?.message || e?.message || "No se pudo actualizar el alumno";
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (cargando) {
    return <div className="p-4 text-gray-500">Cargando alumno…</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Nombre</label>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Apellido</label>
        <input
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Celular</label>
        <input
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Teléfono</label>
        <input
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Correo</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Fecha de nacimiento</label>
        <input
          type="date"
          name="fecha_nac"
          value={formData.fecha_nac || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="beca" className="block text-sm mb-1">
          Beca (% o monto)
        </label>
        <input
          type="number"
          step="0.01"
          id="beca"
          name="beca"
          value={formData.beca ?? ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Ej. 15 o 0.00"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Estatus</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value={1}>Activo</option>
          <option value={0}>Inactivo</option>
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={() => onCancel?.()}
          className="px-4 py-2 rounded border"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
