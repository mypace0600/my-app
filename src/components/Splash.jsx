// /components/Splash.jsx

import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const googleAuthUrl =
      "https://hyeonsu-side.com/oauth2/authorization/google";
    window.location.href = googleAuthUrl;
  };

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
