// pages/administrador/AllClases.jsx
import React, { useEffect, useState } from "react";
import Admin from "layouts/Admin.js";
import { fetchClases } from "services/api/clases";
import ClasesCard from "components/Clases/ClasesCard";

export default function AllClases({
  onClickEvent,
  setView,
  setSelectedUser = () => {},
  handleDelete,
  title,
  isStudent = false,
  programasAlumno = [],
}) {
  const [programas, setProgramas] = useState([]);

  const normalizePrograms = (list) =>
    (Array.isArray(list) ? list : [])
      .map((p) => ({
        ...p,
        clases: Array.isArray(p.clases)
          ? p.clases.filter((c) => c && c.id_clase != null)
          : [],
      }))
      .filter((p) => p.clases.length > 0);

  useEffect(() => {
    async function getProgramas() {
      const data = await fetchClases();

      // ⬇️⬇️ ÚNICO AJUSTE: excluir SOLO los que el alumno ya cursa
      const idsYaInscritos = new Set(
        (programasAlumno || [])
          .filter((p) => p && p.inscrito === true)
          .map((p) => String(p.id_programa))
      );

      const filteredProgramas = normalizePrograms(
        (Array.isArray(data) ? data : []).filter(
          (programa) => !idsYaInscritos.has(String(programa.id_programa))
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
            <h3 className={"font-semibold text-2xl text-blueGray-700"}>
              Lista de clases
            </h3>
            {!isStudent && (
              <button
                onClick={() => {
                  setView("AddUser");
                  setSelectedUser(null);
                }}
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
            <div className="flex flex-wrap">
              {programas.map((element) => {
                const safeClases = Array.isArray(element.clases)
                  ? element.clases.filter((c) => c && c.id_clase != null)
                  : [];
                if (safeClases.length === 0) return null;

                const key = String(
                  element.id_programa ?? `p-${element.nombre_programa}`
                );

                return (
                  <div
                    onClick={() => {
                      onClickEvent && onClickEvent(element.id_programa);
                    }}
                    className="w-full lg:w-6/12 px-4 py-2 mb-2 hover:bigger"
                    key={key}
                    style={{ cursor: "pointer" }}
                  >
                    <ClasesCard
                      statSubtitle={element.nombre_programa}
                      statTitle="Baby Dance Group A"
                      statPercent={element.mensualidad}
                      statSchedule={safeClases}
                      onEdit={(id_clase) => {
                        if (!id_clase)
                          return alert("Esta clase no tiene id_clase.");
                        setSelectedUser(id_clase);
                        setView("EditUser");
                      }}
                      onDelete={(id_clase) => {
                        if (!id_clase)
                          return alert("Esta clase no tiene id_clase.");
                        if (handleDelete) handleDelete(id_clase);
                        setProgramas((prev) =>
                          prev
                            .map((p) => ({
                              ...p,
                              clases: (p.clases || []).filter(
                                (c) => c.id_clase !== id_clase
                              ),
                            }))
                            .filter((p) => (p.clases || []).length > 0)
                        );
                      }}
                    />
                  </div>
                );
              })}
              {programas.length === 0 && <p>No hay clases disponibles</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

AllClases.layout = Admin;
