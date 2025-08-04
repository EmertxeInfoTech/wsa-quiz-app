import { useCallback, useState } from "react";
import QuestionScreen from "./components/QuestionScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import QuestionProvider from "./store/QuestionProvider";
import ResultScreen from "./components/ResultScreen";

function App() {
  const [viewScreen, setViewScreen] = useState("welcome"); // Possible values: "welcome", "question", and "result"

  const showQuestionScreen = useCallback(() => setViewScreen("question"), []);
  const showResultScreen = useCallback(() => setViewScreen("result"), []);

  return (
    <QuestionProvider>
      {viewScreen === "welcome" && (
        <WelcomeScreen showQuestionScreen={showQuestionScreen} />
      )}
      {viewScreen === "question" && (
        <QuestionScreen showResultScreen={showResultScreen} />
      )}
      {viewScreen === "result" && (
        <ResultScreen showQuestionScreen={showQuestionScreen} />
      )}
    </QuestionProvider>
  );
}

export default App;
