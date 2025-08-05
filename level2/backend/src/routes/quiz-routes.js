const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/user-middleware");
const QuestionModel = require("../models/question-model");
const User = require("../models/user-model");

const {
  UserQuiz: UserQuizModel,
  QUIZ_STATUS_PENDING,
  ANSWER_STATUS_PENDING,
  QUIZ_STATUS_COMPLETED,
} = require("../models/user-quiz-model");

// allow user to submit the quiz which will then be marked completed if all question are attempted
router.post("/submit", authenticateUser, async (req, res) => {
  try {
    let userCurrentQuiz = await UserQuizModel.findOne({
      user_id: req.user._id,
      quiz_status: QUIZ_STATUS_PENDING,
    });

    if (!userCurrentQuiz) {
      return res
        .status(500)
        .json({ success: false, message: "No active quiz for the user" });
    }

    let incompleteFlag = false; // Assuming quiz is completed
    userCurrentQuiz.questions.forEach((question, index) => {
      if (question.attempted === false) {
        incompleteFlag = true;
        return;
      }
    });

    if (incompleteFlag) {
      return res.status(500).json({
        success: false,
        message: "Please attempt all the questions before submitting the quiz",
      });
    }

    // all the questions are now attempted, complete the quiz
    userCurrentQuiz.quiz_status = QUIZ_STATUS_COMPLETED;
    userCurrentQuiz.save();

    // increase the attempt count of quiz for the user
    const user = await User.findOne({ _id: req.user._id });
    user.quiz_attempts = user.quiz_attempts + 1;
    user.save();

    let incorrect_questions = [];
    let correct_questions = [];

    // send the data of the correct and wrong answers to the user to be shown on the click of the pie chart
    for (const userQuestion of userCurrentQuiz.questions) {
      const questionModel = await QuestionModel.findById(
        userQuestion.question_id
      );

      console.log(typeof userQuestion);
      console.log(userQuestion);

      let _data = {
        question_id: userQuestion.question_id,
        question: questionModel.question,
        answer: questionModel.answer,
        attempted: userQuestion.attempted,
        answer_status: userQuestion.answer_status,
        submitted_answer: userQuestion.submitted_answer,
      };

      if (
        questionModel.answer.id === userQuestion.submitted_answer.id &&
        questionModel.answer.value === userQuestion.submitted_answer.value
      ) {
        correct_questions.push(_data);
      } else {
        incorrect_questions.push(_data);
      }
    }

    return res.send({
      status: true,
      result: userCurrentQuiz.result,
      incorrect_questions,
      correct_questions,
    });
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/completed-quiz-questions", authenticateUser, async (req, res) => {
  try {
    // find the user's latest submitted quiz in decending order
    const userCurrentQuiz = await UserQuizModel.find({
      user_id: req.user._id,
      quiz_status: QUIZ_STATUS_COMPLETED,
    }).sort({
      created_at: -1,
    });

    let incorrect_questions = [];
    let correct_questions = [];

    if (userCurrentQuiz.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: 'No Quiz for the user found' });
    }

    for (const userQuestion of userCurrentQuiz[0].questions) {
      const questionModel = await QuestionModel.findById(
        userQuestion.question_id
      );

      let _data = {
        question_id: userQuestion.question_id,
        question: questionModel.question,
        answer: questionModel.answer,
        attempted: userQuestion.attempted,
        answer_status: userQuestion.answer_status,
        submitted_answer: userQuestion.submitted_answer,
      };

      if (
        questionModel.answer.id === userQuestion.submitted_answer.id &&
        questionModel.answer.value === userQuestion.submitted_answer.value
      ) {
        correct_questions.push(_data);
      } else {
        incorrect_questions.push(_data);
      }
    }

    return res.send({
      status: true,
      result: userCurrentQuiz.result,
      incorrect_questions,
      correct_questions,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
