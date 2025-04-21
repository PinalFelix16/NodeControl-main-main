export async function fetchCortes() {
    const res = await fetch(`http://localhost:8000/api/corte-caja`);
    if (!res.ok) {
      throw new Error('Error fetching data');
    }
    return res.json();
  }

  export async function miscelanea(formData) {
    const response = await fetch("http://localhost:8000/api/miscelanea", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    return response.json();
}

export async function realizarCorte(formData) {
const response = await fetch("http://localhost:8000/api/realizar-corte", {
  method: "POST",
  headers: {
      "Content-Type": "application/json"
  },
  body: JSON.stringify(formData)
});

return response.json();
}
