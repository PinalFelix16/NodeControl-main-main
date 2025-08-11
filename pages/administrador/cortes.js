import React, { useEffect, useState } from "react";
import ProtectedRoute from "components/ProtectedRoute";
import Admin from "layouts/Admin.js";
import AllCortes from "./cortes/AllCortes";

export default function Cortes() {
  const [cortes, setCortes] = useState(null); // Empieza en null para mostrar 'Cargando...'
  const [loading, setLoading] = useState(true);

  // Traer los datos actualizados
  const fetchCortes = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/corte-caja", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    setCortes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCortes();
  }, []);

  return (
    <ProtectedRoute permisoRequerido="SUPERADMINISTRADOR">
      <AllCortes
        cortes={cortes}
        loading={loading}
        reloadCortes={fetchCortes}
      />
    </ProtectedRoute>
  );
}

Cortes.layout = Admin;

export async function realizarCorte(data) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:8000/api/realizar-corte", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

