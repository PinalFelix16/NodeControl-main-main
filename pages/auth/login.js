import React, { useState } from "react";
import Link from "next/link";

// layout for page

import Auth from "layouts/Auth.js";
import { useRouter } from "next/router";
import { login } from "services/api/auth";
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Email:", email);
  console.log("Password:", password);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const result = await response.json();
    console.log(result);

    if (result.success) {
      localStorage.setItem("user_id", result.user_id);
      localStorage.setItem("user_type", result.user_type);
      alert(`Bienvenido ${result.name} (${result.rol})`);
      router.push("/administrador/programas2");
    } else {
      alert("Credenciales incorrectas");
    }
  } catch (error) {
    console.error("Error en login:", error);
    alert("Error de conexión con el servidor");
  }
};

  return (
    <>
    
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-600 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <Image width={400} height={200} src="/img/images/mcdcname.png"
                  className="h-100 w-100bg-dark "
                  alt="..."
                />

              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-200 text-xl text-center mb-3 font-bold">
                  <small>Bienvenido, usa tus credenciales para iniciar sesión</small>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Usuario
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Usuario"
                      id="grid-email"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Contraseña"
                      id="grid-password"
                    />
                  </div>
                  <div>

                  </div>

                  <div className="text-center mt-6">
                  <button
                      type="submit"
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    >
                      Iniciar sesión
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

Login.layout = Auth;
