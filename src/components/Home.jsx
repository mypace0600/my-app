import { useNavigate } from "react-router-dom";
import { startQuiz } from "../services/api";
import { deleteCookie } from "../utils/cookieUtil";
import LogoutButton from "./LogOutButton";

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
    deleteCookie("token");
    deleteCookie("email");
    navigate("/", { replace: true });
  };

  const handleAdminQuiz = () => {
    navigate("/admin/quiz");
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
      <button onClick={handleAdminQuiz} className="action-button">
        Admin Quiz
      </button>
    </div>
  );
};

export default Home;
