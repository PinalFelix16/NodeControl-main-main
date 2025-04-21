import React, { useEffect, useState } from "react";
import Admin from "layouts/Admin.js";
import { fetchClases } from "services/api/clases";
import ClasesCard from "components/Clases/ClasesCard";

export default function AllClasesPrueba({ onClickEvent, setView, setSelectedUser = () => {}, handleDelete, title, isStudent = false, programasAlumno = [] }) {
  const [programas, setProgramas] = useState([]);

  const [deletingId, setDeletingId] = useState(null);



  useEffect(() => {
    async function getProgramas() {
      const data = await fetchClases();
      const filteredProgramas = data.filter(programa =>
        !programasAlumno.some(alumnoPrograma =>
          alumnoPrograma.id_programa === programa.id_programa
        )
      );
      setProgramas(filteredProgramas);
    }
    getProgramas();
  }, [title, programasAlumno]);


  const removeClase = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta clase?")) return;
  
    setDeletingId(id); // <-- indicamos que esta clase se está eliminando
  
    try {
      const response = await fetch(`http://localhost:8000/api/clases/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        alert("Clase eliminada con éxito");
        setProgramas((prev) => prev.filter((programa) => programa.id_programa !== id));
      } else {
        const result = await response.json();
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error eliminando la clase:", error);
      alert("Hubo un problema eliminando la clase.");
    } finally {
      setDeletingId(null); // <-- limpiamos el estado después
    }
  };
  
  
  

  return (
    <>
      <div className="flex flex-wrap mt-0">
      <div className="flex flex-wrap items-center w-full">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className={"font-semibold text-2xl " + ("color" === "light" ? "text-blueGray-700" : "text-white")}>
              Lista de clases
            </h3>
            {!isStudent && (
              <button
                onClick={() => { setView('AddUser'); setSelectedUser(null); }}
                className="mt-4 float-right bg-transparent border border-solid hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-blueGray-200 border-blueGray-200"
                type="button"
              >
                <i className="fas fa-plus mr-2"></i> Agregar Clase 1
              </button>
            )}
          </div>
        </div>
        <div className="w-full mb-12 px-4">
          <div className="px-4 md:px-10 mx-auto w-full">
            <div>
              <div className="flex flex-wrap">
                {programas?.map((element, index) => {
                  return (
                    
                    <div
  onClick={() => {
    if (deletingId !== element.id_programa) {
      onClickEvent(element.id_programa);
    }
  }}
  className={`w-full lg:w-6/12 px-4 py-2 mb-2 hover:bigger ${
    deletingId === element.id_programa ? "opacity-50 pointer-events-none" : ""
  }`}
  key={index}
  style={{ cursor: deletingId === element.id_programa ? "not-allowed" : "pointer" }}
>

                    
                    
                      <ClasesCard
                        statSubtitle={element.nombre_programa}
                        statPercent={element.mensualidad}
                        statSchedule={element.clases}
                       // handleDelete={handleDelete}
                      />
                      
                      <button
                        onClick={() => { setSelectedUser(element); setView('EditUser'); }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 mr-4"
                      >
                        Editar Clase
                      </button>
                      <button
                      type="button"
                      onClick={() => removeClase(element.id_programa)}  // Pasamos el id_programa
                     className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
>
                       Borrar Clase
                        </button>

                      
                    </div>
                    
                  );
                })}
                {programas.length === 0 && (<p>No hay clases disponibles</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

AllClasesPrueba.layout = Admin;
