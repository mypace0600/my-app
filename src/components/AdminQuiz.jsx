import { useState, useEffect } from "react";
import {
  getQuizList,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../services/api";
import "../AdminQuiz.css";

function AdminQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({ answer: "", hint: "" });

  useEffect(() => {
    fetchQuizzes();
  }, [page]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getQuizList(page);
      setQuizzes(data || []);
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
    if (formData.answer.length > 10) {
      alert("정답은 최대 10글자까지 가능합니다.");
      return;
    }
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
      if (error.response?.status === 409) {
        alert("이미 등록된 퀴즈입니다."); // 중복 에러 처리
      } else {
        alert("퀴즈 저장에 실패했습니다.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 이 퀴즈를 삭제하시겠습니까?")) {
      try {
        await deleteQuiz(id);
        fetchQuizzes();
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert("퀴즈 삭제에 실패했습니다.");
      }
    }
  };

  const resetForm = () => {
    setFormData({ answer: "", hint: "" });
    setShowForm(false);
    setEditingQuiz(null);
  };

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1>Wordle Quiz Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "취소" : "새 퀴즈 생성"}
        </button>
      </header>

      {showForm && (
        <form className="quiz-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="answer">정답 (ANSWER)</label>
            <input
              id="answer"
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              required
              placeholder="정답 단어를 입력하세요 (최대 10글자)"
              maxLength={10}
            />
          </div>
          <div className="form-group">
            <label htmlFor="hint">힌트 (HINT)</label>
            <textarea
              id="hint"
              value={formData.hint}
              onChange={(e) =>
                setFormData({ ...formData, hint: e.target.value })
              }
              required
              placeholder="힌트를 입력하세요 (예: 과일 이름)"
              rows="3"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editingQuiz ? "수정" : "생성"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              취소
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">퀴즈 목록을 불러오는 중...</p>
      ) : quizzes.length > 0 ? (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <h3>{quiz.answer}</h3>
              <p className="hint-text">{quiz.hint}</p>
              <div className="quiz-actions">
                <button
                  className="btn btn-edit"
                  onClick={() => {
                    setEditingQuiz(quiz);
                    setFormData({ answer: quiz.answer, hint: quiz.hint });
                    setShowForm(true);
                  }}
                >
                  수정
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(quiz.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-quizzes">
          등록된 퀴즈가 없습니다. 새 퀴즈를 생성해보세요!
        </p>
      )}

      <div className="pagination">
        <button
          className="btn btn-pagination"
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          이전
        </button>
        <span>페이지 {page + 1}</span>
        <button
          className="btn btn-pagination"
          onClick={() => setPage(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default AdminQuiz;
