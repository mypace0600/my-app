// src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { fetchCurrentUser } from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchUser = async () => {
    const data = await fetchCurrentUser();
    if (data) {
      setUser(data);
    } else {
      setUser(null);
    }
    setFetched(true);
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/auth/custom-logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetched, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
