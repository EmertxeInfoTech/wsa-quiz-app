import Card from "./ui/Card";
import QuizLogo from "./ui/QuizLogo";
import QuestionBubble from "../assets/question-bubble.png";
import GreenCheckmark from "../assets/check-circle-green.svg";
import Button from "./ui/Button";
import { useCallback, useState } from "react";
import useQuestionContext from "../hooks/useQuestionContext";
import handleError from "../utils/handleError";
import fetchQuestionsAPI from "../api/fetchQuestions";

function WelcomeScreen(props) {
  const { showQuestionScreen } = props;
  const { processQuestions } = useQuestionContext();
  const [loading, setLoading] = useState(false);

  const handleResponse = useCallback(
    function (responseData) {
      console.log(responseData.questions);
      processQuestions(responseData.questions);
      // Change screen
      showQuestionScreen();
    },
    [processQuestions, showQuestionScreen]
  );

  const beginQuiz = useCallback(
    function () {
      fetchQuestionsAPI(handleResponse, handleError, setLoading);
    },
    [handleResponse]
  );

  return (
    <section className="welcome-section">
      <QuizLogo size="large" />
      <Card className="welcome-card">
        <div className="welcome-card-content-top">
          <img src={QuestionBubble} width={172} alt="" />
          <h2>Are you ready?</h2>
          <h3>Let's see how many questions you can answer:</h3>
        </div>
        <ul className="welcome-card-list">
          <li className="list-item">
            <img src={GreenCheckmark} alt="" />
            There are 30 questions
          </li>
          <li className="list-item">
            <img src={GreenCheckmark} alt="" />
            You need to pick 1 answer
          </li>
        </ul>
        <Button
          size="large"
          onClick={beginQuiz}
          loading={loading}
          loadingText="Starting the Quiz..."
        >
          I’m Ready - Start the Quiz
        </Button>
      </Card>
    </section>
  );
}
export default WelcomeScreen;
