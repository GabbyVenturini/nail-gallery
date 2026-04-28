import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Re-autenticar se houver token na inicialização
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("nail-gallery-token");
      if (token) {
        try {
          const data = await apiFetch("/auth/me");
          setSession(data.user);
        } catch (error) {
          localStorage.removeItem("nail-gallery-token");
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function register(payload) {
    // Isso cria o cliente. Como ele precisa logar, podemos fazer um auto-login ou forçá-lo
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    // Efetuamos login direto para conforto
    await login({ email: payload.email, password: payload.password });
  }

  async function login(payload) {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    // Salva token e sessão
    localStorage.setItem("nail-gallery-token", data.token);
    setSession(data.user);
  }

  function logout() {
    localStorage.removeItem("nail-gallery-token");
    setSession(null);
    window.location.href = "/login";
  }

  const value = useMemo(
    () => ({
      user: session,
      loading,
      register,
      login,
      logout,
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
