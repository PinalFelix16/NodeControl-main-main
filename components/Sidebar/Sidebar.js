import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logout as apiLogout } from "services/api/auth";
import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import Image from "next/image";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const router = useRouter();

  async function logout() {
    const token = localStorage.getItem("token");
    await apiLogout(token); // Llama al backend para destruir el token
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_type");
    // Elimina aquí cualquier otro dato de sesión si lo usas
    router.push("/auth/login"); // O la ruta de login que corresponda
  }

  return (
    <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 
                    md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden 
                    shadow-xl bg-blueGray-800 flex flex-wrap items-center 
                    justify-between relative md:w-64 z-10 py-4 px-6 custom-scrollbar">
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap 
                      px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        {/* Toggler */}
        <button
          className="cursor-pointer text-white opacity-50 md:hidden px-3 py-1 
                     text-xl leading-none bg-transparent rounded border border-solid border-transparent"
          type="button"
          onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
        >
          <i className="fas fa-bars" />
        </button>

        {/* Brand */}
        <Link
          href="/"
          className="md:block text-left md:pb-2 text-blueGray-100 mr-0 inline-block 
                     whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
        >
          <Image
            unoptimized
            width={200}
            height={100}
            src="/img/images/mcdcname.png"
            className="h-100 w-100 bg-dark"
            alt="Logo"
          />
        </Link>

        {/* User (mobile only) */}
        <ul className="md:hidden items-center flex flex-wrap list-none">
          <li className="inline-block relative">
            <NotificationDropdown />
          </li>
          <li className="inline-block relative">
            <UserDropdown />
          </li>
        </ul>

        {/* Collapse */}
        <div
          className={
            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none " +
            "shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden " +
            "h-auto items-center flex-1 rounded " +
            collapseShow
          }
        >
          {/* Collapse header */}
          <div className="md:min-w-full md:hidden block pb-4 mb-4 
                          border-b border-solid border-blueGray-200">
            <div className="flex flex-wrap">
              <div className="w-6/12">
                <Link
                  href="/"
                  className="md:block text-left md:pb-2 text-blueGray-100 mr-0 inline-block 
                             whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                >
                  Notus NextJS
                </Link>
              </div>
              <div className="w-6/12 flex justify-end">
                <button
                  type="button"
                  className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 
                             text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                  onClick={() => setCollapseShow("hidden")}
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>
          </div>

          {/* Search (mobile only) */}
          <form className="mt-6 mb-4 md:hidden">
            <div className="mb-3 pt-0">
              <input
                type="text"
                placeholder="Search"
                className="border-0 px-3 py-2 h-12 border border-solid 
                           border-blueGray-500 placeholder-blueGray-300 text-blueGray-100 
                           bg-white rounded text-base leading-snug shadow-none outline-none 
                           focus:outline-none w-full font-normal"
              />
            </div>
          </form>

          <hr className="my-4 md:min-w-full" />
          <h6 className="md:min-w-full text-blueGray-200 text-xs uppercase font-bold 
                         block pt-1 pb-4 no-underline">
            Administración
          </h6>

          {/* Navigation */}
         <ul className="md:flex-col md:min-w-full flex flex-col list-none">
            {[
              { href: "/administrador/programas2", icon: "fas fa-tv", label: "Clases" },
              { href: "/administrador/alumnos",    icon: "fas fa-tools", label: "Alumnos" },
              { href: "/administrador/maestros",   icon: "fas fa-table", label: "Maestros" },
              { href: "/administrador/cortes",     icon: "fas fa-file-alt", label: "Consultas" },
              { href: "/administrador/nomina",     icon: "fas fa-money-bill", label: "Nómina" },
            ].map((item) => {
              const active = router.pathname.includes(item.href);
              return (
                <li key={item.href} className="items-center">
                  <Link
                    href={item.href}
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (active
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-300 hover:text-blueGray-500")
                    }
                  >
          {/* Único hijo directo */}
          <span className="flex items-center w-full transition-all duration-300">
            <i className={`${item.icon} text-base` } />
            <span className="ml-3">{item.label}</span>
          </span>
        </Link>
      </li>
    );
  })}

  {/* Logout */}
  <li className="items-center mt-4">
    <button
      onClick={logout}
      className="w-full py-2 px-4 flex items-center text-sm font-semibold text-white opacity-70 hover:text-red-400 hover:opacity-100 transition-all duration-300"
    >
      <span className="flex items-center w-full">
        <i className="fas fa-sign-out-alt text-base" />
        <span className="ml-3">Cerrar Sesión</span>
      </span>
    </button>
  </li>
</ul>

        </div>
      </div>
    </nav>
  );
}
