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

  const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
  const ENDPOINT = `${BASE}/api/alumnos/datos-combinados`;

  async function getAlumnos(newStatus = 1) {
    try {
      const url = `${ENDPOINT}?status=${newStatus}`;
      console.log("[GET alumnos] ->", url);

      const headers = {};
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(url, { headers, credentials: "omit" }); // <- omit si no usas cookies
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error("Error al obtener alumnos:", e);
      Swal.fire("Error", "No se pudo cargar la lista de alumnos.", "error");
      return { data: [] };
    }
  }

  // recarga al cambiar Activo/Inactivo
  useEffect(() => {
    setSearchText("");
    (async () => {
      const raw = await getAlumnos(status);
      const list = raw?.data ?? raw ?? []; // adapta según tu backend
      setFetchedAlumnos(list);
      setAlumnos(list);
    })();
  }, [status]);

  // filtro por búsqueda
  useEffect(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return setAlumnos(fetchedAlumnos);
    setAlumnos(
      fetchedAlumnos.filter((a) =>
        [
          a.nombre ?? "",
          a.apellido ?? "",
          a.correo ?? "",
          a.celular ?? "",
          a.telefono ?? "",
          String(a.id_alumno ?? ""),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
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
      // OJO: si tu ruta de alta/baja está bajo /api, agrega /api aquí también.
      const url = `${BASE}/alumnos/${selectedUser}/${accion.toLowerCase()}`;
      const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();

      Swal.fire("Listo", `Alumno ${accion.toLowerCase()} correctamente`, "success");

      if (accion === "Baja" && status === 1) {
        setStatus(0);
        setHighlightId(selectedUser);
      } else if (accion === "Alta" && status === 0) {
        setStatus(1);
        setHighlightId(selectedUser);
      } else {
        setAlumnos((prev) => prev.filter((a) => a.id_alumno !== selectedUser));
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
          setSelectedUser={(id) => {
            setSelectedUserState(id);
            setSelectedUser(id);
          }}
          highlightId={highlightId}
        />
      </div>
    </div>
  );
}

AllAlumnos.layout = Admin;
