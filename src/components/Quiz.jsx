// /components/Quiz.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuizDetails, submitAnswer, resetAttempts } from "../services/api";
import "../css/Quiz.css"; // CSS 추가
import HomeButton from "./HomeButton";

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState(null);
  const [wordLength, setWordLength] = useState(6);
  const [nextQuizId, setNextQuizId] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showRetryModal, setShowRetryModal] = useState(false);
  const maxAttempts = 3;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetchQuizDetails(quizId);
        console.log("Quiz.jsx: fetchQuizDetails response:", response);
        setWordLength(response.wordLength);
        setNextQuizId(response.nextQuizId);
      } catch (err) {
        console.error("Fetch quiz error:", err.response?.data || err);
        setError("Failed to load quiz");
      }
    };
    fetchQuizData();
  }, [quizId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (guess.length !== wordLength) {
      setError(`Guess must be ${wordLength} letters`);
      return;
    }

    try {
      const response = await submitAnswer(quizId, guess);
      console.log("Quiz.jsx: submitAnswer response:", response);
      setAttempts([...attempts, response]);
      setGuess("");
      setError(null);

      if (response.correct) {
        setShowResultModal(true);
      } else if (attempts.length + 1 === maxAttempts) {
        setShowRetryModal(true);
      }
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);
      setError(err.response?.data?.error || "Failed to submit");
    }
  };

  const handleRetry = async () => {
    await resetAttempts(quizId);
    setAttempts([]);
    setShowRetryModal(false);
  };

  const renderWordLength = () =>
    Array(wordLength)
      .fill()
      .map((_, idx) => (
        <div key={idx} className="tile empty">
          ⬜️
        </div>
      ));

  const renderAttempts = () =>
    attempts.map((attempt, rowIdx) => (
      <div key={rowIdx} className="row">
        {attempt.feedback &&
          attempt.feedback.map((fr, colIdx) => (
            <div key={colIdx} className={`tile ${fr.status}`}>
              {fr.letter}
            </div>
          ))}
      </div>
    ));

  const isGameOver = attempts.some((a) => a.correct);

  return (
    <div className="quiz-container">
      <div>
        <HomeButton label="홈으로 가기" />
        <h1>Wordle Quiz</h1>
      </div>
      <div className="word-length">{renderWordLength()}</div>
      <div className="attempts">{renderAttempts()}</div>
      {!isGameOver && attempts.length < maxAttempts && (
        <form onSubmit={handleSubmit} className="input-section">
          <input
            type="text"
            value={guess}
            onChange={(e) =>
              setGuess(e.target.value.toUpperCase().slice(0, wordLength))
            }
            placeholder={`${wordLength}-letter word`}
            className="guess-input"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      )}
      {error && <p className="error">{error}</p>}

      {/* 결과 모달 */}
      {showResultModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>You Won!</h2>
            <div className="modal-buttons">
              <button
                onClick={() => navigate("/home")}
                className="modal-button"
              >
                홈
              </button>
              <button
                onClick={() => navigate(`/quiz/${nextQuizId || quizId}`)}
                className="modal-button"
              >
                다음 문제 풀기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 재시도 모달 */}
      {showRetryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>시도 횟수 초과</h2>
            <p>시도 횟수가 초과되었습니다.</p>
            <button onClick={handleRetry} className="modal-button">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
