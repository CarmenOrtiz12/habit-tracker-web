import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../services/authService";
import "../App.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await register(name, email, password);
      navigate("/");
    } catch (error) {
        console.error(error);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">Empieza a construir mejores hábitos desde hoy ✨</p>

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

          <button className="primary-button" type="submit"> Crear cuenta </button>

        </form>

        <p className="auth-footer"> ¿Ya tienes cuenta? 
          <Link to="/">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}