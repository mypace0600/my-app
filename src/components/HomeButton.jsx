// /components/HomeButton.jsx

import { useNavigate } from "react-router-dom";

const HomeButton = ({ label = "Home", className = "" }) => {
  const navigate = useNavigate();

  return (
    <button className="btn btn--primary" onClick={() => navigate("/home")}>
      {label}
    </button>
  );
};

export default HomeButton;
