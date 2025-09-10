import React from "react";
import PropTypes from "prop-types";

// components

export default function MaestrosTable({ color, maestros, status, setStatus, setView, setSelectedUser, handleDelete, searchText, setSearchText }) {
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Lista de maestros
              </h3>
             
              <span className="mt-4 items-stretch">
                  
                  <input
                  style={{maxWidth: "200px", marginTop:"15px"}}
                    type="text"
                    value={searchText}
                    onChange={(e)=>{setSearchText(e.target.value)}}
                    placeholder="Buscar maestro"
                    className="border-0 px-3 py-3  placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                  />
              </span>
              <button className="mt-4 float-right bg-transparent border border-solid  hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-blueGray-200 border-blueGray-200" type="button">
                <i className="fas fa-print mr-2"></i> Imprimir
              </button>
              <button onClick={()=>{setView('AddUser'); setSelectedUser(null);}} className="mt-4 float-right bg-transparent border border-solid  hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-blueGray-200 border-blueGray-200" type="button">
                <i className="fas fa-plus mr-2"></i> Agregar Maestro
              </button>


            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  #
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  ID 
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  Nombre
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  Clases
                </th>
                
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >Acciones</th>
              </tr>
            </thead>
            <tbody>
            {maestros.map((maestro, index) => (
              <tr>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center hover:bg-sky-700 cursor-pointer">
                  {index + 1}
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {maestro.id_maestro}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {/* <i className="fas fa-circle text-emerald-500 mr-2"></i>{" "} */}
                  {maestro.nombre_maestro}
                </td>
               <td className="bordert-t-0 px-6 align-middle border-l-0 border-r-0 text-xs  p-4">
                    {(Array.isArray(maestro.clases) ? maestro.clases : []).map((clase, index) => (
                   <div key={index}>{clase}</div>
              ))}
 
                  </td>

                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <button onClick={()=>{setView('EditUser'); setSelectedUser(maestro.id_maestro);}} title="Editar maestro" className="text-red-300 bg-transparent border border-solid border-blueGray-100 hover:bg-blueGray-100 hover:text-white active:bg-blueGray-100 font-bold uppercase text-sm px-2 py-1 rounded outline-none focus:outline-none mr-4 mb-1 ease-linear transition-all duration-150  hover:text-lightBlue-500 hover:border-lightBlue-500"  type="button">
                    <i className="fas fa-user-edit text-2xl "></i>
                  </button>
                   <button onClick={()=>{handleDelete('Baja'); setSelectedUser(maestro.id_maestro)}} title="Dar de baja a maestro" className="text-red-500 bg-transparent border border-solid border-blueGray-100 hover:bg-blueGray-100 hover:text-white active:bg-blueGray-100 font-bold uppercase text-sm px-2 py-1 rounded outline-none focus:outline-none mr-4 mb-1 ease-linear transition-all duration-150  hover:text-lightBlue-500 hover:border-lightBlue-500"  type="button">
                    <i className="fas fa-arrow-alt-circle-down text-2xl "></i>
                  </button>                 
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

MaestrosTable.defaultProps = {
  color: "light",
};

MaestrosTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
