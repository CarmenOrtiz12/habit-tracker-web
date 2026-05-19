import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../services/authService";
import "../App.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await register(name, email, password);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="app-page">
      <section className="dashboard-container">
        <h1 className="page-title">Crear cuenta</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="primary-button" type="submit">
            Crear cuenta
          </button>
        </form>

        <p>
          ¿Ya tienes cuenta? <Link to="/">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}