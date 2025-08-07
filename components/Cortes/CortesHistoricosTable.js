import React, { useEffect, useState } from "react";

export default function CortesHistoricosTable({ year = new Date().getFullYear(), onChangeYear }) {
  const [data, setData] = useState([]);
  const [anios, setAnios] = useState([]);
  const [anioActual, setAnioActual] = useState(year);
  const [loading, setLoading] = useState(true);
  const [totalFinal, setTotalFinal] = useState("0.00");

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/cortes/historico/${anioActual}`)
      .then(res => res.json())
      .then(res => {
        setData(res.data || []);
        setTotalFinal(res.totalfinal || "0.00");
        setAnios(res.anios ? res.anios.map(a => a.anio) : [anioActual]);
      })
      .catch(() => {
        setData([]);
        setTotalFinal("0.00");
      })
      .finally(() => setLoading(false));
  }, [anioActual]);

  const handleYearChange = (e) => {
    setAnioActual(e.target.value);
    if (onChangeYear) onChangeYear(e.target.value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Cortes históricas por año</h2>
        <select
          value={anioActual}
          onChange={handleYearChange}
          className="border rounded px-2 py-1"
        >
          {anios.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando cortes...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Mes</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No hay cortes registrados para este año.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.mesnum} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{row.num}</td>
                    <td className="px-3 py-2">{row.mes}</td>
                    <td className="px-3 py-2 text-right">${row.total}</td>
                  </tr>
                ))
              )}
              {data.length > 0 && (
                <tr className="font-semibold bg-blue-50">
                  <td colSpan={2} className="px-3 py-2 text-right">Total del año</td>
                  <td className="px-3 py-2 text-right">${totalFinal}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
