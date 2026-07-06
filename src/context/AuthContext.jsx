import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The token lives in an httpOnly cookie the JS can't read, so recover the
    // session by asking the server to verify it.
    authAPI.me()
      .then((data) => setAdmin({ username: data.username }))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const data = await authAPI.login(username, password);
    setAdmin({ username: data.username });
    return data;
  };

  const logout = async () => {
    await authAPI.logout().catch(() => {});
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
