import React, { useState } from "react"; // Importa React y el hook useState

// layout for page
import Admin from "layouts/Admin.js"; // Importa el layout de administrador

// Importa funciones para dar de baja y de alta a alumnos desde los servicios de API
import { bajaAlumno, altaAlumno } from "services/api/alumnos";

// Importa componentes modales y otros componentes necesarios
import Modal from "components/Alumnos/modals/AddUserModal";
import AllClases from "./AllClases";
import AddProgramas from "./programas/AddProgramas";

export default function Programas() {
  // Estado para gestionar la vista actual (Tabla, Añadir Usuario, Editar Usuario, Mostrar Usuario)
  const [view, setView] = useState('Table'); 

  // Estado para controlar la visibilidad del modal y el título de la acción
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  // Función para manejar la acción de eliminar (baja) un alumno
  const handleDelete = (action) => {
    setTitle(action); // Establece el título con la acción
    setShowModal(true); // Muestra el modal
  };

  // Función para cerrar el modal
  const handleClose = () => {
    setShowModal(false); // Oculta el modal
    setTitle(""); // Limpia el título
  };

  // Función para confirmar la acción en el modal
  const handleConfirm = () => {
    setShowModal(false); // Oculta el modal
    // Aquí puedes agregar la lógica adicional para la confirmación, si es necesario
  };

  return (
    <>
      {/* Modal de confirmación */}
      <Modal
        show={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={`Confirmar ${title}`}
        message={`¿Estás seguro de que deseas dar de ${title} a este alumno?`}
      />
      
      { 
        // Renderiza la vista correspondiente según el estado 'view'
        view === "Table" 
          ? (<AllClases title={title} setView={setView} handleDelete={handleDelete} />)
          : view === "AddUser" 
          ? (<AddProgramas setView={setView} />)
          : null
      }
    </>
  );
}

// Asigna el layout de administrador al componente Programas
Programas.layout = Admin;
