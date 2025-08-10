"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import AlumnosTable from "components/Alumnos/AlumnosTable";
import Admin from "layouts/Admin.js";

export default function AllAlumnos({ setView, setSelectedUser }) {
  const [alumnos, setAlumnos] = useState([]);
  const [status, setStatus] = useState(1); // 1 = activos, 0 = inactivos
  const [searchText, setSearchText] = useState("");
  const [fetchedAlumnos, setFetchedAlumnos] = useState([]);
  const [selectedUser, setSelectedUserState] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const getAlumnos = async (newStatus = status) => {
    try {
      const url = `${BASE}/alumnos/datos-combinados?status=${newStatus}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();

      console.log("[GET alumnos]", { newStatus, raw });
      const rows = Array.isArray(raw) ? raw : (raw.data ?? raw.alumnos ?? raw.results ?? []);
      setAlumnos(rows || []);
      setFetchedAlumnos(rows || []);
    } catch (err) {
      console.error("Error al obtener alumnos:", err);
      setAlumnos([]);
      setFetchedAlumnos([]);
      Swal.fire("Error", "No se pudieron cargar los alumnos.", "error");
    }
  };

  // cuando cambias de ACTIVO <-> INACTIVO, limpia búsqueda y vuelve a pedir
  useEffect(() => {
    setSearchText("");
    getAlumnos(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // filtro por búsqueda
  useEffect(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return setAlumnos(fetchedAlumnos);
    setAlumnos(
      fetchedAlumnos.filter(a =>
        [
          a.nombre ?? "",
          a.apellido ?? "",
          a.correo ?? "",
          a.celular ?? "",
          a.telefono ?? "",
          String(a.id_alumno ?? ""),
        ].join(" ").toLowerCase().includes(q)
      )
    );
  }, [searchText, fetchedAlumnos]);

  const handleDelete = async (accion) => {
    if (!selectedUser) return;

    const ask = await Swal.fire({
      title: `¿Confirmar ${accion}?`,
      text: `¿Seguro que deseas dar de ${accion.toLowerCase()} a este alumno?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });
    if (!ask.isConfirmed) return;

    try {
      const url = `${BASE}/alumnos/${selectedUser}/${accion.toLowerCase()}`;
      const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();

      Swal.fire("Listo", `Alumno ${accion.toLowerCase()} correctamente`, "success");

      // mueve de pestaña si aplica y resalta
      if (accion === "Baja" && status === 1) {
        setStatus(0);
        setHighlightId(selectedUser);
      } else if (accion === "Alta" && status === 0) {
        setStatus(1);
        setHighlightId(selectedUser);
      } else {
        // si no cambió de pestaña, quítalo de la lista actual
        setAlumnos(prev => prev.filter(a => a.id_alumno !== selectedUser));
      }

      setTimeout(() => setHighlightId(null), 3000);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo actualizar el alumno.", "error");
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
          setSelectedUser={(id) => { setSelectedUserState(id); setSelectedUser(id); }}
          highlightId={highlightId}
        />
      </div>
    </div>
  );
}

AllAlumnos.layout = Admin;
