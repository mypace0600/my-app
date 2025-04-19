// src/App.jsx

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Splash from "./components/Splash";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import AdminQuiz from "./components/AdminQuiz";
import AdminUser from "./components/AdminUser";
import Index from "./components/Index";
import AdminRoute from "./routes/AdminRoute";
import Stat from "./components/Stat";
import "./css/index.css";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  const location = useLocation();
  console.log("App: Rendering routes with current path:", location.pathname);

  return (
    <div className="app">
      <Routes>
        {/* ✅ 정확히 루트일 때만 Index */}
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
          path="/stat"
          element={
            <ProtectedRoute>
              <Stat />
            </ProtectedRoute>
          }
        />
        <Route path="/quiz/:quizId" element={<Quiz />} />

        <Route
          path="/admin/quiz"
          element={
            <AdminRoute>
              <AdminQuiz />
            </AdminRoute>
          }
        />

        {
          <Route
            path="/admin/user"
            element={
              <AdminRoute>
                <AdminUser />
              </AdminRoute>
            }
          />
        }

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWrapper;
