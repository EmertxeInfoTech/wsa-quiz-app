var questionRoutes = require("./question-routes");
var userRoutes = require("./user-routes");
var quizRoutes = require("./quiz-routes");

module.exports = function (app) {
  app.use("/questions", questionRoutes);
  app.use("/user", userRoutes);
  app.use("/quiz", quizRoutes);
};
