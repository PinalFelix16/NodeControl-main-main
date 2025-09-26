import React, { useEffect, useRef, useState } from "react";
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
import { agregarAlumnoPrograma, agregarAlumnoVisita, updateClase } from "services/api/clases";

// ===== Base de API (sin romper nada existente) =====
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");

export default function AlumnoTabs({ selectedUser, alumnoData, hideClasses = false }) {
  const [openTab, setOpenTab] = useState(hideClasses ? 4 : 1);
  useEffect(() => { if (hideClasses) setOpenTab(4); }, [hideClasses]);

  // Evitar que una respuesta tardía pise el estado correcto
  const loadIdRef = useRef(0);

  const [showModal, setShowModal] = useState(false);
  const [typeS, setTypeS] = useState(0);
  const [title, setTitle] = useState("");

  const [total, setTotal] = useState("0.00");
  const [pagos, setPagos] = useState([]);
  const [informacion, setInformacion] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [secondOption, setSecondOption] = useState(null);

  // ========= Helpers =========
  const _meses = [
    "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
    "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"
  ];
  const periodoActual = (d = new Date()) => `${_meses[d.getMonth()]}/${d.getFullYear()}`;
  const periodoSiguiente = (d = new Date()) => {
    const nd = new Date(d);
    nd.setMonth(nd.getMonth() + 1);
    return `${_meses[nd.getMonth()]}/${nd.getFullYear()}`;
  };
  const fechaISOhoy = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  };
  // Fecha límite = día 21 del MES de la fecha base
  const fechaLimite21 = (base = new Date()) => {
    const d = new Date(base);
    d.setDate(21);
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    return iso;
  };

  // 0 = inscripción, 3 = recargo, 2 = visita, 4 = hacer cobro
  const handlePayment = (type) => {
    setTypeS(type);
    let titulo = "";
    switch (type) {
      case 0: titulo = "inscripción"; break;
      case 3: titulo = "recargo";     break;
      case 2: titulo = "visita";      break;
      case 4: setShowModal(true); setTitle("Deseas continuar con el cobro?"); return;
      default: titulo = "";
    }
    if (type !== 2) setShowModal(true); else setShowModal(false);
    setTitle(`¿Deseas cobrar ${titulo}`);
  };

  // ========= Carga de datos =========
  async function getAlumno() {
    const myLoadId = ++loadIdRef.current;

    const data            = await fetchAlumnosStatus(selectedUser);
    const historialData   = await fetchHistorialAlumno(selectedUser);
    const informationData = await fetchInformacionAlumno(selectedUser);
    const ClassData       = await fetchProgramasAlumno(selectedUser);

    if (myLoadId !== loadIdRef.current) return;

    // --- normaliza historial (ahora el backend ya lo devuelve formateado)
    const historialNorm = (historialData?.data ?? historialData ?? []);
    setHistorial(historialNorm);

    const looksLikePrograma = (x) =>
      x && typeof x === "object" &&
      ("mensualidad" in x || ("nombre" in x && !("concepto" in x) && !("importe" in x) && !("monto" in x)));

    const raw =
      (data && (data.data || data.pendientes || data.adeudos || data.items)) ||
      (Array.isArray(data) ? data : []);

    let pendientes = [];

    if (Array.isArray(raw) && raw.length && !looksLikePrograma(raw[0])) {
      pendientes = raw.map((c) => ({
        id_programa:     c.id_programa ?? c.programa_id ?? null,
        nombre_programa: c.nombre_programa ?? c.programa ?? c.nombre ?? "",
        concepto:        (c.concepto ?? c.tipo ?? "").toString().toUpperCase(),
        periodo:         c.periodo ?? c.mes_periodo ?? "",
        importe:         Number(c.importe ?? c.monto ?? 0),
        fecha_limite:    c.fecha_limite ?? c.fecha_vencimiento ?? "",
      }))
      .filter((r) =>
        r.concepto &&
        (r.importe > 0 || r.concepto === "INSCRIPCION" || r.concepto === "RECARGO")
      );
    }

    // ---------- Fallback: generar MENSUALIDAD pendiente si el backend no la envió ----------
    const programasEstables = Array.isArray(ClassData) ? ClassData : [];
    const programasInscritosLocal = programasEstables
      .map((p) => ({
        ...p,
        clases: (Array.isArray(p.clases) ? p.clases : []).filter(
          (c) => String(c?.alumno_id) === String(selectedUser)
        ),
      }))
      .filter((p) => p.clases.length > 0);

    // set de pagos ya hechos (programa|periodo|concepto)
    const pagadoKey = (pid, periodo, concepto) =>
      `${String(pid)}|${String(periodo).toUpperCase()}|${String(concepto).toUpperCase()}`;

    const setPagosHechos = new Set(
      historialNorm.map((h) =>
        pagadoKey(
          h.id_programa ?? h.programa_id ?? h.programa ?? "",
          h.periodo ?? h.referencia ?? "",
          h.concepto ?? ""
        )
      )
    );

    const hoy = new Date();
    const periodoHoy = periodoActual(hoy);
    const periodoNext = periodoSiguiente(hoy);

    const yaTieneMensualidadReal = (pid, periodo) =>
      pendientes.some(
        (r) =>
          String(r.id_programa) === String(pid) &&
          r.concepto === "MENSUALIDAD" &&
          String(r.periodo).toUpperCase() === String(periodo).toUpperCase()
      );

    const pendientesSinteticos = [];
    for (const p of programasInscritosLocal) {
      const pid = p.id_programa ?? p.programa_id ?? p.id;

      const estaPagadoActual = setPagosHechos.has(pagadoKey(pid, periodoHoy, "MENSUALIDAD"));

      if (!estaPagadoActual && !yaTieneMensualidadReal(pid, periodoHoy)) {
        // mensualidad del mes actual SOLO si no está pagada
        pendientesSinteticos.push({
          id_programa: pid ?? null,
          nombre_programa: p.nombre || p.nombre_programa || "Programa",
          concepto: "MENSUALIDAD",
          periodo: periodoHoy,
          importe: Number(p.mensualidad || 0),
          fecha_limite: fechaLimite21(hoy),
        });
      } else {
        // si el mes actual YA está pagado, muestra la del siguiente mes
        pendientesSinteticos.push({
          id_programa: pid ?? null,
          nombre_programa: p.nombre || p.nombre_programa || "Programa",
          concepto: "MENSUALIDAD",
          periodo: periodoNext,
          importe: Number(p.mensualidad || 0),
          fecha_limite: fechaLimite21(new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1)),
        });
      }
    }

    const pendientesFinal = [
      ...pendientes,
      ...pendientesSinteticos.filter((s) => Number(s.importe) > 0),
    ];

    setPagos(pendientesFinal);

    const totalCalc =
      (typeof data?.total !== "undefined"
        ? Number(data.total)
        : pendientesFinal.reduce((acc, r) => acc + Number(r.importe || 0), 0)) || 0;
    setTotal(totalCalc.toFixed(2));

    setInformacion(informationData?.data ?? informationData ?? []);
    setSecondOption(null);

    // No sobrescribas con vacío si llega [] por una carrera
    setProgramas((prev) => {
      if (Array.isArray(ClassData) && ClassData.length > 0) return ClassData;
      if (Array.isArray(prev) && prev.length > 0) return prev;
      return Array.isArray(ClassData) ? ClassData : [];
    });
  }

  useEffect(() => { getAlumno(); }, [selectedUser]);

  const alumnoInfo = React.useMemo(() => {
    const raw = Array.isArray(informacion) ? informacion[0] : informacion;
    const base = alumnoData && (alumnoData.nombre || alumnoData.id_alumno) ? alumnoData : raw || {};
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

  // ========= SOLO CLASES EN LAS QUE EL ALUMNO ESTÁ INSCRITO =========
  const programasInscritos = React.useMemo(
    () =>
      (programas || [])
        .map((p) => ({
          ...p,
          clases: (Array.isArray(p.clases) ? p.clases : []).filter(
            (c) => String(c?.alumno_id) === String(selectedUser)
          ),
        }))
        .filter((p) => p.clases.length > 0),
    [programas, selectedUser]
  );

  const handleDelete = () => {
    setShowModal(true);
    setTitle("¿Deseas remover el programa seleccionado? Se eliminará el adeudo correspondiente al periodo actual");
  };
  const handleClose = () => setShowModal(false);

  // ===== Cobro: calcula total, llama API y descarga/abre recibo; luego refresca =====
  const handleDoPayment = async () => {
    const items = (Array.isArray(pagos) ? pagos : []).map((c) => ({
      id_programa: c.id_programa ?? null,
      nombre_programa: c.nombre_programa ?? c.nombre ?? "Programa",
      concepto: String(c.concepto || "").toUpperCase(),
      periodo: c.periodo || "",
      fecha_limite: c.fecha_limite || "",
      importe: Number(c.importe || 0),
    }));

    const total = items.reduce((acc, it) => acc + Number(it.importe || 0), 0);

    // payload compatible hacia atrás
    const legacy = items.reduce((acc, it, i) => {
      acc[`id_programa_${i}`] = it.id_programa;
      acc[`nombre_programa_${i}`] = it.nombre_programa;
      acc[`concepto_${i}`] = it.concepto;
      acc[`periodo_${i}`] = it.periodo;
      acc[`fecha_limite_${i}`] = it.fecha_limite;
      acc[`importe_${i}`] = it.importe;
      acc[`add${i}`] = true;
      return acc;
    }, {});

    const payload = {
      id_alumno: selectedUser,
      alumno_id: selectedUser,
      cant: items.length,
      total,
      items,
      ...legacy,
    };

    const res = await fetch(`${API_BASE}/procesar-pagos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let downloadLink = null;
    const contentType = (res.headers.get("content-type") || "").toLowerCase();

    if (contentType.includes("application/pdf")) {
      const blob = await res.blob();
      downloadLink = URL.createObjectURL(blob);
    } else {
      let data2 = null;
      try { data2 = await res.json(); } catch {}
      if (data2) {
        downloadLink = data2.download_link || data2?.data?.download_link || null;
        if (!downloadLink && data2.pdf_base64) {
          downloadLink = `data:application/pdf;base64,${data2.pdf_base64}`;
        }
      }
    }

    await getAlumno(); // refresca pendientes e historial

    if (!res.ok) {
      alert("No se pudo completar el cobro. Revisa el servidor.");
      return;
    }

    if (downloadLink) {
      const link = document.createElement("a");
      link.href = downloadLink;
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      link.download = `recibo_${selectedUser}_${yyyy}${mm}${dd}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Pago aplicado. No se recibió el PDF del recibo. Revisa el historial.");
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
      const response = await agregarAlumnoPrograma(modalData);
      if (response.message != null) alert(response.message);
      else alert(response.error);
      getAlumno();
      return;
    }

    // 0 -> inscripción, 3 -> recargo
    typeS === 0 ? handleInscripcion(selectedUser) : handleRecargo(selectedUser);
  };

  const addClaseAlumno = async (id) => {
    const prog = (programas || []).find((p) => String(p.id_programa) === String(id));
    const claseIds = Array.isArray(prog?.clases) ? prog.clases.map((c) => c.id_clase || c.id) : [];

    if (!claseIds.length) {
      alert("Ese programa no tiene clases definidas para asignar.");
      return;
    }

    const data = {
      alumno_id: selectedUser,
      id_alumno: selectedUser,
      id_programa: id,
      claseIds,
    };

    setModalData(data);
    setSecondOption({
      text: "Registrar Visita",
      data: data,
      function: handleVisita2,
    });
    setShowModal(true);
    setTitle("¿Deseas agregar el programa seleccionado? Se agregara el adeudo correspondiente al periodo actual");
    setTypeS(1);
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

  // ========= Cobros (optimistas) =========
  const handleInscripcion = async (id) => {
    const importe = Number(prompt("Importe de inscripción", "250")) || 0;
    const id_programa = modalData?.id_programa ?? null;

    try {
      await postInscripcion(id, { importe, id_programa, concepto: "INSCRIPCION" });
    } catch (e) {
      alert(e?.message || "No se pudo cobrar la inscripción");
      console.error(e);
      return;
    }

    await getAlumno();

    setPagos((prev) => {
      const existe = prev.some((r) =>
        r.concepto === "INSCRIPCION" && Number(r.importe) === Number(importe) && r.periodo === periodoActual()
      );
      if (existe) return prev;
      return [
        ...prev,
        {
          id_programa: id_programa ?? null,
          nombre_programa: "INSCRIPCIÓN",
          concepto: "INSCRIPCION",
          periodo: periodoActual(),
          importe,
          fecha_limite: fechaISOhoy(),
        },
      ];
    });

    setTotal((t) => (Number(t || 0) + importe).toFixed(2));
    setOpenTab(1);
  };

  const handleRecargo = async (id) => {
    const importe = Number(prompt("Importe de recargo", "150")) || 0;
    const id_programa = modalData?.id_programa ?? null;

    try {
      await postRecargo(id, { importe, id_programa, concepto: "RECARGO" });
    } catch (e) {
      alert(e?.message || "No se pudo cobrar el recargo");
      console.error(e);
      return;
    }

    await getAlumno();

    setPagos((prev) => {
      const existe = prev.some((r) =>
        r.concepto === "RECARGO" && Number(r.importe) === Number(importe) && r.periodo === periodoActual()
      );
      if (existe) return prev;
      return [
        ...prev,
        {
          id_programa: id_programa ?? null,
          nombre_programa: "RECARGO",
          concepto: "RECARGO",
          periodo: periodoActual(),
          importe,
          fecha_limite: fechaISOhoy(),
        },
      ];
    });

    setTotal((t) => (Number(t || 0) + importe).toFixed(2));
    setOpenTab(1);
  };

  // ---- (Opcional) si quieres calcular un total propio del historial:
  // const totalHistorial = Array.isArray(historial)
  //   ? historial.reduce((acc, h) => {
  //       const n = Number(String(h.importe ?? h.monto ?? h.cantidad ?? 0).replace(/[^0-9.-]/g, ""));
  //       return acc + (Number.isFinite(n) ? n : 0);
  //     }, 0)
  //   : 0;

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
                onClick={(e) => { e.preventDefault(); setOpenTab(1); }}
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
                onClick={(e) => { e.preventDefault(); setOpenTab(2); }}
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
                  onClick={(e) => { e.preventDefault(); setOpenTab(3); }}
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
                  onClick={(e) => { e.preventDefault(); setOpenTab(5); }}
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
                onClick={(e) => { e.preventDefault(); setOpenTab(4); }}
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
                    onClick={() => { handlePayment(0); }}
                    className=" border border-solid bg-blueGray-500  font-bold text-sm px-6 py-3 rounded outline-none mr-4"
                    type="button"
                  >
                    <i className="fas fa-dollar-sign text-emerald-500 mr-2"></i> Cobrar Inscripción
                  </button>
                  <button
                    onClick={() => { handlePayment(3); }} // recargo usa tipo 3
                    className=" border border-solid bg-blueGray-500  font-bold text-sm px-6 py-3 rounded outline-none mr-4"
                    type="button"
                  >
                    <i className="fas fa-dollar-sign text-emerald-500 mr-2"></i> Cobrar Recargo
                  </button>

                  <ExpedienteTable pagos={pagos} total={total} handlePayment={handlePayment} />
                </div>

                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  {/* No pasamos 'total' para que HistorialTable calcule su propio total desde 'pagos' */}
                  <HistorialTable pagos={historial} handlePayment={handlePayment} />
                  {/* Si prefieres enviar un total del historial, usa la línea de abajo:
                      <HistorialTable pagos={historial} total={totalHistorial} handlePayment={handlePayment} />
                  */}
                </div>

                {/* CLASES: SOLO INSCRITAS POR EL ALUMNO */}
                {!hideClasses && (
                  <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                    <div className="px-4 md:px-10 mx-auto w-full">
                      <div>
                        <div className="flex flex-wrap">
                          {programasInscritos.map((element, index) => (
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
                                // Solo las clases de este alumno (ya vienen filtradas)
                                statSchedule={element.clases}
                                handleDelete={handleDelete}
                              />
                            </div>
                          ))}
                          {programasInscritos.length === 0 && <p>No hay clases inscritas</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                  />
                </div>

                {!hideClasses && (
                  <div className={openTab === 5 ? "block" : "hidden"} id="link5">
                    <AllClases
                      isStudent={true}
                      programasAlumno={programas}   // se mantiene igual
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
