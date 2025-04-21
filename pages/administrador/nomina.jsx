"use client";
import Modal from "components/modal";
import HeadCell from "components/table/headCell";
import Table from "components/table/table";
import TBody from "components/table/Tbody";
import Thead from "components/table/Thead";
import TRow from "components/table/Trow";
import Admin from "layouts/Admin";
import { useState } from "react";
import ViewHandler from "components/nominas/ViewHandler";
import Toolbar from "components/nominas/toolbar";
import EyeIcon from "components/nominas/eyeIcon";
import BookIcon from "components/nominas/bookIcon";
import Editicon from "components/nominas/editIcon";
import DeleteIcon from "components/nominas/deleteIcon";
import { NominasProvider, useNominas } from "components/nominas/nominasContext";

function Nomina() {
  const { nominas, refresh } = useNominas();
  const [show, setShow] = useState(false);
  const [nomina, setNomina] = useState({});
  const [view, setView] = useState("");

  const handleOpenModal = (id, view) => {
    setNomina(id);
    setView(view);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    refresh();
  };

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
                key={n.fecha + "_" + i}
                cells={[
                  n.id_nomina,
                  n.fecha,
                  n.autor,
                  n.total_neto,
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-sm ml-3 border-white border"
                      onClick={() => handleOpenModal(n, "Ver nómina")}
                    >
                      <EyeIcon />
                    </button>
                    <button
                      className="p-2 rounded-sm ml-3 border-white border"
                      onClick={() => handleOpenModal(n, "Información general")}
                    >
                      <BookIcon />
                    </button>
                    <button
                      className="p-2 rounded-sm ml-3 border-white border"
                      onClick={() => handleOpenModal(n, "Editar nómina")}
                    >
                      <Editicon />
                    </button>
                    <button
                      className="p-2 rounded-sm ml-3 border-white border"
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
  return (
    <NominasProvider>
      <Nomina />
    </NominasProvider>
  );
}

NominaWrapper.layout = Admin;
