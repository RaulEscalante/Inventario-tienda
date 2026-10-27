
import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="login-card">
      <div className="login-brand">
        <div className="login-brand-icon">I</div>
        <p className="login-eyebrow">GESTIÓN INTERNA</p>
        <h1>Sistema de inventario</h1>
        <p className="login-description">
          Ingresa para administrar los productos de tu tienda.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Ingresa tu usuario"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            autoFocus
            disabled={submitting}
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={submitting}
          />
        </div>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button
          className="login-button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="login-footer">
        Acceso exclusivo para usuarios autorizados.
      </p>
    </section>
  );
}
