import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuizDetails, submitAnswer } from "../services/api";

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState(null);
  const [wordLength, setWordLength] = useState(6);
  const [prevQuizId, setPrevQuizId] = useState(null);
  const [nextQuizId, setNextQuizId] = useState(null);
  const maxAttempts = 4;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetchQuizDetails(quizId);
        console.log("Quiz.jsx: fetchQuizDetails response:", response);
        setWordLength(response.wordLength);
        setPrevQuizId(response.prevQuizId);
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
      if (attempts.length + 1 === maxAttempts && !response.correct) {
        setTimeout(() => navigate("/home"), 2000); // 실패 후 2초 대기
      }
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);
      setError(err.response?.data?.error || "Failed to submit");
    }
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

  const isGameOver =
    attempts.length >= maxAttempts || attempts.some((a) => a.correct);

  return (
    <div className="quiz-container">
      <h1>Wordle Quiz</h1>
      <div className="word-length">{renderWordLength()}</div>
      <div className="attempts">{renderAttempts()}</div>
      {!isGameOver ? (
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
      ) : (
        <div className="navigation-buttons">
          <button
            onClick={() => navigate(`/quiz/${prevQuizId}`)}
            disabled={!prevQuizId}
            className="nav-button"
          >
            이전 문제 풀기
          </button>
          <button onClick={() => navigate("/home")} className="nav-button">
            홈
          </button>
          <button
            onClick={() => navigate(`/quiz/${nextQuizId}`)}
            disabled={!nextQuizId}
            className="nav-button"
          >
            다음 문제 풀기
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Quiz;
