// /components/Quiz.jsx

import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuizDetails, submitAnswer } from "../services/api";
import "../css/base.css";
import "../css/quiz.css";
import CustomHeader from "./CustomHeader";
import CustomFooter from "./CustomFooter";

const Quiz = () => {
  const [showHintModal, setShowHintModal] = useState(false);
  const [hint, setHint] = useState("");
  const { fetchUser } = useAuth(); // ✅ AuthContext에서 fetchUser 가져오기
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState(null);
  const [wordLength, setWordLength] = useState(6);
  const [nextQuizId, setNextQuizId] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showRetryModal, setShowRetryModal] = useState(false);
  const [hearts, setHearts] = useState(null);

  useEffect(() => {
    // 퀴즈 데이터를 가져오기 전에 관련 상태 초기화
    setGuess("");
    setAttempts([]);
    setError(null);
    setShowResultModal(false);
    setShowRetryModal(false);
  }, [quizId]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetchQuizDetails(quizId);
        console.log(
          "nextQuizId:",
          response.nextQuizId,
          typeof response.nextQuizId
        );

        setWordLength(response.wordLength);
        setNextQuizId(response.nextQuizId);
        setHint(response.hint);
        if (response.hearts !== undefined) {
          setHearts(response.hearts);
        }
      } catch (err) {
        console.error("Fetch quiz error:", err.response?.data || err);
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 409) {
          alert(message || "이미 푼 퀴즈입니다.");
          navigate("/home");
          return;
        }

        setError("퀴즈 정보를 불러오는 데 실패했습니다.");
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
      setAttempts([...attempts, response]);
      setHearts(response.hearts);
      setGuess("");
      setError(null);

      if (response.correct) {
        setShowResultModal(true);
      } else if (!response.correct) {
        await fetchUser(); // ⚡️ context의 user 갱신
        if ((attempts.length + 1) % 3 === 0) {
          setShowRetryModal(true);
        }
      }
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);
      setError(err.response?.data?.error || "Failed to submit");
    }
  };

  const handleKeepGoing = () => {
    setShowRetryModal(false);
    // attempts는 유지, 그냥 모달만 닫고 다음 입력을 허용
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
        {attempt.feedback?.map((fr, colIdx) => (
          <div key={colIdx} className={`tile ${fr.status}`}>
            {fr.letter}
          </div>
        ))}
      </div>
    ));

  const isGameOver = hearts === 0;

  return (
    <div className="quiz-container">
      <CustomHeader />
      <div className="word-length">{renderWordLength()}</div>
      <div className="attempts">{renderAttempts()}</div>

      {!isGameOver && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <button
            className="hint-button"
            onClick={() => {
              setShowHintModal(true);
            }}
          >
            Hint
          </button>
        </div>
      )}
      {!isGameOver && !attempts.some((a) => a.correct) && (
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

      {/* 정답 맞춤 */}
      {showResultModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>You Solved It!</h2>
            <div className="modal-buttons">
              <button
                onClick={() => navigate("/home")}
                className="modal-button"
              >
                Home
              </button>
              {typeof nextQuizId === "number" && (
                <button
                  onClick={() => navigate(`/quiz/${nextQuizId}`)}
                  className="modal-button"
                >
                  Next Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 시도 3번 실패 시 */}
      {showRetryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Fail to solve</h2>
            <p>1 heart has been deducted</p>
            <div className="modal-buttons">
              <button
                onClick={() => navigate("/home")}
                className="modal-button"
              >
                Home
              </button>
              {hearts > 0 && (
                <button onClick={handleKeepGoing} className="modal-button">
                  Keep going?
                </button>
              )}
              <button className="modal-button">
                Watch Ad to Restore Hearts
              </button>
            </div>
          </div>
        </div>
      )}
      {showHintModal && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h3>Hint ✨</h3>
            <p>{hint || "Sorry No Hint"}</p>
            <button
              onClick={() => setShowHintModal(false)}
              className="modal-button"
            >
              close
            </button>
          </div>
        </div>
      )}

      <CustomFooter />
    </div>
  );
};

export default Quiz;
