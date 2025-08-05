import { Link } from "react-router-dom";
import { routes } from "../App";
import Card from "../components/ui/Card";
import QuizLogo from "../components/ui/QuizLogo";
import QuestionBubble from "../assets/question-bubble.png";
import GreenCheckmark from "../assets/check-circle-green.svg";

function WelcomeScreen() {
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
        <Link to={routes.protectedRoutes.questions} className="link-btn">
          I’m Ready - Start the Quiz
        </Link>
      </Card>
    </section>
  );
}
export default WelcomeScreen;
