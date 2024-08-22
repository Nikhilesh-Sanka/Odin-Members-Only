const express = require("express");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const pool = require("./db/pool.js");
const bcrypt = require("bcryptjs");

const indexRouter = require("./routes/indexRoute.js");
const signUpRouter = require("./routes/signUpRoute.js");
const becomeMemberRouter = require("./routes/becomeMemberRoute.js");
const becomeAdminRouter = require("./routes/becomeAdminRoute.js");
const createMessageRouter = require("./routes/createMessageRoute.js");

const deleteMessageController = require("./controllers/deleteMessageController");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({ secret: "some secret", resave: false, saveUninitialized: false })
);
app.use(passport.session());

//Passport code//
let strategy = new LocalStrategy(async (username, password, done) => {
  try {
    let { rows } = await pool.query(`SELECT * FROM users WHERE username = $1`, [
      username.toLowerCase(),
    ]);
    let user = rows[0];
    if (user) {
      let doesPasswordMatch = await bcrypt.compare(password, user.password);
      if (doesPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect Password" });
      }
    } else {
      return done(null, false, { message: "incorrect password" });
    }
  } catch (err) {
    done(err);
  }
});

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    let { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);
    let user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});
//Passport code//

// Routing the server//
app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);
app.get("/log-in", (req, res) => {
  let isFailure = req.query["isFailure"] === "true" ? true : false;
  res.render("log-in", { isFailure });
});
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in?isFailure=true",
  })
);
app.use("/become-member", becomeMemberRouter);
app.use("/become-admin", becomeAdminRouter);
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});
app.use("/create-message", createMessageRouter);
app.get("/deleteMessage", deleteMessageController);

// Routing the server //

app.listen(3000);

module.exports = {};
