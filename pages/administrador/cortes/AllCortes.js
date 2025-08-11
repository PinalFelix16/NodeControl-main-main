import React, { useEffect, useState } from "react";
import CortesTable from "components/Cortes/CortesTable";
import Modal from "components/Alumnos/modals/AddUserModal";
import { realizarCorte, miscelanea } from "services/api/cortes";

export default function AllCortes({ cortes, loading, reloadCortes }) {
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [typeS, setTypeS] = useState(0);
  const [userId, setUserId] = useState("");
  const [clientReady, setClientReady] = useState(false); // <-- CORRECCIÓN

  useEffect(() => {
    setClientReady(true);
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("usuario");
      if (raw) {
        try {
          const user = JSON.parse(raw);
          setUserId(user.id || "");
        } catch (e) {
          setUserId("");
        }
      }
    }
  }, []);

  // --- Estado local de la tabla, así la podemos limpiar después de un corte
  const [localCortes, setLocalCortes] = useState(cortes);

  // --- Cuando recibimos nuevos cortes desde props, sincronizamos el local
  useEffect(() => {
    setLocalCortes(cortes);
  }, [cortes]);

  // --- Agregar miscelánea ---
  const handleAddMisc = async () => {
    await miscelanea({
      descripcion: concepto,
      monto: monto,
      corte: 0
    });
    setConcepto("");
    setMonto("");
    await reloadCortes();
  };

  const handleHacerCorte = () => {
    setModalTitle("hacer corte");
    setShowModal(true);
    setTypeS(2);
  };

  const handleConfirm = async () => {
    setShowModal(false);
    if (typeS === 2) {
      const totalSinComa = typeof (localCortes?.total) === "string"
        ? parseFloat(localCortes.total.replace(/,/g, "")) || 0
        : localCortes?.total || 0;

      await realizarCorte({
        total: totalSinComa,
        id_autor: userId
      });

      // --- LIMPIA LA TABLA LOCAL ---
      setLocalCortes({
        programaData: [],
        secundarioData: [],
        miscelanioData: [],
        total: "",
      });

      await reloadCortes(); // Por si quieres recargar de backend
    }
  };

  // --- SOLO RENDERIZA EN CLIENTE ---
  if (!clientReady) return null;

  if (loading || !localCortes) return <div className="text-center py-10">Cargando cortes...</div>;

  return (
    <>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title={`Confirmar ${modalTitle}`}
        message={`¿Estás seguro de que deseas ${modalTitle}?`}
      />
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CortesTable
            color="dark"
            handleHacerCorte={handleHacerCorte}
            handleAddMisc={handleAddMisc}
            setConcepto={setConcepto}
            setMonto={setMonto}
            monto={monto}
            concepto={concepto}
            cortes={localCortes}
          />
        </div>
      </div>
    </>
  );
}
