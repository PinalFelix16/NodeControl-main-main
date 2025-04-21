import Input from "components/Input";
import { useNominas } from "./nominasContext";
import { useEffect, useState } from "react";
import Table from "components/table/table";
import Thead from "components/table/Thead";
import HeadCell from "components/table/headCell";
import TBody from "components/table/Tbody";
import TRow from "components/table/Trow";
import AccordionItem from "components/AccordionItem";

export default function InformeGeneral({ nomina }) {
  const { getInforme } = useNominas();
  const [informe, setInforme] = useState(null);

  useEffect(() => {
    getInforme(nomina.id_nomina).then((data) => {
      setInforme(data);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Input label="Fecha" value={informe?.fechanomina} readOnly />
      <Input label="Autor" value={informe?.nombre} readOnly />
      <Input label="Folio" value={informe?.folio} />
      <div className="flex flex-col">
        {informe?.data.map((item, i) => (
          <AccordionItem title={item.nombre_maestro}>
            <Input label="Maestro" value={item.nombre_maestro} readOnly />
            <Table color="light">
              <Thead>
                <HeadCell>Clase</HeadCell>
                <HeadCell>Total</HeadCell>
                <HeadCell>Comisión</HeadCell>
              </Thead>
              <TBody>
                {item?.clases.map((clase, i) => (
                  <TRow
                    key={clase.nombre + "_" + i}
                    cells={[clase.nombre_clase, clase.total, clase.comision]}
                  />
                ))}
              </TBody>
            </Table>
          </AccordionItem>
        ))}
      </div>
    </div>
  );
}
