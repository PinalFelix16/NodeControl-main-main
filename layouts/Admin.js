import React from "react";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import withAuth from "./WithAuth"; // Importa el HOC de autenticación

const Admin = ({ children }) => {
  return (
    <>
      {/* Barra lateral de navegación */}
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100 min-h-screen">
        {/* Navbar superior */}
        <AdminNavbar />
        {/* Header con stats */}
        <HeaderStats />
        {/* Contenido principal */}
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {children}
          {/* Footer */}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
};

export default withAuth(Admin); // Aplica protección de sesión a TODO lo que use este layout
