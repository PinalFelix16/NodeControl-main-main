export async function fetchAlumnosStatus(id_alumno) {
    const res = await fetch(`http://localhost:8000/api/adeudos/${id_alumno}`);
    if (!res.ok) {
      throw new Error('Error fetching data');
    }
    return res.json();
  }

  export async function fetchHistorialAlumno(id_alumno) {
    const res = await fetch(`http://localhost:8000/api/pagos/${id_alumno}`);
    if (!res.ok) {
      console.log(res);
    }
    return res.json();
  }
  export async function fetchInformacionAlumno(id_alumno) {
    return [];
    const res = await fetch(`http://localhost:8000/api/informacion/${id_alumno}`);
    if (!res.ok) {
      console.log(res);
    }
    return res.json();
  }

  export async function fetchProgramasAlumno(id_alumno) {
    const res = await fetch(`http://localhost:8000/api/clases/${id_alumno}`);
    if (!res.ok) {
      console.log(res);
    }
    return res.json();
  }

  export async function postInscripcion(id_alumno) {
    const response = await fetch(`http://localhost:8000/api/inscripcion/${id_alumno}`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      }
      });

      return response.json();
  }

  
  export async function postRecargo(id_alumno) {
    const response = await fetch(`http://localhost:8000/api/registrar-recargo/${id_alumno}`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      }
      });

      return response.json();
  }