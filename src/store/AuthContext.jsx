import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { KEYS, readStorage, writeStorage } from "../lib/storage";

const AuthContext = createContext(null);

const adminSeed = {
  id: "u-admin",
  name: "Admin Nail Gallery",
  email: "admin@nailgallery.com",
  password: "admin123",
  role: "admin",
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = readStorage(KEYS.USERS, []);
    return saved.length ? saved : [adminSeed];
  });

  const [session, setSession] = useState(() => readStorage(KEYS.SESSION, null));

  useEffect(() => {
    writeStorage(KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    writeStorage(KEYS.SESSION, session);
  }, [session]);

  function register(payload) {
    const email = payload.email.trim().toLowerCase();

    if (users.some((user) => user.email === email)) {
      throw new Error("Já existe uma conta com esse e-mail.");
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: payload.name.trim(),
      email,
      password: payload.password,
      role: "customer",
    };

    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    setSession({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  }

  function login(payload) {
    const email = payload.email.trim().toLowerCase();
    const found = users.find(
      (user) => user.email === email && user.password === payload.password
    );

    if (!found) {
      throw new Error("E-mail ou senha inválidos.");
    }

    setSession({
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    });
  }

  function logout() {
    setSession(null);
  }

  const value = useMemo(
    () => ({
      user: session,
      users,
      register,
      login,
      logout,
    }),
    [session, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
