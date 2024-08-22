const { Router } = require("express");

const signUpController = require("../controllers/signUpController");

const router = new Router();

router.get("/", (req, res) => {
  res.render("sign-up");
});

module.exports = router;
