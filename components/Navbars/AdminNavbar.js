import React, { useEffect, useState } from "react";
import Link from "next/link";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Navbar() {
  // 1. Crea un estado para guardar el tipo de usuario y si es superadmin
  const [userType, setUserType] = useState("");
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  // 2. Solo accede a localStorage dentro de useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Aquí toma de localStorage el usuario completo si está disponible
      const userRaw = localStorage.getItem("usuario");
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          setUserType(user.permisos || "");
          setIsSuperadmin(user.permisos === "SUPERADMINISTRADOR");
        } catch (e) {
          setUserType("");
          setIsSuperadmin(false);
        }
      } else {
        setUserType("");
        setIsSuperadmin(false);
      }
    }
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={e => e.preventDefault()}
          >
            {userType}
          </a>
          {/* Form */}
          <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-stretch">
              <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Buscar Alumno..."
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
              />
            </div>
          </form>
          {/* Botón sólo para SUPERADMINISTRADOR */}
          {isSuperadmin && (
            <Link href="/administrador/usuarios" className="ml-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition shadow"
                type="button"
              >
                Agregar Usuario
              </button>
            </Link>
          )}
          {/* Si quieres mantener el dropdown, lo puedes dejar; si no, elimínalo */}
          {/* <UserDropdown /> */}
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
