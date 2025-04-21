export async function fetchClases() {
    const res = await fetch(`http://localhost:8000/api/clases`);
    if (!res.ok) {
      throw new Error('Error fetching data');
    }
    return res.json();
  }

  export async function agregarAlumnoPrograma(formData, id) {
    const response = await fetch(`http://localhost:8000/api/registrar-programa`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });
  
    return response.json();
  }
  export async function agregarAlumnoVisita(id_alumno, id_programa) {
    const response = await fetch(`http://localhost:8000/api/registrar-visita/${id_alumno}/${id_programa}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(response)
    });
  
    return response.json();
  }