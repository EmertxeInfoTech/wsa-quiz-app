const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  options: [
    {
      id: Number,
      value: String,
    },
  ],
  answer: {
    id: Number,
    value: String,
  },
});

module.exports =
  mongoose.models?.Question ||
  mongoose.model("Question", questionSchema, "questions");
