import React, { useEffect, useState } from "react";
import ExpedienteTable from "./ExpedienteTable";
import Modal from "./modals/AddUserModal";
import {
  postInscripcion,
  postRecargo,
  fetchAlumnosStatus,
  fetchHistorialAlumno,
  fetchInformacionAlumno,
  fetchProgramasAlumno,
} from "services/api/expediente";
import HistorialTable from "./HistorialTable";
import AlumnoCard from "./cards/AlumnoCard";
import ClasesCard from "./cards/ClasesCard";
import AllClases from "pages/administrador/AllClases";
import {
  agregarAlumnoPrograma,
  agregarAlumnoVisita,
  updateClase,fetchClasesRaw
} from "services/api/clases";

export default function AlumnoTabs({ selectedUser, alumnoData, hideClasses = false, setView })  {
  // Abre "Información" si hideClasses=true
  const [openTab, setOpenTab] = useState(hideClasses ? 4 : 1);
  useEffect(() => {
    if (hideClasses) setOpenTab(4);
  }, [hideClasses]);

  const [showModal, setShowModal] = useState(false);
  const [typeS, setTypeS] = useState(0);
  const [title, setTitle] = useState("");

  const [total, setTotal] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [informacion, setInformacion] = useState([]); // puede ser objeto o arreglo
  const [programas, setProgramas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [secondOption, setSecondOption] = useState(null);

  const handlePayment = (type) => {
    setTypeS(type);
    const cobros = ["inscripción", "recargo", "visita"];
    if (type !== 2) setShowModal(true);
    else setShowModal(false);
    if (type === 4) setTitle("Deseas continuar con el cobro?");
    else setTitle("¿Deseas cobrar " + cobros[type]);
  };

  async function getAlumno() {
    const data = await fetchAlumnosStatus(selectedUser);
    const historialData = await fetchHistorialAlumno(selectedUser);
    const informationData = await fetchInformacionAlumno(selectedUser);
    const ClassData = await fetchProgramasAlumno(selectedUser);

    setTotal(data.total ?? "0.00");
    setPagos(data.data ?? []);
    // 🔧 usa el objeto raíz si la API no trae { data: {...} }
    setInformacion(informationData?.data ?? informationData ?? []);
    setHistorial(historialData.data ?? []);
    setSecondOption(null);

    if (ClassData[0] !== undefined) {
      setProgramas(ClassData || [{}]);
    }
  }

  useEffect(() => {
    getAlumno();
  }, [selectedUser]);

  // Normaliza la fuente de datos para el card de información
  const alumnoInfo = React.useMemo(() => {
    const raw = Array.isArray(informacion) ? informacion[0] : informacion;

    const base =
      alumnoData && (alumnoData.nombre || alumnoData.id_alumno)
        ? alumnoData
        : raw || {};

    return {
      id_alumno:  base.id_alumno  ?? base.id ?? base.idAlumno ?? null,
      nombre:     base.nombre     ?? base.nombre_alumno ?? "",
      fecha_nac:  base.fecha_nac  ?? base.fecha_nacimiento ?? "",
      celular:    base.celular    ?? base.celular_alumno ?? "",
      telefono:   base.telefono   ?? base.telefono_1 ?? base.tel1 ?? "",
      telefono_2: base.telefono_2 ?? base.tel2 ?? "",
      tutor:      base.tutor      ?? base.tutor_1 ?? "",
      tutor_2:    base.tutor_2    ?? "",
      status:     base.status     ?? base.estado ?? "",
      hist_medico:base.hist_medico?? base.observaciones ?? base.medico_historial ?? "",
    };
  }, [alumnoData, informacion]);

  const handleDelete = () => {
    setShowModal(true);
    setTitle(
      "¿Deseas remover el programa seleccionado? Se eliminará el adeudo correspondiente al periodo actual"
    );
  };
  const handleClose = () => setShowModal(false);

  const handleDoPayment = async () => {
    let clases = pagos;
    const data = {
      cant: clases.length,
      total: clases.reduce((acc, c) => acc + parseFloat(c.importe || 0), 0),
      id_alumno: selectedUser,
      ...clases.reduce((acc, c, i) => {
        acc[`id_programa_${i}`] = c.id_programa;
        acc[`nombre_programa_${i}`] = c.nombre_programa;
        acc[`concepto_${i}`] = c.concepto;
        acc[`periodo_${i}`] = c.periodo;
        acc[`fecha_limite_${i}`] = c.fecha_limite;
        acc[`importe_${i}`] = c.importe;
        acc[`add${i}`] = true;
        return acc;
      }, {}),
    };

    const response = await fetch("http://localhost:8000/api/procesar-pagos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const data2 = await response.json();

    getAlumno();
    if (response.ok) {
      alert("El pago se hizo correctamente");
      const link = document.createElement("a");
      link.href = data2.download_link;
      link.download = data2.download_link.split("/").pop();
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Error al enviar los datos");
    }
  };

  const handleConfirm = async () => {
    setShowModal(false);
    setSecondOption();

    if (typeS === 4) {
      handleDoPayment();
      return;
    }

    if (typeS === 1) {
      // Asignar clases EXISTENTES del programa al alumno (PUT /clases/{id})
      if (Array.isArray(modalData?.claseIds) && modalData.claseIds.length) {
        try {
          await Promise.all(
            modalData.claseIds.map((idc) => updateClase(idc, { alumno_id: modalData.alumno_id }))
          );
          alert("Clases asignadas al alumno.");
          getAlumno();
        } catch (e) {
          console.error(e);
          alert(e?.message || "No se pudo asignar las clases.");
        }
        return;
      }
      // Compatibilidad con flujo anterior
      const response = await agregarAlumnoPrograma(modalData);
      if (response.message != null) alert(response.message);
      else alert(response.error);
      getAlumno();
      return;
    }

    typeS === 0 ? handleInscripcion(selectedUser) : handleRecargo(selectedUser);
  };

const addClaseAlumno = async (id_programa) => {
  try {
    // Traemos TODAS las clases y filtramos por programa
    const todas = await fetchClasesRaw().catch(() => []);
    const clasesPrograma = (Array.isArray(todas) ? todas : [])
      .filter(c => String(c.id_programa) === String(id_programa));

    if (!clasesPrograma.length) {
      alert("Ese programa no tiene clases definidas para asignar.");
      return;
    }

    const claseIds = clasesPrograma.map(c => c.id_clase ?? c.id);

    const data = {
      alumno_id: selectedUser,
      id_alumno: selectedUser,   // por compatibilidad con otros flujos
      id_programa,
      claseIds,
    };

    setModalData(data);
    setSecondOption({
      text: "Registrar Visita",
      data,
      function: handleVisita2,
    });
    setTitle("¿Deseas agregar el programa seleccionado? Se agregará el adeudo correspondiente al periodo actual");
    setTypeS(1);
    setShowModal(true);
  } catch (e) {
    console.error(e);
    alert("No se pudieron obtener las clases de ese programa.");
  }
};


  const handleVisita2 = () => handleVisita();

  const handleVisita = async () => {
    const response = await agregarAlumnoVisita(
      secondOption.data.id_alumno,
      secondOption.data.id_programa
    );
    if (response.message != null) alert(response.message);
    else alert(response.error);
    getAlumno();
    setSecondOption(null);
  };

  const handleInscripcion = async (id) => {
    const response = await postInscripcion(id);
    if (response.message != null) alert(response.message);
    getAlumno();
  };
  const handleRecargo = async (id) => {
    const response = await postRecargo(id);
    if (response.message != null) alert(response.message);
    getAlumno();
  };

  return (
    <>
      <div className="flex flex-wrap bg-white w-full">
        <Modal
          show={showModal}
          onClose={handleClose}
          onConfirm={handleConfirm}
          secondOption={secondOption}
          title={title}
          message=""
        />
        <div className="w-full">
          <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 1 ? "text-white bg-lightBlue-600" : "text-lightBlue-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                Pagos pendientes
              </a>
            </li>

            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 2 ? "text-white bg-lightBlue-600" : "text-lightBlue-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                Historial de Pagos
              </a>
            </li>

            {!hideClasses && (
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                    (openTab === 3 ? "text-white bg-lightBlue-600" : "text-lightBlue-600 bg-white")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(3);
                  }}
                  data-toggle="tab"
                  href="#link3"
                  role="tablist"
                >
                  Clases
                </a>
              </li>
            )}

            {!hideClasses && (
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                    (openTab === 5 ? "text-white bg-lightBlue-600" : "text-lightBlue-600 bg-white")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(5);
                  }}
                  data-toggle="tab"
                  href="#link5"
                  role="tablist"
                >
                  Agregar clase
                </a>
              </li>
            )}

            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 4 ? "text-white bg-lightBlue-600" : "text-lightBlue-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(4);
                }}
                data-toggle="tab"
                href="#link4"
                role="tablist"
              >
                Información
              </a>
            </li>
          </ul>

          <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded">
            <div className="px-4 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                  <button
                    onClick={() => {
                      handlePayment(0);
                    }}
                    className=" border border-solid bg-blueGray-500  font-bold text-sm px-6 py-3 rounded outline-none mr-4"
                    type="button"
                  >
                    <i className="fas fa-dollar-sign text-emerald-500 mr-2"></i> Cobrar Inscripción
                  </button>
                  <button
                    onClick={() => {
                      handlePayment(1);
                    }}
                    className=" border border-solid bg-blueGray-500  font-bold text-sm px-6 py-3 rounded outline-none mr-4"
                    type="button"
                  >
                    <i className="fas fa-dollar-sign text-emerald-500 mr-2"></i> Cobrar Recargo
                  </button>

                  <ExpedienteTable pagos={pagos} total={total} handlePayment={handlePayment} />
                </div>

                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  <HistorialTable pagos={historial} total={total} handlePayment={handlePayment} />
                </div>

                {!hideClasses && (
                  <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                    <div className="px-4 md:px-10 mx-auto w-full">
                      <div>
                        <div className="flex flex-wrap">
                          {programas?.map((element, index) => (
                            <div className="w-full lg:w-6/12 px-4 mb-2" key={index}>
                              <ClasesCard
                                statSubtitle={element.nombre}
                                statTitle="Baby Dance Group A"
                                statArrow="down"
                                statPercent={element.mensualidad}
                                statPercentColor="text-red-500"
                                statDescripiron="Since last week"
                                statIconName="fas fa-arrow-down"
                                statIconColor="bg-red-500"
                                statSchedule={element.clases}
                                handleDelete={handleDelete}
                              />
                            </div>
                          ))}
                          {programas.length === 0 && <p>No hay clases disponibles</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Información */}
                <div className={openTab === 4 ? "block" : "hidden"} id="link4">
                  <AlumnoCard
                    name={alumnoInfo?.nombre}
                    id={alumnoInfo?.id_alumno}
                    bDate={alumnoInfo?.fecha_nac}
                    studentPhone={alumnoInfo?.celular}
                    phone1={alumnoInfo?.telefono}
                    phone2={alumnoInfo?.telefono_2}
                    parent1={alumnoInfo?.tutor}
                    parent2={alumnoInfo?.tutor_2}
                    status={alumnoInfo?.status}
                    medical={alumnoInfo?.hist_medico}
                    onEdit={() => setView && setView("EditUser")}   
                  />
                </div>

                {!hideClasses && (
                  <div className={openTab === 5 ? "block" : "hidden"} id="link5">
                    <AllClases
                      isStudent={true}
                      programasAlumno={programas}
                      onClickEvent={addClaseAlumno}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
