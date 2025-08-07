// components/ProtectedRoute.js
import React from "react";
import { useRouter } from "next/router";

export default function ProtectedRoute({ permisoRequerido, children }) {
  // Lee usuario y token del localStorage (solo lado cliente)
  if (typeof window === "undefined") return null;

  const userRaw = localStorage.getItem("usuario");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const token = localStorage.getItem("token");
  const router = useRouter();

  // Si no hay token o usuario → bloquea
  if (!user || !token) {
    // MENSAJE DE ERROR PERSONALIZADO PARA NO AUTENTICADOS
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
        <div className="p-8 bg-white rounded shadow text-xl text-center text-red-500">
          No has iniciado sesión. <br />
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 rounded bg-blue-700 text-white font-bold hover:bg-blue-900"
          >
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  // Si tiene usuario, pero no permisos
  if (permisoRequerido && user.permisos !== permisoRequerido) {
    // MENSAJE DE ERROR PERSONALIZADO PARA FALTA DE PERMISOS
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
        <div className="p-8 bg-white rounded shadow text-xl text-center text-red-500">
          No tienes permisos para acceder a esta sección.
          <br />
          Si crees que esto es un error, contacta al administrador.
        </div>
      </div>
    );
  }

  // Si está autenticado y con permisos, muestra el contenido:
  return <>{children}</>;
}
