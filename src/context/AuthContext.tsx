import React, { createContext, useState, useContext, useEffect } from "react";

type StoredUser = {
  id: number;
  name: string;
  email: string;
  password: string;
};

type PublicUser = {
  id: number;
  name: string;
  email: string;
};

type AuthResult = { success: boolean; message?: string };

interface AuthContextType {
  user: PublicUser | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (data: Partial<Pick<StoredUser, "name">>) => Promise<AuthResult>;
  changePassword: (email: string, oldPass: string, newPass: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PublicUser | null>(null);

  /* ==========================
     Cargar user desde localStorage
  =========================== */
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  /* ==========================
     Helpers usuarios locales
  =========================== */
  const readStoredUsers = (): StoredUser[] => {
    try {
      return JSON.parse(localStorage.getItem("users") || "[]");
    } catch {
      return [];
    }
  };

  const writeStoredUsers = (arr: StoredUser[]) => {
    localStorage.setItem("users", JSON.stringify(arr));
  };

  /* ==========================
     LOGIN — versión original
     Busca email + password en localStorage
  =========================== */
  const login = async (email: string, password: string): Promise<AuthResult> => {
    const users = readStoredUsers();
    const found = users.find(u => u.email === email && u.password === password);

    if (!found) return { success: false, message: "Correo o contraseña incorrectos" };

    const publicUser: PublicUser = {
      id: found.id,
      name: found.name,
      email: found.email,
    };

    localStorage.setItem("user", JSON.stringify(publicUser));
    setUser(publicUser);

    return { success: true };
  };

  /* ==========================
     REGISTRO — versión original
  =========================== */
  const register = async (name: string, email: string, password: string): Promise<AuthResult> => {
    if (!name || !email || !password)
      return { success: false, message: "Todos los campos son obligatorios" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { success: false, message: "Correo inválido" };

    if (password.length < 6)
      return { success: false, message: "La contraseña debe tener al menos 6 caracteres" };

    const users = readStoredUsers();

    if (users.some((u) => u.email === email)) {
      return { success: false, message: "El correo ya está en uso" };
    }

    const newUser: StoredUser = {
      id: Date.now(),
      name,
      email,
      password,
    };

    writeStoredUsers([...users, newUser]);

    const publicUser: PublicUser = {
      id: newUser.id,
      name,
      email,
    };

    localStorage.setItem("user", JSON.stringify(publicUser));
    setUser(publicUser);

    return { success: true };
  };

  /* ==========================
     LOGOUT
  =========================== */
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  /* ==========================
     UPDATE NAME
  =========================== */
  const updateUser = async (data: Partial<Pick<StoredUser, "name">>): Promise<AuthResult> => {
    if (!user) return { success: false, message: "No hay usuario activo" };

    const users = readStoredUsers();
    const index = users.findIndex(u => u.email === user.email);

    if (index === -1) return { success: false, message: "Usuario no encontrado" };

    const updated = { ...users[index], ...data };
    users[index] = updated;
    writeStoredUsers(users);

    const publicUser: PublicUser = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
    };

    localStorage.setItem("user", JSON.stringify(publicUser));
    setUser(publicUser);

    return { success: true, message: "Datos actualizados correctamente" };
  };

  /* ==========================
     CHANGE PASSWORD
  =========================== */
  const changePassword = async (
    email: string,
    oldPass: string,
    newPass: string
  ): Promise<AuthResult> => {
    const users = readStoredUsers();
    const userStored = users.find(u => u.email === email);

    if (!userStored) return { success: false, message: "Usuario no encontrado." };
    if (userStored.password !== oldPass)
      return { success: false, message: "La contraseña actual es incorrecta." };
    if (newPass.length < 6)
      return { success: false, message: "La nueva contraseña debe tener al menos 6 caracteres." };

    userStored.password = newPass;
    writeStoredUsers(users);

    return { success: true, message: "Contraseña cambiada correctamente" };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  return ctx;
};
