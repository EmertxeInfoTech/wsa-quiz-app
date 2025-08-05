import QuestionContent from "../components/QuestionContent";
import QuestionHeader from "../components/QuestionHeader";

function QuestionScreen() {
  return (
    <section className="question-section">
      <QuestionHeader />
      <QuestionContent />
    </section>
  );
}

export default QuestionScreen;
