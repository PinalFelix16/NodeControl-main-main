// pages/administrador/maestros/AllMaestros.js
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import MaestrosTable from "components/Maestros/MaestrosTable";
import { fetchMaestros } from "services/api/maestros";
// 👇 usamos las clases tal como ya existen (NO tocamos nada de CRUD)
import { fetchClasesRaw } from "services/api/clases";

const AllMaestros = forwardRef(function AllMaestros(
  { setView, setSelectedUser, handleDelete, title },
  ref
) {
  const [maestros, setMaestros] = useState([]);
  const [status, setStatus] = useState(1); // por si en un futuro filtras activos/inactivos
  const [searchText, setSearchText] = useState("");
  const [baseData, setBaseData] = useState([]);

  async function getMaestros() {
    // evita recargar mientras hay modal abierto
    if (title) return;

    // 1) Traemos maestros y clases activas en paralelo
    const [ms, clases] = await Promise.all([
      fetchMaestros(status).catch(() => []),
      fetchClasesRaw().catch(() => []), // ya trae ?status=1
    ]);

    // 2) Mapas por maestro
    const countByMaestro = {};
    const listByMaestro = {};

    (Array.isArray(clases) ? clases : []).forEach((c) => {
      const key = String(c?.id_maestro ?? c?.maestro_id ?? "");
      if (!key) return;
      countByMaestro[key] = (countByMaestro[key] || 0) + 1;

      const nombreClase = c?.nombre ?? c?.nombre_clase ?? "";
      if (nombreClase) {
        (listByMaestro[key] ||= []).push(nombreClase);
      }
    });

    // 3) Enriquecemos los maestros con clasesCount y clases (nombres)
    const merged = (Array.isArray(ms) ? ms : []).map((m) => {
      const id = String(m?.id_maestro ?? m?.id ?? "");
      return {
        ...m,
        clasesCount: countByMaestro[id] || 0,
        clases: listByMaestro[id] || [],
      };
    });

    setBaseData(merged);
    applyFilter(merged, searchText);
  }

  // Filtro por nombre o id
  function applyFilter(data, term) {
    const t = (term || "").toLowerCase();
    if (!t) {
      setMaestros(data);
      return;
    }
    const filtered = data.filter((m) => {
      const nombre = String(m?.nombre_maestro ?? m?.nombre ?? "").toLowerCase();
      const id = String(m?.id_maestro ?? m?.id ?? "").toLowerCase();
      return nombre.includes(t) || id.includes(t);
    });
    setMaestros(filtered);
  }

  // Cargar al entrar y cuando cambie status o cierre modal
  useEffect(() => {
    getMaestros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, title]);

  // Reaplicar filtro al escribir
  useEffect(() => {
    applyFilter(baseData, searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, baseData]);

  // Exponer método para que el padre pueda refrescar
  useImperativeHandle(ref, () => ({
    reloadData: getMaestros,
  }));

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <MaestrosTable
          color="dark"
          maestros={maestros}
          status={status}
          setStatus={setStatus}
          setView={setView}
          setSelectedUser={setSelectedUser}
          handleDelete={handleDelete}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </div>
    </div>
  );
});

export default AllMaestros;
