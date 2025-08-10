"use client"; // <-- PROTOCOLO ROJO: LÍNEA AÑADIDA (cliente)

import { useEffect, useState } from "react";
import Input from "components/Input";
import Table from "components/table/table";
import Thead from "components/table/Thead";
import HeadCell from "components/table/headCell";
import TBody from "components/table/Tbody";
import TRow from "components/table/Trow";
import AccordionItem from "components/AccordionItem";
import { useNominas } from "./nominasContext";

export default function InformeGeneral({ nomina }) {
  const { getInforme } = useNominas();
  const [informe, setInforme] = useState(null);
  const [loading, setLoading] = useState(false);   // <-- PROTOCOLO ROJO: LÍNEA AÑADIDA
  const [err, setErr] = useState("");              // <-- PROTOCOLO ROJO: LÍNEA AÑADIDA

  useEffect(() => {
    if (!nomina?.id_nomina) return;               // <-- PROTOCOLO ROJO: VALIDACIÓN
    setLoading(true);
    setErr("");
    getInforme(nomina.id_nomina)
      .then((data) => setInforme(data || null))
      .catch((e) => setErr(e?.message || "No se pudo cargar el informe."))
      .finally(() => setLoading(false));
  }, [nomina?.id_nomina, getInforme]);

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Cargando informe…</div>; // <-- PROTOCOLO ROJO
  }

  if (err) {
    return (
      <div className="p-4 text-sm text-red-600">
        Error: {err} {nomina?.id_nomina ? `(ID ${nomina.id_nomina})` : ""}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Encabezado del informe */}
      <Input label="Fecha" value={informe?.fechanomina ?? "—"} readOnly />
      <Input label="Autor" value={informe?.nombre ?? "—"} readOnly />
      <Input label="Folio" value={informe?.folio ?? "—"} readOnly />

      {/* Listado por maestro */}
      <div className="flex flex-col">
        {informe?.data?.length ? (
          informe.data.map((item, i) => (
            <AccordionItem key={item.nombre_maestro + "_" + i} title={item.nombre_maestro}>
              <Input label="Maestro" value={item.nombre_maestro} readOnly />
              <Table color="light">
                <Thead>
                  <HeadCell>Clase (Programa)</HeadCell>
                  <HeadCell>Trans.</HeadCell>
                  <HeadCell>Total</HeadCell>
                  <HeadCell>Comisión</HeadCell>
                </Thead>
                <TBody>
                  {item?.clases?.length ? (
                    item.clases.map((clase, j) => (
                      <TRow
                        key={`${clase.nombre_clase}_${j}`}
                        cells={[
                          `${clase.nombre_clase}${
                            clase?.nombre_programa ? ` (${clase.nombre_programa})` : ""
                          }`,
                          clase?.transacciones ?? 0,
                          clase?.total ?? "0.00",
                          clase?.comision ?? "0.00",
                        ]}
                      />
                    ))
                  ) : (
                    <TRow cells={["Sin clases para este maestro", "", "", ""]} />
                  )}
                </TBody>
              </Table>
            </AccordionItem>
          ))
        ) : (
          <div className="text-sm text-gray-500 p-2">Sin datos para esta nómina.</div>
        )}
      </div>
    </div>
  );
}
