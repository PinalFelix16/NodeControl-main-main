import React, { useEffect, useState } from "react";

// components


// layout for page

import Admin from "layouts/Admin.js";

import CortesTable from "components/Cortes/CortesTable";
import { fetchCortes, miscelanea, realizarCorte } from "services/api/cortes";
import Modal from "components/Alumnos/modals/AddUserModal";
export default function AllCortes({setView, setSelectedUser}) {
  const [cortes, setCortes] = useState([]);
  const [status, setStatus] = useState(1);
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [fetchedCortes, setFetchedCortes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const [typeS, setTypeS] = useState(0);

 
  const [title, setTitle] = useState("");

  const handleAddMisc = async () => {
    const data = await miscelanea({nombre: concepto, monto: monto});
    if (data?.message != null) {
        alert(data.message);
    }else alert("Ocurrio un error");
    setConcepto("");
    setMonto("");
    
    getCortes(); 
  }

   
  const handleDelete = (action) => {
    setTitle(action); 
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setTitle("");
  };


  async function getCortes() {
    const data = await fetchCortes();
    setCortes(data);
    setFetchedCortes(data);
    console.log(data);
  }
 
  useEffect(() => {
  

    getCortes();
  }, [status, title]);

  const handleHacerCorte = async () => {
    setTitle('hacer corte'); 
    setShowModal(true);
    setTypeS(2);
    
  }

  

  const handleConfirm = async () => {
    setShowModal(false);
    if(typeS === 2) {
      const totalSinComa = parseFloat(cortes.total.replace(/,/g, ''));
      const result = await realizarCorte({
          'total': totalSinComa,
          'id_autor': 'aaa'
      });

      if (result.message != null ) alert(result.message);
      else alert("Algo salio mal al hacer el corte.");


    }

    getCortes();

  
  };



  return (
    <>
    <Modal
        show={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={`Confirmar ${title}`}
        message={`¿Estás seguro de que deseas  ${title}?`}
      />
      <div className="flex flex-wrap mt-4">
     
        <div className="w-full mb-12 px-4"> 
          <CortesTable color="dark" handleHacerCorte={handleHacerCorte} handleAddMisc={handleAddMisc}  setConcepto={setConcepto} setMonto={setMonto} monto={monto} concepto={concepto} cortes={cortes} handleDelete={handleDelete} status={status} setStatus={setStatus} setView={setView} setSelectedUser={setSelectedUser}/>
        </div>
      </div>
    </>
  )
}

AllCortes.layout = Admin; 
