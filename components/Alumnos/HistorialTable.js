// components/Alumnos/HistorialTable.js
import React from "react";
import PropTypes from "prop-types";

export default function HistorialTable({ color = "light", pagos = [] }) {
  const money = (v) => {
    const n = Number(String(v ?? 0).toString().replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? `$${n.toFixed(2)}` : (v ?? "");
  };

  const BAD_LABEL = /^(INSCRIPCION|INSCRIPCIÓN|RECARGO|MENSUALIDAD)$/i;

  // --- PROGRAMA: solo nombre de clase (Natación, etc.)
  const programName = (r) => {
    const pick = (s) => {
      const v = (s ?? "").toString().trim();
      return v && !BAD_LABEL.test(v) ? v : "";
    };

    // 1) campos explícitos de programa
    const base =
      pick(r?.programa) ||
      pick(r?.nombre_programa) ||
      pick(r?.programa_nombre);
    if (base) return base;

    // 2) respaldo: extraer de periodo/referencia después del separador
    const bruto = String(r?.periodo ?? r?.referencia ?? "");
    if (bruto) {
      const partes = bruto.split(/[\|\uFF5C]/); // '|' ASCII o '｜' full-width
      if (partes.length > 1) {
        const candidato = pick(partes[partes.length - 1]);
        if (candidato) return candidato;
      }
    }
    return "—";
  };

  // --- PERIODO: mostrar SOLO "MES/AÑO"
  const periodOnly = (r) => {
    const bruto = String(r?.periodo ?? r?.referencia ?? "");
    if (!bruto) return "";
    // Tomamos la parte ANTES del separador '|' o '｜'
    const soloPeriodo = bruto.split(/[\|\uFF5C]/)[0].trim();
    // Limpieza defensiva: si por error vienen etiquetas pegadas, quítalas
    return soloPeriodo
      .replace(/\b(INSCRIPCION|INSCRIPCIÓN|RECARGO|MENSUALIDAD)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

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
                    {periodOnly(row)}
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
