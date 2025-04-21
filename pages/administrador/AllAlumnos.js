import React, { useEffect, useState } from "react"; // Importa React y los hooks useEffect y useState

// Importa componentes
import AlumnosTable from "components/Alumnos/AlumnosTable";

// Layout para la página
import Admin from "layouts/Admin.js"; // Importa el layout de administrador

import { fetchAlumnosStatus } from "services/api/alumnos"; // Importa la función para obtener el estado de los alumnos
import Modal from "components/Alumnos/modals/AddUserModal"; // Importa el componente Modal

// Componente principal AllAlumnos
export default function AllAlumnos({ setView, setSelectedUser, handleDelete, title }) {
  const [alumnos, setAlumnos] = useState([]); // Estado para almacenar los alumnos
  const [status, setStatus] = useState(1); // Estado para almacenar el status actual
  const [searchText, setSearchText] = useState(""); // Estado para almacenar el texto de búsqueda
  const [fetchedAlumnos, setFetchedAlumnos] = useState([]); // Estado para almacenar los alumnos obtenidos

  // useEffect para obtener los alumnos basado en el status
  useEffect(() => {
    async function getAlumnos() {
      if (title !== "") return 1; // Si hay un título, retorna inmediatamente (posible lógica de control)
      const data = await fetchAlumnosStatus(status); // Llama a la API para obtener los alumnos según el status
      setAlumnos(data); // Actualiza el estado de alumnos con los datos obtenidos
      setFetchedAlumnos(data); // Actualiza el estado de alumnos obtenidos con los datos obtenidos
    }

    getAlumnos(); // Llama a la función para obtener los alumnos
  }, [status, title]); // Dependencias: se ejecutará cuando cambie el status o el título

  // useEffect para filtrar los alumnos basado en el texto de búsqueda
  useEffect(() => {
    const filteredAlumnos = fetchedAlumnos.filter(alumno =>
      alumno.nombre.toLowerCase().includes(searchText.toLowerCase()) || 
      alumno.id_alumno.toLowerCase().includes(searchText.toLowerCase())
    ); // Filtra los alumnos por nombre o ID que coincidan con el texto de búsqueda
    setAlumnos(filteredAlumnos); // Actualiza el estado de alumnos con los alumnos filtrados
  }, [searchText, fetchedAlumnos]); // Dependencias: se ejecutará cuando cambie el texto de búsqueda o los alumnos obtenidos

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4"> 
          {/* Componente AlumnosTable con las propiedades necesarias */}
          <AlumnosTable 
            color="dark" 
            searchText={searchText} 
            setSearchText={setSearchText} 
            alumnos={alumnos} 
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
}

// Asigna el layout de administrador al componente AllAlumnos
AllAlumnos.layout = Admin;
