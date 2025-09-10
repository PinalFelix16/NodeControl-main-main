// <-- PROTOCOLO ROJO: archivo completo actualizado
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";

// components
import MaestrosTable from "components/Maestros/MaestrosTable";

// layout for page (este componente NO es página, así que no usaremos .layout)
import Admin from "layouts/Admin.js";

import { fetchMaestros } from "services/api/maestros";

// Definimos el componente en una constante para poder referenciarlo si se necesitara
const AllMaestros = forwardRef(function AllMaestros(
  { setView, setSelectedUser, handleDelete, title },
  ref
) {
  const [maestros, setMaestros] = useState([]);
  const [status, setStatus] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [fetchedMaestros, setFetchedMaestros] = useState([]);

  // Fuera del useEffect para exponerlo por ref
  async function getMaestros() {
    if (title !== "") return; // <-- PROTOCOLO ROJO: evita refrescar durante modal/acciones
    const data = await fetchMaestros(status);
    setMaestros(data);
    setFetchedMaestros(data);
  }

useEffect(() => {
  const filtered = fetchedMaestros.filter(m => {
    const nombre = m?.nombre_maestro ? m.nombre_maestro.toLowerCase() : "";
    const id = m?.id_maestro ? String(m.id_maestro).toLowerCase() : "";

    return (
      nombre.includes(searchText.toLowerCase()) ||
      id.includes(searchText.toLowerCase())
    );
  });

  setMaestros(filtered);
}, [fetchedMaestros, searchText]);

  // Exponer método reloadData() al padre
  useImperativeHandle(ref, () => ({
    reloadData: getMaestros, // <-- PROTOCOLO ROJO
  }));

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <MaestrosTable
            color="dark"
            searchText={searchText}
            setSearchText={setSearchText}
            maestros={maestros}
            handleDelete={handleDelete}
            status={status}
            setStatus={setStatus}
            setView={setView}
            setSelectedUser={setSelectedUser}
          />
        </div>
      </div>
    </>
  );
});

export default AllMaestros;
// AllMaestros.layout = Admin; // <-- PROTOCOLO ROJO: LÍNEA ELIMINADA (causaba ReferenceError)
