import React, { useEffect, useState } from "react";
import Admin from "layouts/Admin.js";
import { fetchClases } from "services/api/clases";
import ClasesCard from "components/Clases/ClasesCard";

export default function AllClases({ onClickEvent, setView, setSelectedUser = () => {}, handleDelete, title, isStudent = false, programasAlumno = [] }) {
  const [programas, setProgramas] = useState([]);

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
                className="float-right mb-4 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white text-sm font-bold px-4 py-2 rounded shadow transition-colors duration-150 ease-linear outline-none focus:outline-none"
                type="button"
              >
                <i className="fas fa-plus mr-2"></i> Agregar Clase
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
                    <div onClick={() => { onClickEvent(element.id_programa); }} className="w-full lg:w-6/12 px-4 py-2 mb-2 hover:bigger" key={index} style={{ cursor: "pointer" }}>
                      <ClasesCard
                        statSubtitle={element.nombre_programa}
                        statTitle="Baby Dance Group A"
                        statPercent={element.mensualidad}
                        statSchedule={element.clases}
                        handleDelete={handleDelete}
                      />
                    

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

AllClases.layout = Admin;
