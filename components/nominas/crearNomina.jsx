import Input from "components/Input";
import Button from "components/button";
import Select from "components/select";
import { useNominas } from "./nominasContext";

export default function CrearNomina({ handleClose }) {
  const { createNomina, users } = useNominas();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.porcentaje_comision = data.porcentaje_comision / 100;
    createNomina(data);
    handleClose();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input label="Fecha" type="date" name="fecha" id="fecha" required />
      <div className="flex flex-col gap-4 mb-4">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="id_autor"
        >
          Autor
        </label>
        <Select name="id_autor" id="id_autor" required>
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombre}
            </option>
          ))}
        </Select>
      </div>
      <Input label="Clases" type="number" name="clases" id="clases" required />
      <Input
        label="Inscripciones"
        type="number"
        name="inscripciones"
        id="inscripciones"
        required
      />
      <Input
        label="Recargos"
        type="number"
        name="recargos"
        id="recargos"
        required
      />
      <Input label="Total" type="number" name="total" id="total" required />
      <Input
        label="Comisiones"
        type="number"
        name="comisiones"
        id="comisiones"
        required
      />
      <Input
        label="Total Neto"
        type="number"
        name="total_neto"
        id="total_neto"
        required
      />
      <Input
        label="Porcentaje Comisión"
        type="number"
        name="porcentaje_comision"
        id="porcentaje_comision"
        required
      />
      <Button color="dark">Guardar</Button>
    </form>
  );
}
