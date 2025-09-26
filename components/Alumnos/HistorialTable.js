// components/Alumnos/HistorialTable.js
import React from "react";
import PropTypes from "prop-types";

export default function HistorialTable({ color = "light", pagos = [] }) {
  const money = (v) => {
    const n = Number(String(v ?? 0).toString().replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? `$${n.toFixed(2)}` : (v ?? "");
  };

  const programName = (r) =>
    (r?.programa && String(r.programa).trim()) ||
    (r?.nombre_programa && String(r.nombre_programa).trim()) ||
    (r?.programa_nombre && String(r.programa_nombre).trim()) ||
    (r?.nombre && String(r.nombre).trim()) ||
    "—";

  const concept = (r) => String(r?.concepto ?? "").toUpperCase() || "—";

  const total = Array.isArray(pagos)
    ? pagos.reduce((acc, r) => {
        const n = Number(String(r?.importe ?? r?.monto ?? 0).toString().replace(/[^0-9.-]/g, ""));
        return acc + (Number.isFinite(n) ? n : 0);
      }, 0)
    : 0;

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded" +
        (color === "light" ? " bg-white" : " bg-blueGray-700 text-white")
      }
    >
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              {["Recibo", "Fecha", "Programa", "Periodo", "Concepto", "Importado"].map((h) => (
                <th
                  key={h}
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color !== "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(pagos) && pagos.length > 0 ? (
              pagos.map((row, idx) => (
                <tr key={`${row?.folio ?? row?.id ?? idx}-${idx}`}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {row?.folio ?? row?.id ?? idx + 1}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {row?.fecha ?? row?.fecha_pago ?? ""}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {programName(row)}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {row?.periodo ?? row?.referencia ?? ""}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {concept(row)}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {money(row?.importe ?? row?.monto)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4 text-sm" colSpan={6}>Sin registros.</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className="px-6 py-3 text-xs font-semibold" colSpan={5} style={{ textAlign: "right" }}>
                Total
              </td>
              <td className="px-6 py-3 text-xs font-semibold">{money(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

HistorialTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  pagos: PropTypes.array,
};
