import Input from "components/Input";
import Button from "components/button";
import { useNominas } from "./nominasContext";
import Select from "components/select";

export default function EditarNomina({ nomina, handleClose }) {
  const { editNomina, users } = useNominas();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.porcentaje_comision = data.porcentaje_comision / 100;
    editNomina(nomina.id_nomina, data);
    handleClose();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        label="Fecha"
        type="date"
        name="fecha"
        id="fecha"
        defaultValue={nomina.fecha}
        required
      />
      <div className="flex flex-col gap-4 mb-4">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="id_autor"
        >
          Autor
        </label>
        <Select
          name="id_autor"
          id="id_autor"
          defaultValue={nomina.id_autor}
          required
        >
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombre}
            </option>
          ))}
        </Select>
      </div>
      <Input
        label="Clases"
        type="number"
        min="0"
        step="any"
        name="clases"
        id="clases"
        defaultValue={nomina.clases}
        required
      />
      <Input
        label="Inscripciones"
        type="number"
        min="0"
        step="any"
        name="inscripciones"
        id="inscripciones"
        defaultValue={nomina.inscripciones}
        required
      />
      <Input
        label="Recargos"
        type="number"
        min="0"
        step="any"
        name="recargos"
        id="recargos"
        defaultValue={nomina.recargos}
        required
      />
      <Input
        label="Total"
        type="number"
        min="0"
        step="any"
        name="total"
        id="total"
        defaultValue={nomina.total}
        required
      />
      <Input
        label="Comisiones"
        type="number"
        min="0"
        step="any"
        name="comisiones"
        id="comisiones"
        defaultValue={nomina.comisiones}
        required
      />
      <Input
        label="Total Neto"
        type="number"
        min="0"
        step="any"
        name="total_neto"
        id="total_neto"
        defaultValue={nomina.total_neto}
        required
      />
      <Input
        label="Porcentaje Comisión"
        type="number"
        min="0"
        step="any"
        name="porcentaje_comision"
        id="porcentaje_comision"
        defaultValue={nomina.porcentaje_comision * 100}
        required
      />
      <Button color="dark">Guardar</Button>
    </form>
  );
}
