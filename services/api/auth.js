export async function login(formData) {
    const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    return response.json();
}

export async function logout(token) {
  try {
    await fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  } catch (e) {
    // Puedes ignorar el error si el backend está caído, pero el frontend siempre debe limpiar el storage
  }
}
