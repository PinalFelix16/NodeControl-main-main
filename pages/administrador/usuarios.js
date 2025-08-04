import React, { useEffect, useState } from "react";
import RegisterUserForm from "components/Alumnos/RegisterUserForm"; // Ajusta la ruta si es necesario

export default function Usuarios() {
  const [isSuperadmin, setIsSuperadmin] = useState(null); // null = loading, true = puede, false = no puede

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRaw = localStorage.getItem("usuario");
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          if (user && user.permisos === "SUPERADMINISTRADOR") {
            setIsSuperadmin(true);
            return;
          }
        } catch (e) {
          // Si hay error en JSON, no es superadmin
        }
      }
      setIsSuperadmin(false);
    }
  }, []);

  if (isSuperadmin === null) {
    // Loading state (mientras valida)
    return <div className="p-8 text-xl text-center text-gray-400">Cargando...</div>;
  }

  if (!isSuperadmin) {
    // No tiene permiso
    return <div className="p-8 text-xl text-center text-red-500">No autorizado</div>;
  }

  // Si es superadmin, muestra el formulario
  return (
    <div className="p-8 flex justify-center items-start min-h-screen bg-blueGray-50">
      <RegisterUserForm />
    </div>
  );
}
