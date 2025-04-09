// src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fetched, setFetched] = useState(false); // ✅ 최초 호출 여부 판단

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      setUser(res.data); // ✅ email, isAdmin 등 저장
    } catch (error) {
      setUser(null); // 로그인 안된 상태
    } finally {
      setFetched(true);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, fetched }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
