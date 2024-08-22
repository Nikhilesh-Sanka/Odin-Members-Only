const { Router } = require("express");

const router = Router();

const createMessageController = require("../controllers/createMessageController.js");

router.get("/", (req, res) => {
  res.render("createMessageForm");
});
router.post("/", createMessageController);

module.exports = router;
