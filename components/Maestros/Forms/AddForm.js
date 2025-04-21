import React, { useState } from "react";
import { storeMaestro } from "services/api/maestros";

export default function AddForm({ setView }) {
    const initialFormData = {
        nombre_titular: "",
        nombre: "",
        direccion: "",
        fecha_nac: "",
        rfc: "",
        celular: "",
        status: 1, 
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await storeMaestro(formData);

        if (response.error != null) {
            
            alert(response.error);
        } else {
            
            alert("Agregado exitosamente.");
            setFormData(initialFormData);
            setView('Table');
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
                                            Información del maestro
                                        </h6>
                                    </div>
                                    <hr className="mt-6 border-b-1 border-blueGray-300" />
                                </div>
                                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                                    <div className="relative w-full mb-3">
                                       
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="nombre_titular">
                                            Nombre del titular
                                        </label>
                                        <input
                                            type="text"
                                            id="nombre_titular"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Nombre del titular"
                                            value={formData.nombre_titular}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="nombre">
                                            Nombre del maestro
                                        </label>
                                        <input
                                            type="text"
                                            id="nombre"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Nombre del maestro"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="direccion">
                                            Dirección
                                        </label>
                                        <input
                                            type="text"
                                            id="direccion"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Dirección"
                                            value={formData.direccion}
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
                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="rfc">
                                            RFC
                                        </label>
                                        <input
                                            type="text"
                                            id="rfc"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="RFC"
                                            value={formData.rfc}
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

                                    <div className="text-center mt-6">
                                        <button
                                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold  px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                            type="submit"
                                        >
                                            Registrar maestro
                                        </button>
                                    </div>
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
