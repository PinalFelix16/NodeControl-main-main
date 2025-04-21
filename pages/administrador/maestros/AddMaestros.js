import React, { useEffect, useState } from "react";

// components


// layout for page

import Admin from "layouts/Admin.js";
import AddForm from "components/Maestros/Forms/AddForm";
// import AddForm from "components/Maestros/Forms/AddForm";


export default function AddMaestros({setView}) {

    return (
        <>

            <div className="flex flex-wrap mt-4">

                <div className="w-full mb-12 px-4">
                    <div
                        className={
                            "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded "
                        }
                    >
                        <div className="rounded-t mb-0 px-4 py-3 border-0">
                            <div className="flex flex-wrap items-center">
                                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                </div>
                            </div>
                        </div>
                        <div className="block w-full mb-4 overflow-x-auto">
                            <button onClick={()=>{setView('Table');}} className=" float-right bg-transparent border border-solid  hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-blueGray-200 border-blueGray-200" type="button">
                                <i className="fas fa-arrow-left mr-2"></i> Ver Maestros
                            </button>
                            <h3
                                className={
                                    "font-semibold text-2xl text-white mb-4"
                                }
                            >
                               Registrar nuevo maestro
                            </h3>
                            
                            <AddForm setView={setView}></AddForm>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

