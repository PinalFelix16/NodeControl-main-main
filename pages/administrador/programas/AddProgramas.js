// pages/administrador/programas/AddProgramas.js
import React from "react";
import AddForm from "components/Clases/Forms/AddForm";

export default function AddProgramas({ setView }) {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">

            {/* HEADER (franja azul) */}
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-2xl text-white">
                  Registrar nuevo programa
                </h3>

                <button
                  onClick={() => setView("Table")}
                  type="button"
                  className="bg-transparent border border-solid hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none ease-linear transition-all duration-150 text-blueGray-200 border-blueGray-200"
                >
                  <i className="fas fa-arrow-left mr-2" />
                  Ver Programas
                </button>
              </div>
            </div>

            {/* CONTENIDO */}
            <div className="block w-full mb-4">
              <AddForm setView={setView} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
