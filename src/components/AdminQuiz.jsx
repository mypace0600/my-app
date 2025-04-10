// /components/AdminQuiz.jsx

import { useState, useEffect } from "react";
import {
  getQuizList,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../services/api";
import "../css/AdminQuiz.css";
import HomeButton from "./HomeButton";

function AdminQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({ answer: "", hint: "" });
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchQuizzes(page, searchKeyword);
  }, [page]);

  const fetchQuizzes = async (pageToLoad = page, keyword = searchKeyword) => {
    setLoading(true);
    try {
      const { content, totalPages } = await getQuizList(pageToLoad, 5, keyword);
      setQuizzes(content || []);
      setTotalPages(totalPages || 0);
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

  const handleSearch = () => {
    setPage(0);
    fetchQuizzes(0, searchKeyword);
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
      fetchQuizzes(page, searchKeyword);
    } catch (error) {
      console.error("❌ Error submitting quiz:", error);
      alert("퀴즈 저장에 실패했습니다.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 이 퀴즈를 삭제하시겠습니까?")) {
      try {
        await deleteQuiz(id);
        fetchQuizzes(page, searchKeyword);
      } catch (error) {
        console.error("❌ Error deleting quiz:", error);
        alert("퀴즈 삭제에 실패했습니다.");
      }
    }
  };

  const resetForm = () => {
    setFormData({ answer: "", hint: "" });
    setEditingQuiz(null);
    setShowForm(false);
  };

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <div className="header-left">
          <HomeButton />
        </div>
        <h1>Wordle Quiz Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "취소" : "새 퀴즈 생성"}
        </button>
      </header>

      <div className="search-bar">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="퀴즈 제목을 검색해보세요"
        />
        <button
          onClick={() => {
            setPage(0);
            fetchQuizzes(0, searchKeyword);
          }}
        >
          검색
        </button>
      </div>

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
              maxLength={10}
              placeholder="정답 단어를 입력하세요 (최대 10글자)"
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
          {searchKeyword
            ? "검색 결과가 없습니다."
            : "등록된 퀴즈가 없습니다. 새 퀴즈를 생성해보세요!"}
        </p>
      )}

      <div className="pagination">
        <button
          className="btn btn-pagination"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, i) => i)
          .filter((p) => {
            if (totalPages <= 5) return true;
            if (p === 0 || p === totalPages - 1) return true;
            if (Math.abs(p - page) <= 2) return true;
            return false;
          })
          .map((p, i, arr) => {
            const prev = arr[i - 1];
            const showDots = i > 0 && p - prev > 1;
            return (
              <span key={p}>
                {showDots && <span className="dots">...</span>}
                <button
                  className={`btn btn-pagination-number ${
                    p === page ? "active" : ""
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p + 1}
                </button>
              </span>
            );
          })}

        <button
          className="btn btn-pagination"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default AdminQuiz;
