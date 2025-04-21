import Input from "components/Input";

export default function VerNomina({ nomina }) {
  return (
    <div className="flex flex-col gap-4">
      <Input label="Fecha" value={nomina?.formated_fecha} readOnly />
      <Input label="Autor" value={nomina?.autor} readOnly />
      <Input label="Clases" value={nomina?.clases} />
      <Input label="Inscripciones" value={nomina?.inscripciones} readOnly />
      <Input label="Recargos" value={nomina?.recargos} readOnly />
      <Input label="Total" value={nomina?.total} readOnly />
      <Input label="Comisiones" value={nomina?.comisiones} readOnly />
      <Input label="Total Neto" value={nomina?.total_neto} readOnly />
      <Input
        label="Porcentaje Comisión"
        value={(nomina?.porcentaje_comision * 100).toFixed(2) + "%"}
        readOnly
      />
    </div>
  );
}
