import React, { useRef } from "react";
import PropTypes from "prop-types";

export default function CortesTable({
  handleHacerCorte,
  handleAddMisc,
  color,
  cortes,
  concepto,
  setConcepto,
  monto,
  setMonto
}) {
  const tableRef = useRef(null);

  console.log(cortes)
  
  const handlePrint = () => {
    const printContents = tableRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // Solo unifica las filas, el backend ya manda todos los campos igualados
  const allRows = [
  ...(cortes?.programaData || []),
  ...(cortes?.secundarioData || []),
  ...(cortes?.miscelanioData || [])
];


  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Lista de cortes
              </h3>
              <span className="mt-4 items-stretch">
                <input
                  style={{ maxWidth: "200px", marginTop: "15px" }}
                  type="text"
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  placeholder="Concepto"
                  className="border-0 px-3 py-3 mr-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                />
                <input
                  style={{ maxWidth: "200px", marginTop: "15px" }}
                  type="text"
                  value={monto}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,2}$/.test(value)) setMonto(value);
                  }}
                  placeholder="Monto"
                  className="border-0 px-3 py-3 mr-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                />
                <button
                  onClick={handleAddMisc}
                  className="mt-5 bg-transparent border border-solid hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-sm px-2 py-2 rounded outline-none focus:outline-none mr-1 ml-4 mb-1 ease-linear transition-all duration-150 text-blueGray-200 border-blueGray-200"
                  type="button"
                >
                  <i className="fas fa-plus "></i>
                </button>
                {/*<span style={{  alignItems: "center" }}>
                   Tu otro botón aquí 
                  <Link href="/administrador/CortesHistorico">
                    <button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
                      Cortes Mensuales
                    </button>
                  </Link>
                </span>*/}
              </span>
              <button
                onClick={handlePrint}
                className="mt-4 float-right bg-transparent border border-solid hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-blueGray-200 border-blueGray-200"
                type="button"
              >
                <i className="fas fa-print mr-2"></i> Imprimir
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto" ref={tableRef}>
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  #
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Recibo
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Alumno
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Programa/Concepto
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Periodo
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Fecha
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody>
              {allRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Sin datos
                  </td>
                </tr>
              ) : (
                allRows.map((corte, index) => (
                  <tr key={index}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center hover:bg-sky-700 cursor-pointer">
                      {corte.num}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {corte.recibo}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {corte.alumno}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {corte.concepto || "-"}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {corte.periodo}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {corte.fecha}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {corte.monto}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex items-center space-x-4 float-right my-4">
            <input
              type="text"
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-4/12 ease-linear transition-all duration-150"
              placeholder="Enter text"
              readOnly
              value={"$" + (cortes?.total ?? "0.00")}
            />
            <button
              onClick={handleHacerCorte}
              className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Realizar Corte
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

CortesTable.defaultProps = {
  color: "light"
};

CortesTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"])
};
