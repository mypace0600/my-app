// /components/HomeButton.jsx

import { useNavigate } from "react-router-dom";
import "../css/HomeButton.css"; // 필요하다면 스타일 파일 따로

const HomeButton = ({ label = "Home", className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`btn btn-home ${className}`}
      onClick={() => navigate("/home")}
    >
      {label}
    </button>
  );
};

export default HomeButton;
