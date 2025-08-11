"use client";

import { useMemo, useState } from "react";
import Button from "components/button";
import Input from "components/Input";
import Select from "components/select";

// Cambia esto si ya tienes un helper de baseURL
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api";

function toISODate(d) {
  // yyyy-mm-dd
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}
function mondayOf(d) {
  const date = new Date(d);
  const day = date.getDay(); // 0=dom,1=lun
  const diff = (day === 0 ? -6 : 1) - day; // llevar a lunes
  date.setDate(date.getDate() + diff);
  return date;
}
function sundayOf(d) {
  const mon = mondayOf(d);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return sun;
}

export default function CortesReportButtons({ className = "" }) {
  // Semanal: defaults a semana actual
  const today = useMemo(() => new Date(), []);
  const [from, setFrom] = useState(toISODate(mondayOf(today)));
  const [to, setTo] = useState(toISODate(sundayOf(today)));

  // Mensual / anual
  const [year, setYear] = useState(String(today.getFullYear()));
  const [month, setMonth] = useState(String(today.getMonth() + 1)); // 1..12

  // Detalle
  const [corteId, setCorteId] = useState("");

  // Modo: ver (stream) o descargar
  const [download, setDownload] = useState(false);

  const open = (url) => window.open(url, "_blank", "noopener,noreferrer");

  const openSemanal = () => {
    if (!from || !to) return alert("Selecciona el rango de fechas (from/to).");
    const url = `${API_BASE}/reportes/cortes/por-semana?from=${from}&to=${to}${
      download ? "&dl=1" : ""
    }`;
    open(url);
  };

  const openMensual = () => {
    if (!year || !month) return alert("Selecciona año y mes.");
    const url = `${API_BASE}/reportes/cortes/historico/${year}/${month}${
      download ? "?dl=1" : ""
    }`;
    open(url);
  };

  const openAnual = () => {
    if (!year) return alert("Selecciona el año.");
    const url = `${API_BASE}/reportes/cortes/historico/${year}${
      download ? "?dl=1" : ""
    }`;
    open(url);
  };

  const openDetalle = () => {
    if (!corteId) return alert("Ingresa el ID del corte.");
    const url = `${API_BASE}/reportes/cortes/${corteId}${
      download ? "?dl=1" : ""
    }`;
    open(url);
  };

  return (
     <div className={`w-full mb-3 p-4 rounded-lg ${className || "border border-gray-200 bg-white"}`}>
      {/* Toggle Ver/Descargar */}
      <div className="flex items-center gap-3">
        <label className="text-sm">Modo:</label>
        <Select
          value={download ? "dl" : "view"}
          onChange={(e) => setDownload(e.target.value === "dl")}
        >
          <option value="view">Ver en el navegador</option>
          <option value="dl">Descargar PDF</option>
        </Select>
      </div>

      {/* Semanal */}
      <div className="rounded-lg border p-4 flex flex-col gap-3">
        <div className="font-semibold">Reporte semanal (PDF)</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="Desde"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Input
            label="Hasta"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <div className="flex items-end">
            <Button color="dark" onClick={openSemanal} className="w-full">
              Abrir semanal
            </Button>
          </div>
        </div>
      </div>

      {/* Mensual */}
      <div className="rounded-lg border p-4 flex flex-col gap-3">
        <div className="font-semibold">Reporte mensual (PDF)</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="Año"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <Select
            label="Mes"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="6">Junio</option>
            <option value="7">Julio</option>
            <option value="8">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </Select>
          <div className="flex items-end">
            <Button color="dark" onClick={openMensual} className="w-full">
              Abrir mensual
            </Button>
          </div>
        </div>
      </div>

      {/* Anual */}
      <div className="rounded-lg border p-4 flex flex-col gap-3">
        <div className="font-semibold">Reporte anual (PDF)</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="Año"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <div className="md:col-span-2 flex items-end">
            <Button color="dark" onClick={openAnual} className="w-full md:w-auto">
              Abrir anual
            </Button>
          </div>
        </div>
      </div>

      {/* Detalle por ID */}
      <div className="rounded-lg border p-4 flex flex-col gap-3">
        <div className="font-semibold">Detalle de corte (PDF)</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="ID del corte"
            type="number"
            min="1"
            value={corteId}
            onChange={(e) => setCorteId(e.target.value)}
          />
          <div className="md:col-span-2 flex items-end">
            <Button color="dark" onClick={openDetalle} className="w-full md:w-auto">
              Abrir detalle
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
