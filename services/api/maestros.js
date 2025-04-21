export async function fetchMaestros() {
    const res = await fetch(`http://localhost:8000/api/lista-maestros`);
    if (!res.ok) {
      throw new Error('Error fetching data');
    }
    return res.json();
  }

  export async function storeMaestro(formData) {
    const response = await fetch("http://localhost:8000/api/maestros", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    return response.json();
}

export async function updateMaestro(formData, id) {
  const response = await fetch(`http://localhost:8000/api/maestros/${id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
  });

  return response.json();
}


export async function fetchMaestroAllData(id) {
  const response = await fetch(`http://localhost:8000/api/maestros/${id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      }
  });
  return response.json();
}


export async function bajaMaestro(id) {
  const response = await fetch(`http://localhost:8000/api/maestros-status/${id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      }
  });

  return response.json();
}
