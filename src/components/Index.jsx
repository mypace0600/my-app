import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/home", { replace: true });
    } else {
      navigate("/splash", { replace: true });
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Index;
