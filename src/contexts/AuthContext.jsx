// src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setFetched(true);
    }
  };

  useEffect(() => {
    // 앱 시작 시 자동 호출
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetched }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
