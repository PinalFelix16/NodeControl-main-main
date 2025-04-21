import CrearNomina from "./crearNomina";
import EditarNomina from "./editarNomina";
import EliminarNomina from "./eliminarNomina";
import GenerarNomina from "./generarNomina";
import InformeGeneral from "./informeGeneral";
import VerNomina from "./verNomina";

export default function ViewHandler({ view, nomina, handleClose }) {
  switch (view.toLowerCase()) {
    case "ver nómina":
      return <VerNomina nomina={nomina} />;
    case "crear nómina":
      return <CrearNomina handleClose={handleClose} />;
    case "editar nómina":
      return <EditarNomina nomina={nomina} handleClose={handleClose} />;
    case "eliminar nómina":
      return <EliminarNomina nomina={nomina} handleClose={handleClose} />;
    case "generar nómina":
      return <GenerarNomina handleClose={handleClose} />;
    case "información general":
      return <InformeGeneral nomina={nomina} />;
    default:
      return null;
  }
}
