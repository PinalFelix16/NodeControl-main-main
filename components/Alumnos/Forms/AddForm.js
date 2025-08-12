import React, { useState } from "react";
import Swal from "sweetalert2";
import { storeAlumno } from "services/api/alumnos";

function splitNombreApellido(full) {
  const s = (full || "").trim().replace(/\s+/g, " ");
  if (!s) return { nombre: "", apellido: "-" };
  const i = s.lastIndexOf(" ");
  if (i === -1) return { nombre: s, apellido: "-" };
  return { nombre: s.slice(0, i), apellido: s.slice(i + 1) };
}

function toISO(d) {
  if (!d) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }
  return d;
}

const isEmail = (v) =>
  !!v &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function AddForm({ setView }) {
  const initialFormData = {
    nombre: "",
    fecha_nac: "",
    celular: "",
    correo: "",          // ← agregado
    tutor: "",
    tutor_2: "",
    telefono: "",
    telefono_2: "",
    hist_medico: "",
    status: 1,
    beca: "0.00",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((f) => ({ ...f, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación rápida de correo (opcional pero útil)
    if (formData.correo && !isEmail(formData.correo)) {
      Swal.fire({
        icon: "warning",
        title: "Correo inválido",
        text: "Por favor ingresa un correo electrónico válido.",
      });
      return;
    }

    setLoading(true);

    const { nombre, apellido } = splitNombreApellido(formData.nombre);
    const payload = {
      nombre,
      apellido,
      celular: formData.celular || "",
      telefono: formData.telefono || "",
      telefono_2: formData.telefono_2 || "",
      tutor: formData.tutor || "",
      tutor_2: formData.tutor_2 || "",
      correo: formData.correo || "",                        // ← agregado al payload
      fecha_nacimiento: toISO(formData.fecha_nac),          // backend usa fecha_nacimiento
      hist_medico: formData.hist_medico || "",
      beca: formData.beca === "" ? null : String(formData.beca),
      status: Number(formData.status) || 1,
    };

    try {
      const response = await storeAlumno(payload);
      if (response?.id_alumno || response?.success || response?.message) {
        Swal.fire({
          icon: "success",
          title: "Alumno registrado",
          text: "El alumno ha sido agregado correctamente.",
          confirmButtonColor: "#3085d6",
        });
        setFormData(initialFormData);
        setView("Table");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.error || "No se pudo guardar el alumno.",
        });
      }
    } catch (err) {
      console.error(err);
      // Si tu backend valida unique:alumnos,correo, aquí puede salir 422 por correo duplicado
      const msg =
        err?.data?.errors && Object.values(err.data.errors)[0]?.[0]
          ? Object.values(err.data.errors)[0][0]
          : "Ocurrió un error al guardar el alumno.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full pl-4">
          <div className="w-full lg:w-8/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <i className="fas fa-user-plus text-6xl "></i>
                  <h6 className="text-blueGray-500 text-sm font-bold mt-4">
                    Información del alumno
                  </h6>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>

              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                {/* Nombre completo */}
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="nombre">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Nombre completo"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Fecha nacimiento */}
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="fecha_nac">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    id="fecha_nac"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={formData.fecha_nac}
                    onChange={handleChange}
                  />
                </div>

                {/* Celular */}
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="celular">
                    Celular
                  </label>
                  <input
                    type="text"
                    id="celular"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Celular"
                    value={formData.celular}
                    onChange={handleChange}
                  />
                </div>

                {/* Correo (nuevo) */}
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="correo">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="correo"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="ejemplo@correo.com"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                </div>

                {/* Beca */}
                <div className="mb-4">
                  <label htmlFor="beca" className="block text-gray-700 font-bold mb-2">
                    Beca (% o monto)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="beca"
                    name="beca"
                    value={formData.beca ?? ""}
                    onChange={(e) => setFormData({ ...formData, beca: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Ej. 15 o 0.00"
                  />
                </div>

                {/* Historial médico */}
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="hist_medico">
                    Historial médico
                  </label>
                  <textarea
                    id="hist_medico"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Historial médico"
                    value={formData.hist_medico}
                    onChange={handleChange}
                  />
                </div>

                {/* Información tutores */}
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold mt-4">
                    Información de los tutores
                  </h6>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />

                {/* Padre */}
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tutor">
                    Nombre del padre / tutor
                  </label>
                  <input
                    type="text"
                    id="tutor"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Nombre del padre / tutor"
                    value={formData.tutor}
                    onChange={handleChange}
                  />
                </div>

                {/* Teléfono padre */}
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="telefono">
                    Celular del padre / tutor
                  </label>
                  <input
                    type="text"
                    id="telefono"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Celular del padre / tutor"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>

                {/* Madre */}
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tutor_2">
                    Nombre de la madre / tutora
                  </label>
                  <input
                    type="text"
                    id="tutor_2"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Nombre de la madre / tutora"
                    value={formData.tutor_2}
                    onChange={handleChange}
                  />
                </div>

                {/* Teléfono madre */}
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="telefono_2">
                    Celular de la madre / tutora
                  </label>
                  <input
                    type="text"
                    id="telefono_2"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Celular de la madre / tutora"
                    value={formData.telefono_2}
                    onChange={handleChange}
                  />
                </div>

                {/* Botón */}
                 {/* Botón */}
                <div className="text-center mt-6">
                  <button
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Agregando..." : "Registrar alumno"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
