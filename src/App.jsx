import { useState, useEffect } from "react";
import {
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Splash from "./components/Splash";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import AdminQuiz from "./components/AdminQuiz";
import Callback from "./components/Callback";
import Index from "./components/Index";
import "./index.css";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8080/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setIsAdmin(data.isAdmin))
        .catch(() => setIsAdmin(false));
    }
  }, [token]);

  if (!token || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/splash" element={<Splash />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quiz"
            element={
              <AdminRoute>
                <AdminQuiz />
              </AdminRoute>
            }
          />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
