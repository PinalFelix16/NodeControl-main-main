"use client";

import { useState } from "react";
import Modal from "components/modal";
import AplicarBecaLegacy from "components/becas/AplicarBecaLegacy";
import AplicarDescuentoLegacy from "components/descuentos/AplicarDescuentoLegacy";

"use client";
import { useState } from "react";
import Modal from "components/modal";
import AplicarBecaLegacy from "components/becas/AplicarBecaLegacy";
import AplicarDescuentoLegacy from "components/descuentos/AplicarDescuentoLegacy";

/**
 * Igual que el sistema anterior: se coloca en el expediente del alumno.
 * Props: alumnoId, programaId, periodo (YYYY-MM), precioActual (opcional), onApplied (callback)
 */
export default function AccionesFinancieras({ alumnoId, programaId, periodo, precioActual, onApplied }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);

  const abrir = (v) => { setView(v); setOpen(true); };
  const cerrar = () => { setOpen(false); setView(null); };
  const refrescar = () => { onApplied?.(); };

  return (
    <div className="flex gap-2">
      <button className="px-3 py-2 border rounded" onClick={() => abrir("beca")}>Aplicar beca</button>
      <button className="px-3 py-2 border rounded" onClick={() => abrir("descuento")}>Aplicar descuento</button>

      <Modal show={open} title={view === "beca" ? "Aplicar beca" : "Aplicar descuento"} onClose={cerrar}>
        {view === "beca" && (
          <AplicarBecaLegacy
            onClose={cerrar}
            onSuccess={refrescar}
            defaults={{ id_alumno: alumnoId, id_programa: programaId, periodo, precio_actual: precioActual }}
            lockDefaults   // campos bloqueados como en el flujo viejo
          />
        )}
        {view === "descuento" && (
          <AplicarDescuentoLegacy
            onClose={cerrar}
            onSuccess={refrescar}
            defaults={{ id_alumno: alumnoId, id_programa: programaId, periodo, precio_actual: precioActual }}
            lockDefaults
          />
        )}
      </Modal>
    </div>
  );
}
