// components/Clases/ClasesCard.jsx
import React from "react";
import PropTypes from "prop-types";

export default function ClasesCard({
  statSubtitle,   // nombre del programa
  statPercent,    // mensualidad del programa
  statSchedule,   // array de clases
  onEdit,         // recibe id_clase
  onDelete,       // recibe id_clase
}) {
  // Solo clases válidas con id_clase (clave estable)
  const clases = Array.isArray(statSchedule)
    ? statSchedule.filter((c) => c && c.id_clase != null)
    : [];

  // Formato MXN bonito
  const precio = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(Number(statPercent || 0));

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 className="text-blueGray-400 uppercase font-bold text-xs">
              {statSubtitle}
            </h5>

            {clases.map((item) => (
              <div
                key={String(item.id_clase)}  // ← clave 100% estable
                className="flex items-center justify-between gap-3 py-1"
              >
                <div className="text-blueGray-700">
                  <span className="font-semibold">{item?.nombre}</span>
                  {`: ${item?.informacion ?? ""}`}
                  {item?.nombre_maestro ? ` / ${item.nombre_maestro}` : ""}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(item.id_clase);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded shadow"
                  >
                    Editar Clase
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(item.id_clase);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded shadow"
                  >
                    Borrar Clase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-lg float-right text-blueGray-400 mt-4">
          <span className="text-emerald-500 mr-2">{precio}</span>
        </p>
      </div>
    </div>
  );
}

ClasesCard.defaultProps = { statSchedule: [] };
ClasesCard.propTypes = {
  statSubtitle: PropTypes.string,
  statPercent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  statSchedule: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
