import {
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Splash from "./components/Splash";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import AdminQuiz from "./components/AdminQuiz";
import Index from "./components/Index";
import AdminRoute from "./components/AdminRoute";
import { getCookie } from "./utils/cookieUtil";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const location = useLocation();
  console.log("App: Rendering routes with current path:", location.pathname);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/home" element={<Home />} />
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
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
