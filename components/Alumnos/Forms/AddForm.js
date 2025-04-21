import React, { useState } from "react";
import Link from "next/link";
import {storeAlumno} from "services/api/alumnos"

export default function AddForm({setView}) {
    const initialFormData = {
        nombre: "",
        fecha_nac: "",
        celular: "",
        tutor: "",
        tutor_2: "",
        telefono: "",
        telefono_2: "",
        hist_medico: "",
        status: 1,
        beca: "0.00"
    };

    const [formData, setFormData] = useState(initialFormData);

   

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

 
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await storeAlumno(formData);
        
        if (response.message != null) {
            alert(response.message);
            setFormData(initialFormData);
            setView('Table');
        } else {
            alert(response.error);
        }
    };

    return (
        <>
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
                                        />
                                    </div>

                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="fecha_nac">
                                            Fecha de nacimiento
                                        </label>
                                        <input
                                            type="date"
                                            id="fecha_nac"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Fecha de nacimiento"
                                            value={formData.fecha_nac}
                                            onChange={handleChange}
                                        />
                                    </div>

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
                                        ></textarea>
                                    </div>

                                    <div className="text-center mb-3">
                                        <h6 className="text-blueGray-500 text-sm font-bold mt-4">
                                            Información de los tutores
                                        </h6>
                                    </div>

                                    <hr className="mt-6 border-b-1 border-blueGray-300" />

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

                                    <div className="text-center mt-6">
                                        <button
                                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold  px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                            type="submit"
                                        >
                                            Registrar alumno
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
