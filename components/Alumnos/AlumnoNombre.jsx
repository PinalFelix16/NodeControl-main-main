// components/Alumnos/AlumnoNombre.jsx
import React from "react";
import { fetchInformacionAlumno } from "services/api/expediente";

export default function AlumnoNombre({ id }) {
  const [nombre, setNombre] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const info = await fetchInformacionAlumno(id);
        // el API a veces devuelve {data: {...}} y a veces directo
        const raw = Array.isArray(info?.data) ? info.data[0] : (info?.data ?? info);
        const n =
          raw?.nombre ??
          raw?.nombre_alumno ??
          raw?.alumno?.nombre ??
          ""; // varios alias por si acaso
        if (alive) setNombre(n || "");
      } catch {
        if (alive) setNombre("");
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <span className="font-semibold">
      {nombre || "—"}
    </span>
  );
}
