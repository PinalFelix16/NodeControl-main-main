"use client";
import Button from "components/button";
import { useNominas } from "./nominasContext";
import Select from "components/select";

export default function Toolbar({ setView }) {
  const { years, setYear, year } = useNominas();

  return (
    <div className="flex" style={{ gap: "1rem" }}>
      <Button onClick={() => setView({}, "Crear nómina")}>Crear nómina</Button>
      <Button onClick={() => setView({}, "Generar nómina")}>
        Generar nómina
      </Button>
      <div className="flex justify-end items-center">
        <label className="whitespace-nowrap mr-4">Filtrar por año</label>
        <Select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Todos</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
