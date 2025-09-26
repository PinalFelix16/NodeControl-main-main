// components/Alumnos/HistorialTable.js
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  normalizePagos,
  esPagoReal,
  amountFromPago,
  formatCurrency,
  alumnoIdFrom,
  alumnoNombreFrom,
  pagoDedupKey,
} from "../utils/pagosUI";

export default function HistorialTable({
  color,
  handlePayment,
  total,
  pagos,
  alumnoId,        // NUEVO: filtra por id de alumno
  alumnoNombre,    // Opcional: si no tienes id, filtra por nombre
}) {
  // 1) Filtra SOLO pagos del alumno indicado
  const pagosDelAlumno = useMemo(() => {
    const src = Array.isArray(pagos) ? pagos : [];
    if (alumnoId != null && alumnoId !== "") {
      const idStr = String(alumnoId);
      return src.filter((p) => String(alumnoIdFrom(p)) === idStr);
    }
    if (alumnoNombre) {
      const needle = String(alumnoNombre).toLowerCase();
      return src.filter((p) =>
        String(alumnoNombreFrom(p) ?? "").toLowerCase().includes(needle)
      );
    }
    // Si no pasan id ni nombre, no filtramos (pero no es lo ideal)
    return src;
  }, [pagos, alumnoId, alumnoNombre]);

  // 2) Anti-duplicados + solo pagos reales
  const pagosFiltrados = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const p of pagosDelAlumno) {
      if (!esPagoReal(p)) continue;
      const key = pagoDedupKey(p);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(p);
    }
    return out;
  }, [pagosDelAlumno]);

  // 3) Normaliza para mostrar
  const pagosUI = useMemo(() => normalizePagos(pagosFiltrados), [pagosFiltrados]);

  // 4) Total (si no viene listo)
  const totalCalculado = useMemo(() => {
    if (typeof total === "number") return total;
    return pagosFiltrados.reduce((acc, p) => acc + amountFromPago(p), 0);
  }, [pagosFiltrados, total]);

  const totalUI = formatCurrency(total ?? totalCalculado);

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded my-4 " +
        (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
      }
    >
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3
              className={
                "font-semibold text-lg " +
                (color === "light" ? "text-blueGray-700" : "text-white")
              }
            >
              {/* Historial de pagos */}
            </h3>
          </div>
        </div>
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              {["Recibo", "Fecha", "Programa", "Periodo", "Concepto", "Importe"].map((th) => (
                <th
                  key={th}
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color !== "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pagosUI.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-xs text-blueGray-400 italic">
                  Sin pagos registrados.
                </td>
              </tr>
            ) : (
              pagosUI.map((pago, idx) => (
                <tr key={pago.recibo || `${pago.fecha}-${idx}`}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {pago.recibo}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {pago.fecha}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {pago.programa}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {pago.periodo}
                  </td>
                  <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {pago.concepto}
                  </td>
                  <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {pago.importe}
                  </td>
                </tr>
              ))
            )}

            {/* Total */}
            <tr>
              <td colSpan={5} className="px-6 py-3 text-right text-xs font-semibold">
                Total
              </td>
              <td className="px-2 py-3 text-xs font-semibold">{totalUI}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

HistorialTable.defaultProps = {
  color: "light",
};

HistorialTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  pagos: PropTypes.array,
  total: PropTypes.number,
  handlePayment: PropTypes.func,
  alumnoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),   // <-- nuevo
  alumnoNombre: PropTypes.string,                                         // <-- opcional
};

