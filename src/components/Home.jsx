import { useNavigate } from "react-router-dom";
import { startQuiz } from "../services/api";

const Home = () => {
  const navigate = useNavigate();

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
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/", { replace: true });
  };

  const handleAdminQuiz = () => {
    console.log("Home: Navigating to /admin/quiz");
    navigate("/admin/quiz");
  };

  return (
    <div className="home-container">
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      <h1>Wordle Home</h1>
      <button onClick={handleStartQuiz} className="action-button">
        Start Quiz
      </button>
      <button onClick={() => navigate("/profile")} className="action-button">
        My Profile
      </button>
      <button onClick={handleAdminQuiz} className="action-button">
        Admin Quiz
      </button>
    </div>
  );
};

export default Home;
