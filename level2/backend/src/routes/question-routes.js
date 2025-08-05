const express = require("express");
const router = express.Router();
const QuestionModel = require("../models/question-model");

const {
  UserQuiz: UserQuizModel,
  QUIZ_STATUS_PENDING,
  ANSWER_STATUS_PENDING,
  ANSWER_STATUS_RIGHT,
  ANSWER_STATUS_WRONG,
} = require("../models/user-quiz-model");
const authenticateUser = require("../middlewares/user-middleware");

const MAX_QUESTION_COUNT = 30;

// This will now be user specific
router.get("/", authenticateUser, async (req, res) => {
  try {
    // get the incomplete quiz of the user
    let userCurrentQuiz = await UserQuizModel.findOne({
      user_id: req.user._id,
      quiz_status: QUIZ_STATUS_PENDING,
    });

    if (!userCurrentQuiz) {
      // create questions for the user and store in the DB for furthre reference
      let newQuestions = await QuestionModel.aggregate([
        { $sample: { size: MAX_QUESTION_COUNT } }, // Fetch 30 random questions
        { $project: { question: 1, options: 1 } }, // remove the answer field
      ]);

      const userNewQuestions = newQuestions.map(function (question) {
        return {
          question_id: question._id,
          attempted: false,
          answer_status: ANSWER_STATUS_PENDING,
        };
      });

      userCurrentQuiz = await new UserQuizModel({
        user_id: req.user._id,
        quiz_status: QUIZ_STATUS_PENDING,
        questions: userNewQuestions,
      }).save();
    }

    let userQuizQuestions = userCurrentQuiz.questions.reduce(function (
      accumulator,
      currentValue
    ) {
      accumulator[currentValue.question_id] = currentValue;
      return accumulator;
    },
    {});

    const _questions = await QuestionModel.find({
      _id: { $in: Object.keys(userQuizQuestions) },
    }).select("question options");

    let questions = _questions.map(function (question) {
      let obj = { ...question._doc }; // TODO: check why entire mongo data is being used in ...question and _doc is required
      obj["attempted"] = userQuizQuestions[question._doc._id]["attempted"];
      obj["answer_status"] =
        userQuizQuestions[question._doc._id]["answer_status"];
      return obj;
    });

    return res.send({ questions });
  } catch (err) {
    console.error("Error fetching questions:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// check whether the anwer is correct or not
router.post("/validate-answer", authenticateUser, async (req, res) => {
  try {
    const { id, answer } = req.body;

    if (!id || !answer || !answer.id || !answer.value) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const question = await QuestionModel.findById(id);

    if (!question) {
      return res.status(400).json({ message: "Question does not exist" });
    }

    let answerStatus = false;
    if (
      question.answer.id === answer.id &&
      question.answer.value === answer.value
    ) {
      answerStatus = true;
    }

    // update the status of the question irrespective if it's correct or wrong
    const updatedUserQuiz = await UserQuizModel.findOneAndUpdate(
      {
        "questions.question_id": id,
        user_id: req.user._id,
        quiz_status: QUIZ_STATUS_PENDING,
      },
      {
        $set: {
          "questions.$.attempted": true,
          "questions.$.answer_status": answerStatus
            ? ANSWER_STATUS_RIGHT
            : ANSWER_STATUS_WRONG,
          "questions.$.submitted_answer": answer,
        },
      },
      { new: true } // To return the updated document which we are not using as of now
    );
    // for every question validation update the result
    // this can also be done at quiz submission, but this will be real time
    await updatedUserQuiz?.updateResult();

    return res.status(200).json({
      status: answerStatus ? 1 : 0,
      message: answerStatus ? "Correct anwer :)" : "Wrong answer :(",
      submitted_answer: answer,
      correct_answer: question.answer,
    });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
