import React from "react";

export default function AlumnoCard({
  name,
  id,
  bDate,
  studentPhone,
  phone1,
  phone2,
  parent1,
  parent2,
  status,
  medical,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h4 className="text-xl font-bold mb-4">Información del alumno</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-blueGray-400">Nombre</p>
          <p className="font-semibold">{name || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-blueGray-400">ID</p>
          <p className="font-semibold">{id ?? "-"}</p>
        </div>

        <div>
          <p className="text-sm text-blueGray-400">Fecha de Nacimiento</p>
          <p className="font-semibold">{bDate || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-blueGray-400">Estatus</p>
          <p className="font-semibold">{status ?? "-"}</p>
        </div>

        <div>
          <p className="text-sm text-blueGray-400">Celular del alumno</p>
          <p className="font-semibold">{studentPhone || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-blueGray-400">Teléfono 1</p>
          <p className="font-semibold">{phone1 || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-blueGray-400">Teléfono 2</p>
          <p className="font-semibold">{phone2 || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-blueGray-400">Tutor 1</p>
          <p className="font-semibold">{parent1 || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-blueGray-400">Tutor 2</p>
          <p className="font-semibold">{parent2 || "-"}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-blueGray-400">Historial médico / Observaciones</p>
        <p className="font-semibold whitespace-pre-line">
          {medical || "—"}
        </p>
      </div>
    </div>
  );
}
