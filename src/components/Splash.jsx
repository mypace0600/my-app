import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // OAuth2User에서 받은 이메일도 저장하려면 백엔드에서 추가 전달 필요
      localStorage.setItem("email", "user@example.com"); // 임시, 백엔드 수정 필요
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="splash-container">
      <h1>Welcome to Wordle</h1>
      <button onClick={handleGoogleLogin} className="login-button">
        Login with Google
      </button>
    </div>
  );
};

export default Splash;
