import Logo from "../../assets/quiz-logo.svg";

const allSizes = {
  small: 168, // value is in pixels
  large: 306, // value is in pixels
};

// size prop can have 2 values as per above object: "small" and "large"
// Assign default value `small` to size prop if it is not passed
export default function QuizLogo({ size = "small" }) {
  return <img src={Logo} alt="Quiz logo" width={allSizes[size]} />;
}
