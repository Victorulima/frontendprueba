import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
export const Register: React.FC = () => {
  const { register } = useAuth();
  const { addUser } = useData(); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    
    const result = await register(name, email, password);
    
    if (result.success) {
      
      addUser({ nombre: name, correo: email });
      navigate("/panel");
    } else {
      setError(result.message || "Error en el registro");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", background: "#fff8ec", padding: 20, borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
      
      <h2 style={{ textAlign: "center", color: "#3f2a17" }}>Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
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
          Registrarse
        </button>
        <div style={{ marginTop: 8, textAlign: "center" }}>
          <span style={{ fontSize: 14 }}>¿Ya tienes una cuenta? </span>
          <Link to="/" style={{ color: "#3f2a17", fontSize: 14 }}>
            Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
};