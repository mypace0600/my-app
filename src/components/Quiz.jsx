import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitAnswer } from "../services/api";

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState(null);
  const [wordLength, setWordLength] = useState(6); // POTATO 기준
  const maxAttempts = 4;

  // 퀴즈 시작 시 wordLength 설정 (API에서 받아왔다 가정)
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await startQuiz(); // 퀴즈 재호출로 길이 확인
        setWordLength(response.data.wordLength);
      } catch (err) {
        setError("Failed to load quiz");
      }
    };
    fetchQuizData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (guess.length !== wordLength) {
      setError(`Guess must be ${wordLength} letters`);
      return;
    }

    try {
      const response = await submitAnswer(quizId, guess);
      setAttempts([...attempts, response.data]);
      setGuess("");
      setError(null);
      if (response.data.correct) {
        alert("You won!");
        navigate("/home");
      } else if (attempts.length + 1 === maxAttempts) {
        alert("Game over!");
        navigate("/home");
      }
    } catch (err) {
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
        {attempt.feedback.map((fr, colIdx) => (
          <div key={colIdx} className={`tile ${fr.status}`}>
            {fr.letter}
          </div>
        ))}
      </div>
    ));

  return (
    <div className="quiz-container">
      <h1>Wordle Quiz</h1>
      <div className="word-length">{renderWordLength()}</div>
      <div className="attempts">{renderAttempts()}</div>
      {attempts.length < maxAttempts && !attempts.some((a) => a.correct) && (
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
    </div>
  );
};

export default Quiz;
