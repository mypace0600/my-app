import { useState, useEffect } from "react";
import {
  getQuizList,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../services/api";

function AdminQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    console.log("🔍 AdminQuiz 렌더링됨");
    console.log("현재 경로:", location.pathname);
    console.log("🔑 Token 확인:", localStorage.getItem("token"));
    debugger;
    fetchQuizzes();
  }, [page]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      console.log("📡 Fetching quizzes...");
      const data = await getQuizList(page);
      console.log("✅ Fetched Data:", data);
      setQuizzes(data.content);
    } catch (error) {
      console.error("❌ Error fetching quizzes:", error);
      if (error.response?.status === 401) {
        alert("관리자 권한이 필요합니다. 로그인 상태를 확인하세요.");
      } else {
        alert("퀴즈 목록을 불러오는 데 실패했습니다.");
      }
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await updateQuiz(editingQuiz.id, formData);
      } else {
        await createQuiz(formData);
      }
      resetForm();
      fetchQuizzes();
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuiz(id);
        fetchQuizzes();
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "" });
    setShowForm(false);
    setEditingQuiz(null);
  };

  return (
    <div className="quiz-container">
      <h1>Quiz Management</h1>
      <button className="create-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Create New Quiz"}
      </button>

      {showForm && (
        <form className="quiz-form" onSubmit={handleSubmit}>
          <input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="Title"
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            placeholder="Description"
          />
          <button type="submit">
            {editingQuiz ? "Update" : "Create"} Quiz
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading quizzes...</p>
      ) : (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-item">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <div className="actions">
                <button onClick={() => setEditingQuiz(quiz)}>Edit</button>
                <button onClick={() => handleDelete(quiz.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
export default AdminQuiz;
