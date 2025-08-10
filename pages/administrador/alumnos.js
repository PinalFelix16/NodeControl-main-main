import React, { useState } from "react";
import Admin from "layouts/Admin.js";

import { bajaAlumno, altaAlumno } from "services/api/alumnos";
import AllAlumnos from "./AllAlumnos";
import AddAlumnos from "./AddAlumno";
import Modal from "components/Alumnos/modals/AddUserModal";
import ShowAlumno from "./ShowAlumno";
import EditAlumno from "./EditAlumno";

export default function Alumnos() {
  const [view, setView] = useState("Table"); // Table, AddUser, EditUser, ShowUser
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  const handleDelete = (action) => {
    if (!selectedUser) return alert("Selecciona un alumno primero.");
    setTitle(action);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setTitle("");
  };

  const handleConfirm = () => {
    setShowModal(false);
    if (title === "Baja") {
      handleBajaAlumno(selectedUser);
    } else if (title === "Alta") {
      handleAltaAlumno(selectedUser);
    }
    setTitle("");
  };

  const handleBajaAlumno = async (id) => {
    try {
      const response = await bajaAlumno(id);
      alert(response.message || response.error || "Operación completada.");
    } catch (err) {
      console.error(err);
      alert("Error al dar de baja al alumno.");
    }
  };

  const handleAltaAlumno = async (id) => {
    try {
      const response = await altaAlumno(id);
      alert(response.message || response.error || "Operación completada.");
    } catch (err) {
      console.error(err);
      alert("Error al dar de alta al alumno.");
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={`Confirmar ${title}`}
        message={`¿Estás seguro de que deseas dar de ${title} a este alumno?`}
      />

      {view === "Table" && (
        <AllAlumnos
          title={title}
          setView={setView}
          setSelectedUser={setSelectedUser}
          handleDelete={handleDelete}
        />
      )}

      {view === "AddUser" && <AddAlumnos setView={setView} />}

      {view === "EditUser" && (
        <EditAlumno setView={setView} selectedUser={selectedUser} />
      )}

      {view === "ShowUser" && (
        <ShowAlumno selectedUser={selectedUser} setView={setView} />
      )}
    </>
  );
}

Alumnos.layout = Admin;
