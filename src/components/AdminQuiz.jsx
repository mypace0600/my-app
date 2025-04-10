// /components/AdminQuiz.jsx

import { useState, useEffect } from "react";
import {
  getQuizList,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../services/api";
import "../css/base.css"; // 공통
import "../css/adminQuiz.css";
import CustomHeader from "./CustomHeader";

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
        alert("need admin authority");
      } else {
        alert("fail to load");
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
      alert("max length 10 words.");
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
      alert("fali to save.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("are you sure to delete?")) {
      try {
        await deleteQuiz(id);
        fetchQuizzes(page, searchKeyword);
      } catch (error) {
        console.error("❌ Error deleting quiz:", error);
        alert("fail to delete.");
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
      <CustomHeader
        onCreateClick={() => setShowForm((prev) => !prev)}
        isCreating={showForm}
      />

      <div className="search-bar">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="search"
        />
        <button
          onClick={() => {
            setPage(0);
            fetchQuizzes(0, searchKeyword);
          }}
        >
          search
        </button>
      </div>

      {showForm && (
        <form className="quiz-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="answer">answer</label>
            <input
              id="answer"
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              required
              maxLength={10}
              placeholder="answer (max length 10)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="hint">hint</label>
            <textarea
              id="hint"
              value={formData.hint}
              onChange={(e) =>
                setFormData({ ...formData, hint: e.target.value })
              }
              required
              placeholder="hint (ex apple -> iphone)"
              rows="3"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editingQuiz ? "edit" : "create"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">Loading...</p>
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
                  edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(quiz.id)}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-quizzes">
          {searchKeyword ? "no result" : "not found. create new one!"}
        </p>
      )}

      <div className="pagination">
        <button
          className="btn btn-pagination"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          back
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
          next
        </button>
      </div>
    </div>
  );
}

export default AdminQuiz;
