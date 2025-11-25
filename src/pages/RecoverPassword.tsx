import React, { useState } from "react";

export const RecoverPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find((u: any) => u.email === email);

    if (!found) {
      setError("No existe una cuenta con ese correo");
      return;
    }

    setMessage("Correo verificado. Ahora puedes restablecer tu contraseña.");
    setStep("reset");
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u: any) =>
      u.email === email ? { ...u, password: newPassword } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setMessage(" Contraseña restablecida correctamente. Ya puedes iniciar sesión.");
    setStep("email");
    setEmail("");
    setNewPassword("");
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        background: "#fff8ec",
        padding: 20,
        borderRadius: 8,
      }}
    >
      <h2 style={{ color: "#3f2a17" }}>Recuperar Contraseña</h2>

      {step === "email" ? (
        <form onSubmit={handleEmailSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          {message && <div style={{ color: "green", marginBottom: 10 }}>{message}</div>}
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              background: "#3f2a17",
              color: "#fff",
              border: "none",
            }}
          >
            Verificar correo
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Nueva contraseña:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          {message && <div style={{ color: "green", marginBottom: 10 }}>{message}</div>}
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              background: "#3f2a17",
              color: "#fff",
              border: "none",
            }}
          >
            Restablecer contraseña
          </button>
        </form>
      )}
    </div>
  );
};