"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import AlumnosTable from "components/Alumnos/AlumnosTable";
import Admin from "layouts/Admin.js";
import { fetchAlumnosStatus } from "services/api/alumnos";

export default function AllAlumnos({ setView, setSelectedUser }) {
  const [alumnos, setAlumnos] = useState([]);
  const [status, setStatus] = useState(1); // 1 = Activos, 0 = Inactivos
  const [searchText, setSearchText] = useState("");
  const [fetchedAlumnos, setFetchedAlumnos] = useState([]);
  const [selectedUser, setSelectedUserState] = useState(null);

  const [highlightId, setHighlightId] = useState(null); // 🔹 Alumno resaltado

  // 🔹 Obtener alumnos
  const getAlumnos = async (newStatus = status) => {
    try {
      const data = await fetchAlumnosStatus(newStatus);
      setAlumnos(data);
      setFetchedAlumnos(data);
    } catch (err) {
      console.error("Error al obtener alumnos:", err);
      setAlumnos([]);
    }
  };

  useEffect(() => {
    getAlumnos(status);
  }, [status]);

  // 🔹 Filtrar alumnos por búsqueda
  useEffect(() => {
    const filtered = fetchedAlumnos.filter(
      (alumno) =>
        alumno.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
        alumno.id?.toString().includes(searchText)
    );
    setAlumnos(filtered);
  }, [searchText, fetchedAlumnos]);

  // 🔹 Maneja Alta/Baja con SweetAlert2 y resaltado temporal
  const handleDelete = async (accion) => {
    if (!selectedUser) return;

    const result = await Swal.fire({
      title: `¿Confirmar ${accion}?`,
      text: `¿Seguro que deseas dar de ${accion.toLowerCase()} a este alumno?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const url = `http://localhost:8000/api/alumnos/${selectedUser}/${accion.toLowerCase()}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
      const data = await response.json();

      // 🔹 Mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "¡Hecho!",
        text: data.message || `Alumno ${accion.toLowerCase()} correctamente`,
        timer: 2000,
        showConfirmButton: false,
      });

      // 🔹 Cambiar de pestaña automáticamente
      if (accion === "Baja" && status === 1) {
        setStatus(0); // Cambiar a inactivos
        await getAlumnos(0);
        setHighlightId(selectedUser); // Alumno resaltado en rojo
      } else if (accion === "Alta" && status === 0) {
        setStatus(1); // Cambiar a activos
        await getAlumnos(1);
        setHighlightId(selectedUser); // Alumno resaltado en verde
      } else {
        // Solo quitar de la lista si no cambia de pestaña
        const updatedAlumnos = alumnos.filter((alumno) => alumno.id !== selectedUser);
        setAlumnos(updatedAlumnos);
      }

      // 🔹 Quitar resaltado después de 3 segundos
      setTimeout(() => setHighlightId(null), 3000);

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el alumno.",
      });
    }
  };

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <AlumnosTable
          color="dark"
          searchText={searchText}
          setSearchText={setSearchText}
          alumnos={alumnos}
          handleDelete={handleDelete}
          status={status}
          setStatus={setStatus}
          setView={setView}
          setSelectedUser={(id) => {
            setSelectedUserState(id);
            setSelectedUser(id);
          }}
          highlightId={highlightId} // 🔹 Pasamos ID para resaltar
        />
      </div>
    </div>
  );
}

AllAlumnos.layout = Admin;
