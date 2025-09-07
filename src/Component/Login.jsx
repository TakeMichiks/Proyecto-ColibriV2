import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { FaRegUserCircle } from "react-icons/fa";

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
        <h2 className="text-2xl font-bold text-white mb-6 text-center flex flex-row gap-2 justify-center content-center">
          Iniciar Sesión<FaRegUserCircle class="mt-1" />
        </h2>

        <div class="relative w-full max-w-sm my-8">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            class="peer w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <label
            for="email"
            class="absolute left-3 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
           peer-focus:-top-3 peer-focus:text-xs peer-focus:text-purple-500 peer-focus:p-0.5 peer-focus:rounded-2xl peer-focus:bg-gray-700
           peer-valid:-top-3 peer-valid:text-xs peer-valid:text-purple-500 peer-valid:p-0.5 peer-valid:rounded-2xl peer-valid:bg-gray-700"
          >
            Email
          </label>
        </div>

        <div class="relative w-full max-w-sm my-8">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            class="peer w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <label
            for="password"
            class="absolute left-3 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
           peer-focus:-top-3 peer-focus:text-xs peer-focus:text-purple-500 peer-focus:p-0.5 peer-focus:rounded-2xl peer-focus:bg-gray-700
           peer-valid:-top-3 peer-valid:text-xs peer-valid:text-purple-500 peer-valid:p-0.5 peer-valid:rounded-2xl peer-valid:bg-gray-700"
          >
            Contraseña
          </label>
          
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
