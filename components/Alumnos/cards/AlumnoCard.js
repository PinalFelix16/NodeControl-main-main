import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Admin from "layouts/Admin.js";
import { bajaAlumno, altaAlumno } from "services/api/alumnos";
import Modal from "components/Alumnos/modals/AddUserModal";
import AllClasesPrueba from "./AllClasesPrueba";
import AddProgramas from "./programas/AddProgramas";
import EditProgramas from "./programas/EditProgramas.js";
import Link from "next/link";

export default function Programas2() {
  const [view, setView] = useState('Table'); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Revisa si hay token en localStorage (usuario autenticado)
    if (!localStorage.getItem("token")) {
      router.replace("/auth/login"); // Cambia a tu ruta real si es necesario
    }

    // Verifica permisos de superadministrador
    const userRaw = localStorage.getItem("usuario");
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        if (user && user.permisos === "SUPERADMINISTRADOR") {
          setIsSuperadmin(true);
        } else {
          setIsSuperadmin(false);
        }
      } catch (e) {
        setIsSuperadmin(false);
      }
    }
  }, []);

  const handleDelete = (action) => {
    setTitle(action);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setTitle("");
  };

  const handleConfirm = () => {
    setShowModal(false);
    // Lógica adicional de confirmación, si es necesario
  };

  // Definir la función onClickEvent
  const onClickEvent = (id_programa) => {
    console.log("Programa seleccionado:", id_programa);
    // Lógica adicional para manejar el evento onClick
  };

  return (
    <>
      {/* Barra superior personalizada */}
      <div className="flex justify-end items-center p-4 bg-white">
        {/* Aquí va el botón de agregar usuario solo para superadmin */}
        {isSuperadmin && (
          <Link href="/administrador/usuarios">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold transition">
              Agregar Usuario
            </button>
          </Link>
        )}
      </div>

      <Modal
        show={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={`Confirmar ${title}`}
        message={`¿Estás seguro de que deseas dar de ${title} a este alumno?`}
      />
      {view === 'Table' && (
        <div>
          <button onClick={() => setView('AddUser')} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Agregar Clase
          </button>
          <AllClasesPrueba 
            onClickEvent={onClickEvent} 
            title={title} 
            setView={setView} 
            setSelectedUser={setSelectedUser} 
            handleDelete={handleDelete} 
          />
        </div>
      )}
      {view === 'AddUser' && (
        <AddProgramas setView={setView} />
      )}
      {view === 'EditUser' && (
        <EditProgramas setView={setView} selectedUser={selectedUser} />
      )}
    </>
  );
}

// Asigna el layout de administrador al componente Programas2
Programas2.layout = Admin;
