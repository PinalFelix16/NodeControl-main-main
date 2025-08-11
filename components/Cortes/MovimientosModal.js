import React from "react";
import { Dialog } from "@headlessui/react";

export default function MovimientosModal({ open, onClose, movimientos, loading }) {
  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
        <div className="bg-white rounded-lg shadow-lg p-6 z-50 relative w-full max-w-lg">
          <Dialog.Title className="text-lg font-bold mb-3">Detalle de movimientos</Dialog.Title>
          <button
            className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
            onClick={onClose}
          >
            ×
          </button>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando detalles...</div>
          ) : (
            <div>
              {(movimientos.pagos_programas?.length > 0 || movimientos.pagos_secundarios?.length > 0) ? (
                <>
                  {movimientos.pagos_programas?.length > 0 && (
                    <>
                      <div className="font-semibold mb-2 mt-2">Programas de Pagos</div>
                      <ul className="mb-3 pl-4 text-sm">
                        {movimientos.pagos_programas.map((m, i) => (
                          <li key={i}>
                            #{m.num} - {m.concepto}: <span className="font-bold">${m.monto}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {movimientos.pagos_secundarios?.length > 0 && (
                    <>
                      <div className="font-semibold mb-2 mt-2">Pagos secundarios</div>
                      <ul className="mb-3 pl-4 text-sm">
                        {movimientos.pagos_secundarios.map((m, i) => (
                          <li key={i}>
                            #{m.num} - {m.concepto}: <span className="font-bold">${m.monto}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className="font-bold text-blue-700 mt-2">
                    Ingresos totales: ${movimientos.total_ingresos}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-gray-400">
                  No hay ingresos registrados para este mes.
                </div>
              )}
              {/* EGRESOS */}
              <div className="mt-4">
                <div className="font-semibold mb-2 mt-2 text-red-600">Egresos (Miscelánea)</div>
                <ul className="mb-3 pl-4 text-sm">
                  {(movimientos.miscelanea || []).length === 0 ? (
                    <li className="text-gray-400">No hay egresos registrados.</li>
                  ) : (
                    movimientos.miscelanea.map((e, i) => (
                      <li key={i}>
                        {e.descripcion}: <span className="font-bold">${e.monto}</span>
                      </li>
                    ))
                  )}
                </ul>
                <div className="font-bold text-red-700 mt-2">
                  Egresos totales: ${movimientos.total_egresos}
                </div>
              </div>
              <div className="font-bold text-lg text-right mt-4 border-t pt-2">
                Saldo final: ${movimientos.saldo_final}
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
