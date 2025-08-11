export async function login(formData) {
  const response = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  const data = await response.json();

  if (response.ok && data.token) {
    // GUARDAR el token en localStorage
    localStorage.setItem("token", data.token);

    // GUARDAR los datos del usuario (opcional, si tu backend los envía)
    if (data.usuario) {
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
    }
  }

  return data;
}


export async function logout() {
  const token = localStorage.getItem("token");
  try {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });
  } catch (e) {
    // Puedes ignorar el error si el backend está caído
  }
  // Limpia el storage SIEMPRE al cerrar sesión
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  // Opcional: Redirige al login
  window.location.href = "/login";
}
