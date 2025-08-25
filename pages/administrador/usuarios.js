import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "components/ProtectedRoute";

// --- Formulario de registro de usuario ---
function RegisterUserForm({ onUserCreated }) {
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [permisos, setPermisos] = useState("ADMINISTRADOR");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ usuario, nombre, password, permisos }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("Usuario creado correctamente");
      setUsuario("");
      setNombre("");
      setPassword("");
      setPermisos("ADMINISTRADOR");
      setError("");
      if (onUserCreated) onUserCreated();
    } else {
      setError(result.message || "Error al crear usuario");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg shadow-lg bg-white max-w-md mb-10 flex flex-col gap-2"
    >
      <h2 className="font-bold mb-2">Registrar nuevo usuario</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <input
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Usuario"
        required
        className="mb-2 px-2 py-1 border rounded w-full"
      />
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
        required
        className="mb-2 px-2 py-1 border rounded w-full"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
        className="mb-2 px-2 py-1 border rounded w-full"
      />

      <select
        value={permisos}
        onChange={(e) => setPermisos(e.target.value)}
        className="mb-2 px-2 py-1 border rounded w-full"
      >
        <option value="ADMINISTRADOR">ADMINISTRADOR</option>
        <option value="SUPERADMINISTRADOR">SUPERADMINISTRADOR</option>
      </select>

      {/* VERDE (emerald) + texto blanco */}
      <button
        type="submit"
        className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                   text-white px-6 py-2 rounded font-bold transition mt-2 shadow"
      >
        Agregar usuario
      </button>
    </form>
  );
}

// --- Tabla de usuarios CRUD ---
function UserList() {
  const [usuarios, setUsuarios] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [permisos, setPermisos] = useState("ADMINISTRADOR");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [isClient, setIsClient] = useState(false);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const userDataRaw = localStorage.getItem("usuario");
    if (userDataRaw) {
      const userData = JSON.parse(userDataRaw);
      setIsSuperadmin(userData.permisos === "SUPERADMINISTRADOR");
    }
    setToken(localStorage.getItem("token"));
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) fetchUsers();
    // eslint-disable-next-line
  }, [token]);

  const handleEdit = (user) => {
    setEditUser(user);
    setNombre(user.nombre);
    setPassword("");
    setPermisos(user.permisos);
    setError("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let body = { nombre };
    if (password) body.password = password;
    if (isSuperadmin) body.permisos = permisos;

    const res = await fetch(`http://localhost:8000/api/usuarios/${editUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (res.ok) {
      setEditUser(null);
      setUsuarios(usuarios.map((u) => (u.id === editUser.id ? result.usuario : u)));
      setError("");
      alert("Usuario actualizado");
    } else {
      setError(result.message || "Error al actualizar usuario");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    const res = await fetch(`http://localhost:8000/api/usuarios/${user.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    if (res.ok) {
      setUsuarios(usuarios.filter((u) => u.id !== user.id));
      alert("Usuario eliminado");
    } else {
      alert(result.message || "Error al eliminar usuario");
    }
  };

  if (!isClient || loading) return <div className="text-center py-10">Cargando usuarios...</div>;

  return (
    <div className="mt-6">
      <h2 className="font-bold mb-2">Usuarios registrados</h2>
      <table className="min-w-full bg-white rounded shadow mb-6">
        <thead>
          <tr>
            <th className="border px-2 py-1">IDENTIFICACIÓN</th>
            <th className="border px-2 py-1">Usuario</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Permisos</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td className="border px-2 py-1">{user.id}</td>
              <td className="border px-2 py-1">{user.usuario}</td>
              <td className="border px-2 py-1">{user.nombre}</td>
              <td className="border px-2 py-1">{user.permisos}</td>
              <td className="border px-2 py-1">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded font-bold transition"
                  >
                    Editar
                  </button>
                  {isSuperadmin && (
                    <button
                      onClick={() => handleDelete(user)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded font-bold transition"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <form
          onSubmit={handleUpdate}
          className="mt-4 bg-gray-50 p-4 rounded shadow max-w-md mx-auto"
        >
          <h3 className="font-bold mb-2">Editar usuario</h3>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            required
            className="mb-2 px-2 py-1 border rounded w-full"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña (opcional)"
            className="mb-2 px-2 py-1 border rounded w-full"
          />
          {isSuperadmin && (
            <select
              value={permisos}
              onChange={(e) => setPermisos(e.target.value)}
              className="mb-2 px-2 py-1 border rounded w-full"
            >
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              <option value="SUPERADMINISTRADOR">SUPERADMINISTRADOR</option>
            </select>
          )}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Guardar cambios
          </button>
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded bg-gray-300"
            onClick={() => setEditUser(null)}
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}

// --- Componente principal de la página ---
export default function Usuarios() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="p-8 text-xl text-center text-gray-400">Cargando...</div>;

  return (
    <ProtectedRoute permisoRequerido="SUPERADMINISTRADOR">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
        {/* Botón para regresar */}
        <div className="w-full max-w-md mb-4">
          <Link href="/programas2">
            <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mb-4 w-full font-bold transition">
              ← Regresar a Inicio
            </button>
          </Link>
        </div>
        <RegisterUserForm onUserCreated={() => window.location.reload()} />
        <UserList />
      </div>
    </ProtectedRoute>
  );
}
