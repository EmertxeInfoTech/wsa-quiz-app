import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "../components/ui/Card";
import ResultDonut from "../components/ResultDonut";
import ResultQuestion from "../components/ResultQuestion";
import useResultState from "../hooks/useResultState";
import ResultHeader from "../components/ResultHeader";
import {
  fetchAttemptsApi,
  fetchCompletedQuizApi,
} from "../store/thunks/resultThunk";

function ResultScreen() {
  const {
    incorrectAnswers,
    correctAnswers,
    attempts,
    noOfCorrectAnswers,
    noOfIncorrectAnswers,
    totalNoOfQuestions,
    loading,
    error,
    status,
  } = useResultState();
  const dispatch = useDispatch();

  const [displayCorrectAnswers, setDisplayCorrectAnswers] = useState(false);

  // If there are no incorrect answers, then display correct answers by default
  useEffect(() => {
    if (status && !noOfIncorrectAnswers) {
      // Above we check if status is truthy, because status sets to true only after data is fetched.
      setDisplayCorrectAnswers(true);
    }
  }, [noOfIncorrectAnswers, status]);

  useEffect(() => {
    dispatch(fetchCompletedQuizApi());
    dispatch(fetchAttemptsApi());
  }, [dispatch]);

  const displayQuestions = useMemo(
    () => (displayCorrectAnswers ? correctAnswers : incorrectAnswers),
    [correctAnswers, displayCorrectAnswers, incorrectAnswers]
  );

  const showCorrectAnswers = useCallback(function () {
    setDisplayCorrectAnswers(true);
  }, []);
  const showWrongAnswers = useCallback(function () {
    setDisplayCorrectAnswers(false);
  }, []);

  if (loading) {
    return (
      <section className="result-section">
        <ResultHeader />
        <div className="result-content">
          <p className="font-large">Loading...</p>
        </div>
      </section>
    );
  }
  if (Boolean(error)) {
    return (
      <section className="result-section">
        <ResultHeader />
        <div className="result-content error response-error">
          <p className="font-large">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="result-section">
      <ResultHeader />
      <div className="result-content">
        <Card className="result-card">
          <div className="card-heading">Score Board</div>
          <div className="left-card-content">
            <center className="total-quizzes-text">
              You Have{" "}
              <strong>
                Played a Total
                <br />
                {attempts} Quizzes
              </strong>{" "}
            </center>
            <ResultDonut
              score={noOfCorrectAnswers}
              totalQuestions={totalNoOfQuestions}
            />
            <div className="quiz-stats">
              <div className="completions">
                <span className="stat">100%</span>
                Completions
              </div>
              <div className="total-questions">
                <span className="stat">{totalNoOfQuestions}</span>
                Total Questions
              </div>
              <div className="correct-answers" onClick={showCorrectAnswers}>
                <span className="stat">{noOfCorrectAnswers}</span>
                Correct Answers!
              </div>
              <div className="wrong-answers" onClick={showWrongAnswers}>
                <span className="stat">{noOfIncorrectAnswers}</span>
                Wrong Answers!
              </div>
            </div>
          </div>
        </Card>
        <Card className="result-card">
          <div className="card-heading">Your Answers</div>
          <div className="right-card-content">
            {displayQuestions.length ? (
              displayQuestions.map((question, index) => {
                return (
                  <ResultQuestion
                    key={"result-" + question.question_id}
                    question={question}
                    number={index + 1}
                    displayCorrectAnswers={displayCorrectAnswers}
                  />
                );
              })
            ) : (
              <p className="no-questions-text">No answers found!</p>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

export default ResultScreen;
