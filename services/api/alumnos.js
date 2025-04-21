

  export async function fetchAlumnosStatus(status) {
    const res = await fetch(`http://localhost:8000/api/alumnos/datos-combinados?status=${status}`);
    if (!res.ok) {
      throw new Error('Error fetching data');
    }
    return res.json();
  }

  export async function storeAlumno(formData) {
    const response = await fetch("http://localhost:8000/api/alumnos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    return response.json();
}

export async function updateAlumno(formData, id) {
  const response = await fetch(`http://localhost:8000/api/alumnos/${id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
  });

  return response.json();
}

export async function bajaAlumno(id) {
  const response = await fetch(`http://localhost:8000/api/alumnos-baja/${id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      }
  });

  return response.json();
}

export async function altaAlumno(id) {
  const response = await fetch(`http://localhost:8000/api/alumnos/${id}/alta`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      }
  });

  return response.json();
}

export async function fetchAlumnoAllData(id) {
  const response = await fetch(`http://localhost:8000/api/alumnos/${id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      }
  });

  return response.json();
}