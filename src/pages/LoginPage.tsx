import { useEffect, useState, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

import { login } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      localStorage.setItem("access_token", data.access_token);
      navigate("/dashboard");

    } catch {
        setError("Credenciales inválidas");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="auth-title"> Habit Tracker </h1>
        <p className="auth-subtitle"> Construye hábitos y mejora cada día 🚀 </p>

        <form className="auth-form" onSubmit={handleSubmit}>
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

          {error && <p>{error}</p>}

          <button className="primary-button" type="submit"> Iniciar sesión </button>

        </form>

        <p className="auth-footer"> ¿No tienes cuenta?{" "}
          <Link to="/register">
            Crear cuenta
          </Link>
        </p>
      </section>
    </main>
  );
}