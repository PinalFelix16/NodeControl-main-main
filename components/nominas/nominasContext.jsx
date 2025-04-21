import React, { createContext, useContext, useState, useEffect } from "react";
import NominasService from "../../services/api/nomina";
import Swal from "sweetalert2";

const NominasContext = createContext();

export const NominasProvider = ({ children }) => {
  const [nominas, setNominas] = useState([]);
  const [years, setYears] = useState([]);
  const [year, setYear] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    refresh();
    getYears();
    getUsers();
  }, []);

  useEffect(() => {
    if (year) {
      getByYear(year);
    } else {
      refresh();
    }
  }, [year]);

  async function refresh() {
    const nominasService = new NominasService();
    const data = await nominasService.getAll();
    setNominas(data.data);
  }

  async function getUsers() {
    const nominasService = new NominasService();
    const data = await nominasService.getUsers();
    setUsers(data);
  }

  async function createNomina(data) {
    await new NominasService().create(data);
    refresh();
  }

  async function editNomina(id, data) {
    await new NominasService().edit(id, data);
    refresh();
  }

  async function deleteNomina(id) {
    await new NominasService().delete(id);
    refresh();
  }

  async function getYears() {
    const nominasService = new NominasService();
    const data = await nominasService.getYears();
    setYears(data.map((y) => y.anio));
  }

  async function getByYear(year) {
    const nominasService = new NominasService();
    const data = await nominasService.getByYear(year);
    setNominas(data.data);
  }

  async function getInforme(id) {
    const res = await new NominasService().getInforme(id);
    return res;
  }

  async function generarNomina(id) {
    const res = await new NominasService().generarNomina(id);

    if (!res.id_nomina) {
      Swal.fire({
        title: "Error",
        text: res.message,
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "Nómina generada",
        text: res.message,
        icon: "success",
      });
    }
    refresh();
  }

  return (
    <NominasContext.Provider
      value={{
        nominas,
        users,
        years,
        year,
        refresh,
        setYear,
        createNomina,
        editNomina,
        deleteNomina,
        getInforme,
        generarNomina,
      }}
    >
      {children}
    </NominasContext.Provider>
  );
};

export const useNominas = () => {
  const context = useContext(NominasContext);
  if (!context) {
    throw new Error("useNominas must be used within a NominasProvider");
  }
  return context;
};
