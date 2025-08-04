const BASE = process.env.NEXT_PUBLIC_API_URL

/**
 * Obtiene los alumnos filtrados por status (0 inactivos, 1 activos)
 * @param {0|1} status
 */
export async function fetchAlumnosStatus(status) {
  const url = `${BASE}/alumnos/datos-combinados?status=${status}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })

  if (!res.ok) {
    // Incluye el código de estado para facilitar el debug
    throw new Error(`Error fetching alumnos (HTTP ${res.status})`)
  }

  return await res.json()
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