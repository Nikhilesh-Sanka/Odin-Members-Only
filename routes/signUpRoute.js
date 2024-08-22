const { Router } = require("express");

const signUpController = require("../controllers/signUpController");

const router = new Router();

router.get("/", (req, res) => {
  res.render("sign-up");
});
router.post("/", signUpController);

module.exports = router;
