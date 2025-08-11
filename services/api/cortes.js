export async function fetchCortes() {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8000/api/corte-caja`, {
    
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });
  if (!res.ok) {
    // Puedes mostrar el mensaje real de error si lo deseas:
    // const errorData = await res.json();
    // throw new Error(errorData.message || 'Error fetching data');
    throw new Error('Error fetching data');
  }
  return res.json();
}


// services/api/cortes.js
export async function miscelanea(data) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:8000/api/miscelanea", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}


export async function realizarCorte(formData) {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:8000/api/realizar-corte", {
    
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return response.json();
}

