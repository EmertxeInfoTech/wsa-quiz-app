let questionRoutes = require("./question-routes");

module.exports = function (app) {
  app.use("/v1/questions", questionRoutes);
};
