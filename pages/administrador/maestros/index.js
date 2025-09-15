// pages/administrador/maestros/index.js
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Admin from "layouts/Admin.js";
import Modal from "components/Alumnos/modals/AddUserModal";
import AllMaestros from "./AllMaestros";
import AddMaestros from "./AddMaestros";
import EditMaestro from "./EditMaestro";
import { updateMaestro, deleteMaestro } from "services/api/maestros";

export default function Maestros() {
  const [view, setView] = useState("Table"); // Table, AddUser, EditUser
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const router = useRouter();
  const allMaestrosRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.replace("/auth/login");
    }
  }, [router]);

  const handleDelete = (action) => {
    if (!selectedUser) return alert("Selecciona un maestro primero.");
    setTitle(action); // 'Baja' | 'Alta' | 'Eliminar'
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setTitle("");
  };

  const handleConfirm = async () => {
    setShowModal(false);
    try {
      if (title === "Baja") {
        await handleBaja(selectedUser);
      } else if (title === "Alta") {
        await handleAlta(selectedUser);
      } else if (title === "Eliminar") {
        await handleEliminar(selectedUser);
      }
    } finally {
      setTitle("");
    }
  };

  // --- BAJA ---
  const handleBaja = async (id) => {
    try {
      const res = await updateMaestro({ status: 0 }, id);
      if (res?.error) throw new Error(res.error);
      alert("Maestro dado de baja.");
      allMaestrosRef.current?.reloadData?.();
    } catch (err) {
      console.error(err);
      alert("Error al dar de baja.");
    }
  };

  // --- ALTA ---
  const handleAlta = async (id) => {
    try {
      const res = await updateMaestro({ status: 1 }, id);
      if (res?.error) throw new Error(res.error);
      alert("Maestro dado de alta.");
      allMaestrosRef.current?.reloadData?.();
    } catch (err) {
      console.error(err);
      alert("Error al dar de alta.");
    }
  };

  // --- ELIMINAR ---
  const handleEliminar = async (id) => {
    try {
      await deleteMaestro(id);
      alert("Maestro eliminado.");
      allMaestrosRef.current?.reloadData?.();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar maestro.");
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={`Confirmar ${title}`}
        message={
          title === "Eliminar"
            ? "¿Estás seguro de eliminar a este maestro?"
            : `¿Estás seguro de que deseas dar de ${title} a este maestro?`
        }
      />

      {view === "Table" && (
        <div>
          <button
            onClick={() => setView("AddUser")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-4"
          >
            Agregar Maestro
          </button>

          <AllMaestros
            ref={allMaestrosRef}
            title={title}
            setView={setView}
            setSelectedUser={setSelectedUser}
            handleDelete={handleDelete}
          />
        </div>
      )}

      {view === "AddUser" && <AddMaestros setView={setView} />}
      {view === "EditUser" && (
        <EditMaestro setView={setView} selectedUser={selectedUser} />
      )}
    </>
  );
}

Maestros.layout = Admin;
