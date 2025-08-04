const express = require("express");
const router = express.Router();
const QuestionModel = require("../models/question-model");

const MAX_QUESTION_COUNT = 30;

// get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await QuestionModel.aggregate([
      { $sample: { size: MAX_QUESTION_COUNT } }, // Fetch 30 random questions
      { $project: { question: 1, options: 1 } }, // remove the answer field
    ]);

    console.log(questions);
    res.status(200).json({ questions });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// check whether the anwer is correct or not
router.post("/validate-answer", async (req, res) => {
  try {
    const { id, answer } = req.body;

    if (!id || !answer || !answer.id || !answer.value) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const question = await QuestionModel.findById(id);

    if (!question) {
      return res.status(400).json({ message: "Question does not exist" });
    }

    if (
      question.answer.id === answer.id &&
      question.answer.value === answer.value
    ) {
      return res.status(200).json({ status: 1, message: "Correct anwer :)" });
    }

    return res.status(200).json({ status: 0, message: "Wrong answer :(" });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
