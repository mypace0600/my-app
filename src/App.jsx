import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Splash from "./components/Splash";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import AdminQuiz from "./components/AdminQuiz";
import Callback from "./components/Callback";
import "./index.css";

// ProtectedRoute 컴포넌트
const ProtectedRoute = ({ children, isAdmin }) => {
  const token = localStorage.getItem("token");

  // 토큰 또는 관리자 권한이 없으면 리다이렉트
  if (!token || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// App 컴포넌트
const App = () => {
  const isAdmin = true; // 실제로는 서버에서 확인한 권한으로 대체해야 함 (예: useState/useEffect로 동적 처리)

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route
            path="/admin/quiz"
            element={
              <ProtectedRoute isAdmin={isAdmin}>
                <AdminQuiz />
              </ProtectedRoute>
            }
          />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
