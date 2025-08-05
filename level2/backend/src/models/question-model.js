const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [
    {
      id: Number,
      value: String,
    },
  ],
  answer: {
    _id: false,
    id: Number,
    value: String,
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

module.exports =
  mongoose.models?.QuestionModel ||
  mongoose.model('QuestionModel', questionSchema, 'questions');
