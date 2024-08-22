const express = require("express");
const path = require("path");

const indexRouter = require("./routes/indexRoute.js");
const signUpRouter = require("./routes/signUpRoute.js");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/static", express.static("public"));

app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);

app.listen(3000);
