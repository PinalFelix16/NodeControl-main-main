// pages/administrador/programas2.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Admin from "layouts/Admin.js";
import AllClasesPrueba from "./AllClasesPrueba";
import AddProgramas from "./programas/AddProgramas";
import EditProgramas from "./programas/EditProgramas.js";
import Link from "next/link";

export default function Programas2() {
  const [view, setView] = useState("All"); // All | Table | AddUser | EditUser
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // ← para recargar grilla
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.replace("/auth/login");
    }
  }, [router]);

  const isListView = view === "All" || view === "Table";

  const handleSaved = () => {
    // cuando EditForm guarda: regresamos y forzamos reload de la lista
    setRefreshKey((k) => k + 1);
    setView("All");
  };

  return (
    <div className="px-4 md:px-10 mx-auto w-full">
      {isListView && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Lista de clases</h1>
            <div className="flex gap-2">
              <Link
                href="/administrador/usuarios"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition"
              >
                Usuarios
              </Link>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setView("AddUser");
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-bold transition"
              >
                Agregar Clase
              </button>
            </div>
          </div>

          <AllClasesPrueba
            setView={setView}
            setSelectedUser={setSelectedUser}
            isStudent={false}
            programasAlumno={[]}
            refreshKey={refreshKey}   // ← se usa para refetch
          />
        </>
      )}

      {view === "AddUser" && (
        <AddProgramas setView={setView} />
      )}

      {view === "EditUser" && (
        <EditProgramas
          setView={setView}
          selectedUser={selectedUser}
          onSaved={handleSaved}   // ← notifica guardado
        />
      )}
    </div>
  );
}

Programas2.layout = Admin;
