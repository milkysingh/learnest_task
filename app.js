const express = require("express");
const winston = require("winston");

const app = express();
const mongoose = require("mongoose");
const config = require("./config");

const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

mongoose.connect(config.mongoURL);

app.use(bodyParser.json());
require("./model/User");
require("./services/passport");
require("./routes/oauthRoutes")(app);
require("./routes/auth")(app);

app.get("/", (req, res) => {
  res.send("lol");
});

app.listen(port, () => {
  winston.log("info", `Server is running at port ${port}`);
});
module.exports = { app };
