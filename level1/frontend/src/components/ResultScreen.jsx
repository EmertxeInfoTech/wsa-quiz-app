import { useCallback, useMemo, useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import QuizLogo from "./ui/QuizLogo";
import RestartIcon from "../assets/restart-icon.svg";
import Trophy from "../assets/trophy.png";
import useQuestionContext from "../hooks/useQuestionContext";
import fetchQuestionsAPI from "../api/fetchQuestions";
import handleError from "../utils/handleError";

function RestartIconFC() {
  return <img src={RestartIcon} alt="" />;
}

function ResultScreen(props) {
  const { showQuestionScreen } = props;
  const [loading, setLoading] = useState(false);
  const { totalQuestions, correctAnswers, processQuestions } =
    useQuestionContext();

  // Show result text based on score
  const feedbackText = useMemo(
    function () {
      const percentage = (correctAnswers / totalQuestions) * 100;

      if (percentage >= 90) {
        return "EXCELLENT JOB!";
      } else if (percentage >= 70) {
        return "GOOD JOB!";
      } else if (percentage >= 50) {
        return "YOU DID OKAY.";
      } else {
        return "YOU COULD DO BETTER!";
      }
    },
    [correctAnswers, totalQuestions]
  );

  const handleResponse = useCallback(
    function (responseData) {
      processQuestions(responseData.questions);
      // Change screen
      showQuestionScreen();
    },
    [processQuestions, showQuestionScreen]
  );

  // Begin new quiz
  const beginQuiz = useCallback(
    function () {
      fetchQuestionsAPI(handleResponse, handleError, setLoading);
    },
    [handleResponse]
  );

  return (
    <section className="result-section">
      <QuizLogo size="large" />
      <Card className="result-card">
        <div className="result-icon-wrapper">
          <img src={Trophy} alt="" />
        </div>
        <h1 className="result-text">{feedbackText}</h1>
        <div className="result-details">
          <span className="correct-answers">{correctAnswers}</span>
          <p className="total-questions">
            Questions
            <br />
            out of <span className="weight-700">{totalQuestions}</span>
          </p>
        </div>
        <Button
          onClick={beginQuiz}
          loading={loading}
          loadingText="Restarting..."
          icon={<RestartIconFC />}
          iconPosition="right"
        >
          Restart
        </Button>
      </Card>
    </section>
  );
}

export default ResultScreen;
