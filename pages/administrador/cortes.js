import React, { useState } from "react";

// layout for page

import Admin from "layouts/Admin.js";


// import Modal from "components/Cortes/modals/AddUserModal";
// import AllCortes from "./cortes/AllCortes";
import AllCortes from "./cortes/AllCortes";
export default function Cortes() {

  const [view, setView] = useState('Table'); //Table, AddUser, EditUser, ShowUser
  const [selectedUser, setSelectedUser] = useState(null);

  

  const handleBajaCorte = async (id) => {
    const response = null;// await bajaCorte(id);

    if (response.message != null) {
        alert(response.message);
    } else {
        alert(response.error);
    }
};



  return <>
   
  { view === "Table" ? (<AllCortes setView={setView} setSelectedUser={setSelectedUser} ></AllCortes>)
    : null}
    </>
}

Cortes.layout = Admin; 
