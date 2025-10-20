// components/Alumnos/AlumnoClasesInscritas.jsx
import React from "react";
import {
  bajaProgramaAlumno,
  fetchProgramasAlumno,
  fetchHistorialAlumno,
} from "@/services/api/expediente";
import { updateClase } from "@/services/api/clases"; // tu API existente

// Sanear ids tipo "7:1" o "7|1" -> 7
const cleanId = (val) => {
  const m = String(val ?? "").match(/\d+/);
  return m ? Number(m[0]) : null;
};

export default function AlumnoClasesInscritas({ alumno, programas, setProgramas, setHistorial }) {
  const alumnoId = alumno?.id ?? alumno?.id_alumno;
  if (!alumnoId) return null;

  const inscritos = Array.isArray(programas) ? programas.filter(p => p.inscrito) : [];

  async function handleBajaClase(programa) {
    if (!programa?.id_programa) return;
    const ok = window.confirm(`¿Remover la clase "${programa.nombre}" del alumno?`);
    if (!ok) return;

    // 1) Intentar “baja por programa”
    try {
      await bajaProgramaAlumno(alumnoId, programa.id_programa, { remove_deuda_actual: true });
    } catch (e) {
      // 2) Plan B: por cada CLASE, intenta endpoint “quitar alumno” o, si no existe, updateClase con id_alumno=alumnoId (requerido) y flag para quitar
      try {
        const clases = Array.isArray(programa.clases) ? programa.clases : [];
        if (!clases.length) throw e;

        // Preferencia: endpoint dedicado si tu backend lo tiene:
        // POST /clases/{id_clase}/quitar-alumno  body: { alumno_id }
        const intentosPorClase = async (id_clase_crudo) => {
          const id_clase = cleanId(id_clase_crudo);
          if (!id_clase) throw new Error("id_clase inválido");

          // a) probar endpoint dedicado
          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/,'') || 'http://127.0.0.1:8000'}/api/clases/${id_clase}/quitar-alumno`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify({ alumno_id: alumnoId }),
            }
          );

          if (resp.ok) return true;

          // b) si no existe (404/405), último recurso:
          // algunos backends sólo aceptan actualizar pasando alumno_id (requerido) y una bandera custom
          // Si tu updateClase exige alumno_id requerido, mandamos el mismo alumno_id y un flag "quitar": true
          await updateClase(id_clase, { alumno_id: alumnoId, quitar: true });
          return true;
        };

        await Promise.all(
          clases
            .map(c => c?.id_clase ?? c?.id)
            .map(intentosPorClase)
        );
      } catch (e2) {
        console.error(e2);
        alert(`No se pudo dar de baja: ${e2?.message || e2}`);
        return;
      }
    }

    // refrescar listas para que desaparezca de “Clases”
    const nuevos = await fetchProgramasAlumno(alumnoId);
    setProgramas?.(nuevos);

    // opcional: refrescar historial
    const h = await fetchHistorialAlumno(alumnoId);
    setHistorial?.(h?.data ?? []);
  }

  if (inscritos.length === 0) {
    return <div className="text-sm text-blueGray-400 p-4">Sin clases inscritas.</div>;
  }

  return (
    <div className="space-y-3">
      {inscritos.map((p) => (
        <div key={p.id_programa} className="border rounded-lg p-3 flex items-center justify-between">
          <div>
            <div className="font-semibold">{p.nombre}</div>
            {p.mensualidad ? (
              <div className="text-xs text-blueGray-500">
                Mensualidad: ${Number(p.mensualidad).toFixed(2)}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => handleBajaClase(p)}
            className="text-xs px-3 py-2 rounded-lg shadow bg-red-600 hover:bg-red-700 text-white"
          >
            Quitar del alumno
          </button>
        </div>
      ))}
    </div>
  );
}
