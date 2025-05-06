// /components/Splash.jsx

import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const googleAuthUrl =
      "https://api.hyeonsu-side.com/oauth2/authorization/google";
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="splash-container">
      <h1>Welcome to Wordle</h1>
      <button onClick={handleGoogleLogin} className="login-button">
        Login with Google
      </button>
      <p>
        Wordle은 단어 퀴즈를 통해 어휘력을 키우는 게임입니다. 로그인 후 매일
        새로운 문제를 풀어보세요!
      </p>
      <ul>
        <li>매일 새로운 단어 퀴즈 제공</li>
        <li>점수 기반 랭킹 시스템</li>
      </ul>
    </div>
  );
};

export default Splash;
