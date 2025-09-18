// <-- PROTOCOLO ROJO: ARCHIVO LIMPIADO. Se eliminó el bloque duplicado que tenía el import de ViewHandler comentado y redefinía Nomina/NominaWrapper.

"use client";
import Modal from "components/modal";
import HeadCell from "components/table/headCell";
import Table from "components/table/table";
import TBody from "components/table/Tbody";
import Thead from "components/table/Thead";
import TRow from "components/table/Trow";
import Admin from "layouts/Admin";
import { useEffect, useState } from "react"; // <-- añadido useEffect
import ViewHandler from "components/nominas/ViewHandler"; // <-- PROTOCOLO ROJO: IMPORT CORRECTO Y ÚNICO
import Toolbar from "components/nominas/toolbar";
import EyeIcon from "components/nominas/eyeIcon";
import BookIcon from "components/nominas/bookIcon";
import Editicon from "components/nominas/editIcon";
import DeleteIcon from "components/nominas/deleteIcon";
import { NominasProvider, useNominas } from "components/nominas/nominasContext";

/** Mismo aviso que usas en "Consultas" para usuarios sin permiso */
function NoAccessBox() {
  return (
    <div className="w-full flex justify-center py-16">
      <div className="bg-white max-w-xl w-full rounded shadow p-6 text-center">
        <p className="text-red-600 font-semibold mb-2">
          No tienes permisos para acceder a esta sección.
        </p>
        <p className="text-sm text-red-500">
          Si cree que esto es un error, contacte al administrador.
        </p>
      </div>
    </div>
  );
}



function Nomina() {
  const { nominas, refresh } = useNominas();
  const [show, setShow] = useState(false);
  const [nomina, setNomina] = useState({});
  const [view, setView] = useState("");

  // Base de API (usa NEXT_PUBLIC_API o localhost:8000/api por defecto)
  const API = process.env.NEXT_PUBLIC_API || "http://localhost:8000/api";

  const handleOpenModal = (row, viewName) => {
    setNomina(row);
    setView(viewName);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    refresh();
  };

  // Botones extra
  const abrirImprimible = (id) =>
    window.open(`${API}/nominas/${id}/informe/print`, "_blank");

  const descargarPdf = (id) =>
    window.open(`${API}/nominas/${id}/informe/pdf`, "_blank");

  return (
    <div className="relative flex flex-col z-10">
      <Table
        title="Nóminas"
        color="dark"
        Toolbar={() => <Toolbar setView={handleOpenModal} />}
      >
        <Thead>
          <HeadCell>ID</HeadCell>
          <HeadCell>Fecha</HeadCell>
          <HeadCell>Autor</HeadCell>
          <HeadCell>Total Neto</HeadCell>
          <HeadCell>Acciones</HeadCell>
        </Thead>
        <TBody>
          {(nominas.message && <TRow>{nominas.message}</TRow>) ||
            nominas.map((n, i) => (
              <TRow
                key={n.id_nomina ?? `${n.fecha}_${i}`}
                cells={[
                  n.id_nomina,
                  n.formated_fecha || n.fecha,
                  n.autor,
                  n.total_neto,
                  <div className="flex gap-2" key={`acciones_${n.id_nomina}`}>
                    {/* Ver nómina (detalle simple) */}
                    <button
                      className="p-2 rounded-sm ml-3 border-white border"
                      title="Ver nómina"
                      onClick={() => handleOpenModal(n, "Ver nómina")}
                    >
                      <EyeIcon />
                    </button>

                    {/* Información general (informe detallado en modal) */}
                    <button
                      className="p-2 rounded-sm ml-3 border-white border"
                      title="Información general"
                      onClick={() => handleOpenModal(n, "Información general")}
                    >
                      <BookIcon />
                    </button>

                    {/* Imprimir (vista Blade) */}
                    <button
                      className="p-2 rounded-sm ml-3 border-white border"
                      title="Imprimir informe"
                      onClick={() => abrirImprimible(n.id_nomina)}
                    >
                      🖨️
                    </button>

                    {/* Descargar PDF */}
                    <button
                      className="p-2 rounded-sm ml-3 border-white border"
                      title="Descargar PDF"
                      onClick={() => descargarPdf(n.id_nomina)}
                    >
                      📄
                    </button>

                    {/* Editar */}
                    <button
                      className="p-2 rounded-sm ml-3 border-white border"
                      title="Editar nómina"
                      onClick={() => handleOpenModal(n, "Editar nómina")}
                    >
                      <Editicon />
                    </button>

                    {/* Eliminar */}
                    <button
                      className="p-2 rounded-sm ml-3 border-white border"
                      title="Eliminar nómina"
                      onClick={() => handleOpenModal(n, "Eliminar nómina")}
                    >
                      <DeleteIcon />
                    </button>
                  </div>,
                ]}
              />
            ))}
        </TBody>
      </Table>

      <Modal show={show} title={view} onClose={handleClose}>
        <ViewHandler view={view} nomina={nomina} handleClose={handleClose} />
      </Modal>
    </div>
  );
}

export default function NominaWrapper() {
  // ---- COMPuERTA DE PERMISOS (igual que Consultas) ----
  const [isClient, setIsClient] = useState(false);
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const raw = localStorage.getItem("usuario");
      const u = raw ? JSON.parse(raw) : null;
      setIsSuperadmin(u?.permisos === "SUPERADMINISTRADOR");
    } catch {
      setIsSuperadmin(false);
    }
  }, []);

  if (!isClient) return null;        // evita parpadeos de hidratación
  if (!isSuperadmin) return <NoAccessBox />; // sin permiso, mismo mensaje que Consultas

  // Con permiso, render normal (sin tocar tu lógica existente)
  return (
    <NominasProvider>
      <Nomina />
    </NominasProvider>
  );
}

NominaWrapper.layout = Admin;
