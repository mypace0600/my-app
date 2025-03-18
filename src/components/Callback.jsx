// components/Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      navigate("/home", { replace: true }); // URL 정리
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
