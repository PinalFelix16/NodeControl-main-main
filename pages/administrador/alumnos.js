import React, { useState } from "react";

// layout for page

import Admin from "layouts/Admin.js";


import { bajaAlumno, altaAlumno } from "services/api/alumnos";
import AllAlumnos from "./AllAlumnos";
import AddAlumnos from "./AddAlumno";
import Modal from "components/Alumnos/modals/AddUserModal";
import ShowAlumno from "./ShowAlumno";
import EditAlumno from "./EditAlumno";
export default function Alumnos() {

  const [view, setView] = useState('Table'); //Table, AddUser, EditUser, ShowUser
  const [selectedUser, setSelectedUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
 
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
    title === "Baja" ? handleBajaAlumno(selectedUser) 
                     : handleAltaAlumno(selectedUser);
  
  };

  const handleBajaAlumno = async (id) => {
    const response = await bajaAlumno(id);
    console.log(response);

    if (response.message != null) {
        alert(response.message);
        setTitle("");
    } else {
        alert(response.error);
    }
};

const handleAltaAlumno = async (id) => {
    const response = await altaAlumno(id);
    console.log(response);

    if (response.message != null) {
        alert(response.message);
        setTitle("");
    } else {
        alert(response.error);
    }
};

  return <>
   <Modal
        show={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={`Confirmar ${title}`}
        message={`¿Estás seguro de que deseas dar de ${title} a este alumno?`}
      />
  { view === "Table" ? (<AllAlumnos title = {title} setView={setView} setSelectedUser={setSelectedUser} handleDelete={handleDelete}></AllAlumnos>)
    : view === "AddUser" ? (<AddAlumnos setView={setView}></AddAlumnos>) 
    : view === "EditUser" ? (<EditAlumno setView={setView} selectedUser={selectedUser}>Edit User</EditAlumno>) 
    : view === "ShowUser" ? (<ShowAlumno selectedUser={selectedUser} setView={setView}></ShowAlumno>) 
    : null}
    </>
}

Alumnos.layout = Admin; 
