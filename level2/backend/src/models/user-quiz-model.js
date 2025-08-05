const mongoose = require("mongoose");

const QUIZ_STATUS_PENDING = "pending";
const QUIZ_STATUS_COMPLETED = "completed";

const ANSWER_STATUS_PENDING = "pending";
const ANSWER_STATUS_RIGHT = "right";
const ANSWER_STATUS_WRONG = "wrong";

const userQuizSchema = new mongoose.Schema({
  user_id: String,
  quiz_status: {
    type: String,
    enum: [QUIZ_STATUS_PENDING, QUIZ_STATUS_COMPLETED],
  },
  questions: [
    {
      _id: false,
      question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
      attempted: Boolean,
      answer_status: {
        type: String,
        enum: [ANSWER_STATUS_PENDING, ANSWER_STATUS_RIGHT, ANSWER_STATUS_WRONG],
      },
      submitted_answer: {
        _id: false,
        id: Number,
        value: String,
      },
    },
  ],
  result: {
    correct_count: {
      type: Number,
      default: 0,
    },
    incorrect_count: {
      type: Number,
      default: 0,
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

userQuizSchema.methods.updateResult = function () {
  let result = this.questions.reduce(
    function (accumulator, currentValue) {
      if (currentValue.answer_status == ANSWER_STATUS_RIGHT) {
        accumulator["correct_count"] += 1;
      } else if (currentValue.answer_status == ANSWER_STATUS_WRONG) {
        accumulator["incorrect_count"] += 1;
      }
      return accumulator;
    },
    { correct_count: 0, incorrect_count: 0 }
  );

  this.result = result;
  this.save();
};

const UserQuiz =
  mongoose.models?.UserQuiz ||
  mongoose.model("UserQuiz", userQuizSchema, "user_quizzes");

module.exports = {
  UserQuiz,
  QUIZ_STATUS_PENDING,
  QUIZ_STATUS_COMPLETED,
  ANSWER_STATUS_PENDING,
  ANSWER_STATUS_RIGHT,
  ANSWER_STATUS_WRONG,
};
