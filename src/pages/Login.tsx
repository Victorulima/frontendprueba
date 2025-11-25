import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login: React.FC = () => { 
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      
      const result = await login(email, password);

      if (result.success) {
        navigate("/panel"); 
      } else {
        setError(result.message || "Correo o contraseña incorrectos");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al iniciar sesión.");
    }
  };

  
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "60px auto",
        background: "#fff8ec",
        padding: 20,
        borderRadius: 8,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#3f2a17" }}>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "8px 12px",
            background: "#3f2a17",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Ingresar
        </button>

        <div style={{ marginTop: 10, textAlign: "center" }}>
          <Link to="/recover" style={{ color: "#3f2a17", fontSize: 14 }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div style={{ marginTop: 8, textAlign: "center" }}>
          <span style={{ fontSize: 14 }}>¿No tienes una cuenta? </span>
          <Link to="/register" style={{ color: "#3f2a17", fontSize: 14 }}>
            Crear cuenta
          </Link>
        </div>
      </form>
    </div>
  );
};

