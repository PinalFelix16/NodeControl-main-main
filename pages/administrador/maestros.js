import React, { useState } from "react";

// layout for page

import Admin from "layouts/Admin.js";


import { bajaMaestro } from "services/api/maestros";
// import Modal from "components/Maestros/modals/AddUserModal";
import AllMaestros from "./maestros/AllMaestros";
import AddMaestros from "./maestros/AddMaestros";
import EditMaestro from "./maestros/EditMaestro";
import Modal from "components/Alumnos/modals/AddUserModal";
export default function Maestros() {

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
    handleBajaMaestro(selectedUser) 
  
  };

  const handleBajaMaestro = async (id) => {
    const response = await bajaMaestro(id);

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
        message={`¿Estás seguro de que deseas dar de ${title} a este maestro?`}
      />
  { view === "Table" ? (<AllMaestros title = {title} setView={setView} setSelectedUser={setSelectedUser} handleDelete={handleDelete}></AllMaestros>)
    : view === "AddUser" ? (<AddMaestros setView={setView}></AddMaestros>) 
    : view === "EditUser" ? (<EditMaestro setView={setView} selectedUser={selectedUser}>Edit User</EditMaestro>) 
    : null}
    </>
}

Maestros.layout = Admin; 
