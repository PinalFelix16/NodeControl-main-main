import AlumnoTabs from "components/Alumnos/AlumnoTabs";
import React, { useEffect, useState } from "react";
import { fetchAlumnoAllData } from "services/api/alumnos";

// components


// layout for page


export default function ShowAlumno({setView,  selectedUser}) {
    const [alumnoData, setAlumnoData] = useState();
    async function getAlumno() {
        const data = await fetchAlumnoAllData(selectedUser);
        setAlumnoData(data.alumno)
      }
    
      useEffect(() => {
          getAlumno();
        }, [selectedUser]);    

    return (
        <>

            <div className="flex flex-wrap mt-2">

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
                        <div className="block w-full mb-8 overflow-x-auto">
                            <button onClick={()=>{setView('Table');}} className=" float-right bg-transparent border border-solid  hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-blueGray-200 border-blueGray-200" type="button">
                                <i className="fas fa-arrow-left mr-2"></i> Ver Alumnos 
                            </button>
                            <h3
                                className={
                                    "font-semibold text-2xl text-white mb-4"
                                }
                            >
                               Expediente del alumno <br />
                               Nombre: {alumnoData?.nombre} <i className=" fas fa-check mx-4 text-emerald-500"></i> 
                            </h3>
                           
                            <AlumnoTabs
                                     alumnoData={alumnoData}
                                     selectedUser={selectedUser}
                                     setView={setView}
                            />

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

