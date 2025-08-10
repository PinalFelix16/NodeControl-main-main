// components/nominas/ViewHandler.jsx
import CrearNomina from "./crearNomina";
import EditarNomina from "./editarNomina";
import EliminarNomina from "./eliminarNomina";
import VerNomina from "./verNomina";
import GenerarNomina from "./generarNomina";
// import InfoGeneralModal from "./InfoGeneralModal"; // <-- PROTOCOLO ROJO: LÍNEA ELIMINADA
import InformeGeneral from "./informeGeneral"; // <-- PROTOCOLO ROJO: LÍNEA AÑADIDA

/**
 * Renderiza el contenido del modal según "view".
 * - "Ver nómina"           -> VerNomina
 * - "Información general"  -> InformeGeneral (detalle)
 * - "Informe detallado"    -> InformeGeneral (alias)
 * - "Crear/Editar/Eliminar"-> correspondientes
 * - "Generar nómina"       -> GenerarNomina
 */
export default function ViewHandler({ view, nomina, handleClose }) {
  switch (view) {
    case "Crear nómina":
      return <CrearNomina handleClose={handleClose} />;

    case "Editar nómina":
      return <EditarNomina nomina={nomina} handleClose={handleClose} />;

    case "Eliminar nómina":
      return <EliminarNomina nomina={nomina} handleClose={handleClose} />;

    case "Ver nómina":
      return <VerNomina nomina={nomina} />;

    case "Información general":
    case "Informe detallado":
      return (
        <InformeGeneral nomina={nomina} /> // <-- PROTOCOLO ROJO: LÍNEA CORREGIDA (usa informeGeneral existente)
      );

    case "Generar nómina":
      return <GenerarNomina handleClose={handleClose} />;

    default:
      return <div className="p-4 text-sm text-gray-500">Sin vista seleccionada.</div>;
  }
}
