import React, { useEffect, useState } from "react";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Navbar() {
  // 1. Crea un estado para guardar el tipo de usuario
  const [userType, setUserType] = useState("");

  // 2. Solo accede a localStorage dentro de useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tipo = localStorage.getItem('user_type') || "";
      setUserType(tipo);
    }
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            {/* Renderiza solo cuando ya se cargó el valor */}
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
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
              />
            </div>
          </form>
          {/* User */}
          <UserDropdown />
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
