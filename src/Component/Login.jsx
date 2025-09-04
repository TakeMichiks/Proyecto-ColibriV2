import React, { useState } from "react";
import { useUser } from "../context/UserContext";

function Login({ onClickRegister, onSuccessLogin }) {
  const { login } = useUser(); // <-- usar contexto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error login");

      login({ _id: data.userId, email: data.email }); // Guardar usuario en contexto
      onSuccessLogin(); // Cambiar sección a Panel
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-800 p-8 rounded-xl w-full max-w-sm shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-semibold transition-colors mb-2"
        >
          Login
        </button>

        <button
          type="button"
          onClick={onClickRegister}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-md font-semibold transition-colors"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Login;
