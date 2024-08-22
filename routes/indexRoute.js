const { Router } = require("express");

const queries = require("../db/queries.js");

const router = Router();

router.get("/", async (req, res) => {
  let user = req.user;
  let messages = await queries.getMessages();
  res.render("index", { user, messages });
});

module.exports = router;
