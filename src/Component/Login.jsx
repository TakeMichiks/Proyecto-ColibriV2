import React, { useState } from "react";
import styles from "./stylesLogin.module.css";

function Login({ onClickRegister, onSuccessLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", formData);

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) { // Verifica si el status code es 200-299
        const data = await response.json();
        console.log("Login exitoso", data);
        // Si el login es exitoso, llama a la función del componente padre
        onSuccessLogin();
      } else {
        // Maneja respuestas que no son OK (ej. 401 Unauthorized)
        const errorData = await response.json();
        console.error("Error en el login:", errorData.message || 'Credenciales incorrectas');
        alert(errorData.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      // Maneja errores de red o del servidor
      console.error("Error al conectar con el servidor:", error.message);
      alert("Error al conectar con el servidor. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <>
      <div className={styles.Content}>
        <div className={styles.header}>
          <h1 class="pb-5 tracking-widest">Login</h1>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              id="Email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="password"
              name="password"
              id="Password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
            />
            <button
              class="rounded-sm p-5 hover:border-blue-900 hover:border-2 border-2 border-black"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
        <div>
          <p class="pt-2 ">
            ¿Nuevo por aquí? {" "}
            <a href="#" onClick={onClickRegister}
            class= " text-blue-300">
              ¡Regístrate!
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;