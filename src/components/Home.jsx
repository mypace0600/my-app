// src/components/Home.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { startQuiz } from "../services/api";
import CustomHeader from "./CustomHeader";
import CustomFooter from "./CustomFooter";
import "../css/base.css"; // 공통
import "../css/home.css";

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

      console.log(response);
      if (response.status === 204) {
        alert("No quizzes available to solve.");
        return;
      }
      navigate(`/quiz/${response.data.data.quizId}`);

      // 정상 흐름
    } catch (error) {
      console.error("Start quiz error:", error);
      alert("Error! start quiz");
    }
  };

  if (!fetched) return <div>Loading...</div>;

  return (
    <div className="home-container">
      <CustomHeader />

      <div className="button-group">
        <button onClick={handleStartQuiz} className="btn btn--primary">
          Start Quiz
        </button>
        <button
          onClick={() => navigate("/stat")}
          className="btn btn--secondary"
        >
          Statistics
        </button>
        {user.data?.isAdmin && (
          <button
            onClick={() => navigate("/admin/quiz")}
            className="btn btn--success"
          >
            Admin Quiz
          </button>
        )}
        {user.data?.isAdmin && (
          <button
            onClick={() => navigate("/admin/user")}
            className="btn btn--success"
          >
            Admin User
          </button>
        )}
      </div>
      <CustomFooter />
    </div>
  );
};

export default Home;
