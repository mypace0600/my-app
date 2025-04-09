// src/components/Home.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { startQuiz } from "../services/api";
import { deleteCookie } from "../utils/cookieUtil";
import LogoutButton from "./LogOutButton";

const Home = () => {
  const navigate = useNavigate();
  const { user, fetched } = useAuth();

  useEffect(() => {
    // fetched가 끝났고 user가 null이면 splash로 보냄
    if (fetched && !user) {
      navigate("/splash", { replace: true });
    }
  }, [fetched, user, navigate]);

  const handleStartQuiz = async () => {
    try {
      const response = await startQuiz();
      navigate(`/quiz/${response.quizId}`);
    } catch (err) {
      console.error("Start quiz error:", err.response?.data || err);
      alert("퀴즈 시작 실패");
    }
  };

  const handleLogout = () => {
    deleteCookie("token");
    navigate("/", { replace: true });
  };

  if (!fetched) return <div>로딩 중...</div>;

  return (
    <div className="home-container">
      <LogoutButton />
      <h1>Wordle Home</h1>
      <button onClick={handleStartQuiz} className="action-button">
        Start Quiz
      </button>
      <button onClick={() => navigate("/profile")} className="action-button">
        My Profile
      </button>
      {user?.isAdmin && (
        <button
          onClick={() => navigate("/admin/quiz")}
          className="action-button"
        >
          Admin
        </button>
      )}
    </div>
  );
};

export default Home;
