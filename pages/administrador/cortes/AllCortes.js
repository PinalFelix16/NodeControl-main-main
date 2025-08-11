// pages/administrador/cortes/AllCortes.js
import React, { useEffect, useState } from "react";
import CortesTable from "components/Cortes/CortesTable";
import Modal from "components/Alumnos/modals/AddUserModal";
import { realizarCorte, miscelanea } from "services/api/cortes";
import CortesReportButtons from "components/Cortes/CortesReportButtons"; // <<-- NUEVO

export default function AllCortes({ cortes, loading, reloadCortes }) {
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [typeS, setTypeS] = useState(0);
  const [userId, setUserId] = useState("");
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("usuario");
      if (raw) {
        try {
          const user = JSON.parse(raw);
          setUserId(user.id || "");
        } catch {
          setUserId("");
        }
      }
    }
  }, []);

  // Estado local para limpiar la tabla tras realizar corte
  const [localCortes, setLocalCortes] = useState(cortes);
  useEffect(() => {
    setLocalCortes(cortes);
  }, [cortes]);

  // Agregar miscelánea
const handleAddMisc = async () => {
  if (!concepto.trim()) {
    alert("Ingresa un concepto.");
    return;
  }
  if (!(+monto > 0)) {
    alert("Ingresa un monto mayor a 0.");
    return;
  }

  await miscelanea({
    nombre: concepto,
    monto: monto,
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

  // Confirmar "Realizar corte"
const handleConfirm = async () => {
  setShowModal(false);
  if (typeS !== 2) return;

  // total numérico (sin $ ni comas)
  const raw = String(localCortes?.total ?? 0).replace(/[,$]/g, "");
  const totalNumeric = Number(raw) || 0;
  if (totalNumeric <= 0) {
    alert("No se puede realizar el corte: total es 0.");
    return;
  }

  // id_autor debe ser string y máx 6 chars
  const idStr = String(userId || "1").slice(0, 6);

  try {
    const res = await realizarCorte({
      total: totalNumeric,
      id_autor: idStr,
    });

    if (!res?.id_corte) {
      // Backend devolvió error o validación
      console.warn("realizar-corte (error):", res);
      alert(res?.message || "No se pudo realizar el corte.");
      return;
    }

    // éxito → limpia y recarga
    setLocalCortes({
      programaData: [],
      secundarioData: [],
      miscelanioData: [],
      total: "",
    });
    await reloadCortes();
  } catch (e) {
    console.error(e);
    alert("Ocurrió un error al realizar el corte.");
  }
};


  // Solo render en cliente (por localStorage, window, etc.)
  if (!clientReady) return null;

  if (loading || !localCortes)
    return <div className="text-center py-10">Cargando cortes...</div>;

  return (
    <>
      {/* Modal confirmación */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title={`Confirmar ${modalTitle}`}
        message={`¿Estás seguro de que deseas ${modalTitle}?`}
      />

      {/* Tarjeta principal: Lista de cortes */}
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

      {/* Reportes PDF debajo de la tarjeta */}
      <div className="px-4 mt-6">
        <CortesReportButtons />
      </div>
    </>
  );
}
