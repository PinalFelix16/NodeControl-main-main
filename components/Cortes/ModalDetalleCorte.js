import React from "react";

export default function ModalDetalleCorte({ open, onClose, detalle, loading }) {
  if (!open) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4 text-center">Detalle de Corte</h2>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Cargando detalles...</div>
        ) : (
          <div>
            {/* INGRESOS */}
            <div>
              <h3 className="font-bold text-blue-600 mb-2">Ingresos</h3>
              <ul className="mb-3 pl-4 text-sm">
                {detalle?.ingresos?.pagos_programas?.length > 0 && (
                  <>
                    <div className="font-semibold mb-1">Programas de Pagos</div>
                    {detalle.ingresos.pagos_programas.map((p) => (
                      <li key={`prog-${p.num}`}>
                        #{p.num} - {p.concepto} (<span className="italic">recibo: {p.recibo}</span>): <b>${p.monto}</b>
                      </li>
                    ))}
                  </>
                )}
                {detalle?.ingresos?.pagos_secundarios?.length > 0 && (
                  <>
                    <div className="font-semibold mt-2 mb-1">Pagos Secundarios</div>
                    {detalle.ingresos.pagos_secundarios.map((p) => (
                      <li key={`sec-${p.num}`}>
                        #{p.num} - {p.concepto} (<span className="italic">recibo: {p.recibo}</span>): <b>${p.monto}</b>
                      </li>
                    ))}
                  </>
                )}
                <div className="font-bold mt-3">Total Ingresos: ${detalle.ingresos.total_ingresos}</div>
              </ul>
            </div>

            {/* EGRESOS */}
            <div className="mt-6">
              <h3 className="font-bold text-red-600 mb-2">Egresos (Miscelánea)</h3>
              <ul className="mb-3 pl-4 text-sm">
                {detalle?.egresos?.miscelanea?.length > 0 ? (
                  detalle.egresos.miscelanea.map((e) => (
                    <li key={`egre-${e.id}`}>
                      - {e.descripcion}: <b>${e.monto}</b> ({e.fecha_egreso})
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">Sin egresos registrados</li>
                )}
                <div className="font-bold mt-3">Total Egresos: ${detalle.egresos.total_egresos}</div>
              </ul>
            </div>
            {/* SALDO */}
            <div className="font-bold text-lg text-right mt-5 border-t pt-2">
              Saldo final: ${detalle.saldo_final}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
