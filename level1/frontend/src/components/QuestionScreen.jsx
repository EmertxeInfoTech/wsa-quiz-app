import QuestionContent from "./QuestionContent";
import QuestionHeader from "./QuestionHeader";

function QuestionScreen(props) {
  const { showResultScreen } = props;
  return (
    <section className="question-section">
      <QuestionHeader />
      <QuestionContent showResultScreen={showResultScreen} />
    </section>
  );
}

export default QuestionScreen;
