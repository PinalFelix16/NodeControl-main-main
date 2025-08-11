"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchAlumnoAllData, updateAlumno } from "services/api/alumnos";

export default function EditarAlumno({ setView, selectedUser }) {
  const initialFormData = {
    nombre: "",
    fecha_nac: "",
    celular: "",
    tutor: "",
    tutor_2: "",
    telefono: "",
    telefono_2: "",
    hist_medico: "",
    status: 1,
    beca: "0.00"
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Obtener datos del alumno
  useEffect(() => {
    const getAlumno = async () => {
      try {
        const data = await fetchAlumnoAllData(selectedUser);
        if (data?.alumno) {
          setFormData({
            nombre: data.alumno.nombre || "",
            fecha_nac: data.alumno.fecha_nac || "",
            celular: data.alumno.celular || "",
            tutor: data.alumno.tutor || "",
            tutor_2: data.alumno.tutor_2 || "",
            telefono: data.alumno.telefono || "",
            telefono_2: data.alumno.telefono_2 || "",
            hist_medico: data.alumno.hist_medico || "",
            status: data.alumno.status ?? 1,
            beca: data.alumno.beca?.toString() || "0.00"
          });
        }
      } catch (error) {
        console.error("Error al obtener alumno:", error);
        Swal.fire("Error", "No se pudieron cargar los datos del alumno", "error");
      }
    };

    if (selectedUser) {
      getAlumno();
    }
  }, [selectedUser]);

  // 2️⃣ Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 3️⃣ Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateAlumno(selectedUser, formData);
      Swal.fire("¡Éxito!", "Alumno actualizado correctamente", "success");
      setView("allAlumnos"); // Volver a la lista
    } catch (error) {
      console.error("Error al actualizar alumno:", error);
      Swal.fire("Error", "No se pudo actualizar el alumno", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Editar Alumno</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          name="fecha_nac"
          value={formData.fecha_nac}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          placeholder="Celular"
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="tutor"
          value={formData.tutor}
          onChange={handleChange}
          placeholder="Tutor"
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="tutor_2"
          value={formData.tutor_2}
          onChange={handleChange}
          placeholder="Tutor 2"
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="telefono_2"
          value={formData.telefono_2}
          onChange={handleChange}
          placeholder="Teléfono 2"
          className="border p-2 rounded"
        />

        <textarea
          name="hist_medico"
          value={formData.hist_medico}
          onChange={handleChange}
          placeholder="Historial Médico"
          className="border p-2 rounded col-span-2"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value={1}>Activo</option>
          <option value={0}>Inactivo</option>
        </select>

        <input
          type="number"
          step="0.01"
          name="beca"
          value={formData.beca}
          onChange={handleChange}
          placeholder="Beca"
          className="border p-2 rounded"
        />

        <div className="col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => setView("allAlumnos")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
