import React, { useEffect, useState } from "react";

// components

import MaestrosTable from "components/Maestros/MaestrosTable";

// layout for page

import Admin from "layouts/Admin.js";


import {fetchMaestros} from "services/api/maestros"
export default function AllMaestros({setView, setSelectedUser, handleDelete, title}) {
  const [maestros, setMaestros] = useState([]);
  const [status, setStatus] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [fetchedMaestros, setFetchedMaestros] = useState([]);
 
  useEffect(() => {
    async function getMaestros() {
      if (title !== "") return 1;
      const data = await fetchMaestros(status);
      setMaestros(data);
      setFetchedMaestros(data);

    }

    getMaestros();
  }, [status, title]);



useEffect(() => {
  const filteredMaestros = fetchedMaestros.filter(maestro =>
    maestro.nombre_maestro.toLowerCase().includes(searchText.toLowerCase()) || maestro.id_maestro.toLowerCase().includes(searchText.toLowerCase())
  );
  setMaestros(filteredMaestros);

}, [searchText, fetchedMaestros]);

  return (
    <>
      <div className="flex flex-wrap mt-4">
     
        <div className="w-full mb-12 px-4"> 
          <MaestrosTable color="dark" searchText={searchText} setSearchText={setSearchText} maestros={maestros} handleDelete={handleDelete} status={status} setStatus={setStatus} setView={setView} setSelectedUser={setSelectedUser}/>
        </div>
      </div>
    </>
  )
}

AllMaestros.layout = Admin; 
