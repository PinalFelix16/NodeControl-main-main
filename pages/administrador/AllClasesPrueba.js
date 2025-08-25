import React, { useEffect, useState, useCallback } from "react";
import Admin from "layouts/Admin.js";
import { fetchClases, deleteClase } from "services/api/clases";
import ClasesCard from "components/Clases/ClasesCard";

export default function AllClasesPrueba({
  setView,
  setSelectedUser = () => {},
  isStudent = false,
  programasAlumno = [],
  refreshKey = 0, // si Programas2 lo manda, forzamos refetch
}) {
  const [programas, setProgramas] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper: limpia estructura (sin clases inválidas y sin programas vacíos)
  const normalizePrograms = (list) =>
    (Array.isArray(list) ? list : [])
      .map((p) => ({
        ...p,
        clases: Array.isArray(p.clases)
          ? p.clases.filter((c) => c && c.id_clase != null)
          : [],
      }))
      .filter((p) => p.clases.length > 0);

  // Cargar Programas + Clases agrupadas
  useEffect(() => {
    let cancel = false;
    (async () => {
      setError("");
      setLoading(true);
      try {
        const data = await fetchClases();
        if (!cancel) setProgramas(normalizePrograms(data));
      } catch (e) {
        console.error(e);
        if (!cancel) setError(e.message || "No se pudieron cargar las clases");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [programasAlumno, refreshKey]); // incluye refreshKey para forzar recarga

  // Ir a editar clase
  const onEditClase = useCallback((id_clase) => {
    if (!id_clase) return;
    sessionStorage.setItem("editClaseId", String(id_clase));
    setSelectedUser(id_clase);
    setView("EditUser");
  }, [setSelectedUser, setView]);

  // Borrar clase y limpiar tarjeta si el programa queda vacío
  const removeClase = useCallback(async (id_clase) => {
    if (!id_clase) return;
    if (!window.confirm("¿Estás seguro de eliminar esta clase?")) return;

    setDeletingId(id_clase);
    try {
      await deleteClase(id_clase);
      setProgramas((prev) =>
        prev
          .map((p) => ({
            ...p,
            clases: (p.clases || []).filter((c) => c.id_clase !== id_clase),
          }))
          .filter((p) => (p.clases || []).length > 0) // <- elimina programas vacíos
      );
    } catch (e) {
      console.error(e);
      alert(e.message || "Error al eliminar la clase");
    } finally {
      setDeletingId(null);
    }
  }, []);

  return (
    <>
      <div className="flex flex-wrap mt-0">
        <div className="flex flex-wrap items-center w-full">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-2xl text-blueGray-700">
              Lista de clases
            </h3>

            {!isStudent && (
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setView("AddUser");
                }}
                className="mt-4 float-right bg-transparent border border-solid hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-blueGray-200 border-blueGray-200"
                type="button"
              >
                <i className="fas fa-plus mr-2"></i> Agregar Clase
              </button>
            )}
          </div>
        </div>

        <div className="w-full mb-12 px-4">
          <div className="px-4 md:px-10 mx-auto w-full">
            {loading && <p className="px-4 py-2">Cargando…</p>}
            {!!error && <p className="px-4 py-2 text-red-600">{error}</p>}

            <div className="flex flex-wrap">
              {programas.map((programa) => {
                // si por alguna razón llegó vacío, no renderizamos el hueco
                const safeClases = Array.isArray(programa.clases)
                  ? programa.clases.filter((c) => c && c.id_clase != null)
                  : [];
                if (safeClases.length === 0) return null;

                const stableKey = String(
                  programa.id_programa ?? `p-${programa.nombre_programa ?? "?"}`
                );

                return (
                  <div
                    key={stableKey}
                    className="w-full lg:w-6/12 px-4 py-2 mb-2"
                  >
                    <ClasesCard
                      statSubtitle={programa.nombre_programa}
                      statPercent={programa.mensualidad}
                      statSchedule={safeClases}
                      onEdit={onEditClase}
                      onDelete={(id) => {
                        if (deletingId === id) return;
                        removeClase(id);
                      }}
                    />
                  </div>
                );
              })}

              {!loading && programas.length === 0 && (
                <p className="px-4 py-2">No hay clases disponibles</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

AllClasesPrueba.layout = Admin;
