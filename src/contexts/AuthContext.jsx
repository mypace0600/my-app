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

  // 1분마다 자동으로 fetchUser를 호출하여 하트를 갱신
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchUser();
    }, 60000); // 1분마다 호출

    // 첫 번째 렌더링 시에도 한 번 호출
    fetchUser();

    // 컴포넌트 언마운트 시 인터벌 클리어
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetched, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
