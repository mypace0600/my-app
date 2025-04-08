import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { startQuiz } from "../services/api";
import { deleteCookie } from "../utils/cookieUtil";
import LogoutButton from "./LogOutButton";

const Home = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/admin-check",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Admin check failed:", error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  const handleStartQuiz = async () => {
    try {
      const response = await startQuiz();
      navigate(`/quiz/${response.quizId}`);
    } catch (err) {
      console.error("Start quiz error:", err.response?.data || err);
      alert(
        "Failed to start quiz: " +
          (err.response?.data?.error || "Unknown error")
      );
    }
  };

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("email");
    navigate("/", { replace: true });
  };

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
      {isAdmin && (
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
