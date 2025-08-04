import React, { useEffect, useState } from "react";
import { fetchMaestros } from "services/api/maestros";

export default function AddForm({ setView }) {
  const initialFormData = {
    nombre: "",
    mensualidad: "",
    complex: "No",
    nivel: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [clases, setClases] = useState([
    { clase: "", maestro: "", informacion: "", porcentaje: "", personal: "" }
  ]);
  const [maestros, setMaestros] = useState([]);

  useEffect(() => {
    fetchMaestros().then(data => setMaestros(data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleClaseChange = (i, e) => {
    const arr = [...clases];
    arr[i][e.target.id] = e.target.value;
    setClases(arr);
  };
  const addClase = () => {
    setClases([...clases, { clase: "", maestro: "", informacion: "", porcentaje: "", personal: "" }]);
  };
  const removeClase = (i) => {
    setClases(clases.filter((_, idx) => idx !== i));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const campos = clases.length;
    const payload = { ...formData, campos, clases };
    const res = await fetch("http://localhost:8000/api/clases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert("Programa registrado");
      setView("Table");
    } else {
      alert("Error al registrar");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* … tus inputs de nombre, mensualidad, nivel … */}
      <hr className="my-6 border-gray-300" />

      {clases.map((clase, idx) => (
        <div key={idx} className="mb-4 relative">
          <button
            type="button"
            onClick={() => removeClase(idx)}
            className="
              absolute top-0 right-0
              bg-red-500 hover:bg-red-600 active:bg-red-700
              text-white text-xs font-bold px-2 py-1 rounded
              transition duration-150
            "
          >
            Eliminar
          </button>
          {/* … aquí tus inputs/selects para cada campo de la clase … */}
        </div>
      ))}

      <button
        type="button"
        onClick={addClase}
        className="
          float-right mb-4
          bg-amber-500 hover:bg-amber-600 active:bg-amber-700
          text-white text-sm font-bold
          px-4 py-2 rounded shadow
          transition-colors duration-150 ease-linear
          focus:outline-none
        "
      >
        Agregar clase
      </button>

      <div className="text-center mt-6">
        <button
          type="submit"
          className="
            bg-blueGray-800 text-white active:bg-blueGray-600
            text-sm font-bold px-6 py-3 rounded shadow
            hover:shadow-lg transition duration-150
          "
        >
          Registrar Programa
        </button>
      </div>
    </form>
  );
}
