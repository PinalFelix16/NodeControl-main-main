import { useNominas } from "./nominasContext";

export default function EliminarNomina({ nomina, handleClose }) {
  const { deleteNomina } = useNominas();

  const onClose = () => {
    deleteNomina(nomina.id_nomina);
    handleClose();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2>
        ¿Estás seguro de deseas eliminar la nómina con ID {nomina.id_nomina}?
      </h2>
      <button
        className="rounded bg-red-600 text-white font-bold py-4 mt-8"
        onClick={onClose}
      >
        Eliminar
      </button>
    </div>
  );
}
