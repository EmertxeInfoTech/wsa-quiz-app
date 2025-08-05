const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

require("dotenv").config({ path: "local.env" });
// require('dotenv').config({ path: '.env.local' });

mongoose.connect(process.env.DATABASE_URI);
mongoose.connection.on("error", (error) => {
  console.log("Unable to connect to MongoDB server");
  console.error(error.message);
});

const startHttpServer = async function () {
  const app = express();

  app.set("serverTimeout", 5000);

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "pug");
  app.use(express.static(path.join(__dirname, "public")));

  // used to accept Content-Type = application/json in req.body
  app.use(express.json());

  // used to accept Content-Type = application/x-www-form-urlencoded in req.body
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  // Enable Cross-Origin Resource Sharing (CORS) for all origins. This is useful
  // for development, but in a production environment you would probably want
  // to limit this to only trusted origins.
  app.use(cors());

  // import all the routes and keep the code clean
  require("./routes")(app);
  // require("./routes/index")(app);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    res.status(404).send();
    // next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.ENVIRONMENT === "DEVELOPMENT" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });

  const server = http.createServer(app).listen(process.env.SERVER_PORT, () => {
    console.log(
      `Created server listening on port ${
        process.env.SERVER_PORT
      } ${Date.now()}`
    );
  });

  return server;
};

const startTime = new Date();
startHttpServer().then(async () => {
  console.log(`HTTP server started. Time taken: ${new Date() - startTime}`);
});
