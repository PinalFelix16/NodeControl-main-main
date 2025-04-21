import { right } from "@popperjs/core";
import React, { useEffect, useState } from "react";
import { fetchMaestros } from "services/api/maestros";
import colors from "tailwindcss/colors";

export default function AddForm({ setView }) {
    const initialFormData = {
        nombre: "",
        mensualidad: "",
        complex: "No",
        nivel: "",
        clases: [],
    };

    const [formData, setFormData] = useState(initialFormData);
    const [clases, setClases] = useState([{ clase: "", maestro: "", informacion: "", porcentaje: "", personal: "" }]);
    const [maestros, setMaestros] = useState([]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleClaseChange = (index, e) => {
        const { id, value } = e.target;
        const newClases = [...clases];
        newClases[index][id] = value;
        setClases(newClases);
    };

    useEffect(() => {
        async function getMaestros() {
          const data = await fetchMaestros();
          setMaestros(data);
    
        }
    
        getMaestros();
      }, []);
    
    

    const addClase = () => {
        setClases([...clases, { clase: "", maestro: "", informacion: "", porcentaje: "", personal: "" }]);
    };

    const removeClase = (index) => {
        const newClases = [...clases];
        newClases.splice(index, 1); // Elimina la clase en la posición index
        setClases(newClases);
    };

    const handleSubmit = async (e) => {
        console.log({ ...formData, campos, clases });

        console.log(JSON.stringify({ ...formData, campos, clases }));
        e.preventDefault();
        const campos = clases.length;
        const response = await fetch('http://localhost:8000/api/clases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formData, campos, clases }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result);
            setFormData(initialFormData);
            setClases([{ clase: "", maestro: "", informacion: "", porcentaje: "", personal: "" }]);
            setView('Table');
        } else {
            alert(result);
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
                                    <i className="fas fa-chalkboard-teacher text-6xl"></i>
                                    <h6 className="text-blueGray-500 text-sm font-bold mt-4">
                                        Información del Programa
                                    </h6>
                                </div>
                                <hr className="mt-6 border-b-1 border-blueGray-300" />
                            </div>
                            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="nombre">
                                        Nombre del Programa
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="Nombre del Programa"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="mensualidad">
                                        Mensualidad
                                    </label>
                                    <input
                                        type="number"
                                        id="mensualidad"
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="Mensualidad"
                                        value={formData.mensualidad}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="relative w-full mb-3">
                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="complex">
                                            Complejidad
                                        </label>
                                        <select
                                            id="complex"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            value={formData.complex}
                                            onChange={handleChange}
                                        >
                                            <option value="No">No</option>
                                            <option value="Sí">Sí</option>
                                        </select>
                                    </div>

                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="nivel">
                                            Nivel
                                        </label>
                                        <select
                                            id="nivel"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            value={formData.nivel}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecciona un nivel</option>
                                            <option value="Infantil">Infantil</option>
                                            <option value="Adultos">Adultos</option>
                                            <option value="Multinivel">Multinivel</option>
                                            <option value="Principiante">Principiante</option>
                                            <option value="Intermedio">Intermedio</option>
                                            <option value="Intermedio/Avanzado">Intermedio/Avanzado</option>
                                            <option value="Avanzado">Avanzado</option>
                                        </select>
                                    </div>

                                <div className="text-center mb-3">
                                    <h6 className="text-blueGray-500 text-sm font-bold mt-4">
                                        Clases Asociadas
                                    </h6>
                                </div>

                                <hr className="mt-6 border-b-1 border-blueGray-300" />

                                {clases.map((clase, index) => (
                                    <div key={index} className="mb-4">
                                         <button
                                            type="button"
                                            onClick={() => removeClase(index)}
                                            className="bg-red-500 text-white active:bg-red-600 text-sm font-bold px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                                            style={{float: right, marginBottom: "10px"}}
                                        >
                                            Eliminar Clase
                                        </button>
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor={`clase${index}`}>
                                                Clase
                                            </label>
                                            <input
                                                type="text"
                                                id="clase"
                                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder="Nombre de la Clase"
                                                value={clase.clase}
                                                onChange={(e) => handleClaseChange(index, e)}
                                            />
                                        </div>

                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor={`maestro${index}`}>
                                                Maestro
                                            </label>
                                            <select
                                            id="maestro"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            value={clase.maestro}
                                            onChange={(e) => handleClaseChange(index, e)}
                                        >
                                            {maestros.map((maestro, index) => ( 
                                                <option value={maestro.id_maestro}>{maestro.nombre_maestro}</option>
                                            ))}
                                            </select>
                                        </div>

                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor={`informacion${index}`}>
                                                Información
                                            </label>
                                            <input
                                                type="text"
                                                id="informacion"
                                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder="Información de la Clase"
                                                value={clase.informacion}
                                                onChange={(e) => handleClaseChange(index, e)}
                                            />
                                        </div>

                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor={`porcentaje${index}`}>
                                                Porcentaje
                                            </label>
                                            <input
                                                type="number"
                                                id="porcentaje"
                                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder="Porcentaje de Participación"
                                                value={clase.porcentaje}
                                                onChange={(e) => handleClaseChange(index, e)}
                                            />
                                        </div>

                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor={`personal${index}`}>
                                                Personal (0/1)
                                            </label>
                                            <input
                                                type="number"
                                                id="personal"
                                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder="Personal (0/1)"
                                                value={clase.personal}
                                                onChange={(e) => handleClaseChange(index, e)}
                                            />
                                        </div>
                                       
                                        <hr style={{border: "solid 1px", borderColor: colors.warmGray}}></hr>

                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addClase}
                                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 mb-4"
                                    style={{float: right}}
                                    >Agregar clase</button> 

                                      
<div className="text-center mt-6">
                                        <button
                                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                            type="submit"
                                        >
                                            Registrar Programa
                                        </button>
                                    </div>
</div>
</div>
</div>
</div>
</div></form>
    )}