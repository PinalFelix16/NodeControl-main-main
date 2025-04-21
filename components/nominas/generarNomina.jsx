import Select from "components/select";
import { useNominas } from "./nominasContext";
import Button from "components/button";

export default function GenerarNomina({ handleClose }) {
  const { users, generarNomina } = useNominas();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    generarNomina(data.id);
    handleClose();
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 mb-4">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="id"
        >
          Autor
        </label>
        <Select name="id" id="id" required>
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombre}
            </option>
          ))}
        </Select>
      </div>
      <Button color="dark">Generar</Button>
    </form>
  );
}
