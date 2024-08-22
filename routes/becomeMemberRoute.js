const { Router } = require("express");
const queries = require("../db/queries.js");

require("dotenv").config();

const router = Router();

router.get("/", (req, res) => {
  let isFailure = req.query["isFailure"] === "true";
  res.render("become-member", { isFailure });
});
router.post("/", async (req, res) => {
  if (req.body["code"] === process.env.MEMBER_CODE) {
    await queries.updateMembership(req.user.id);
    res.redirect("/");
  } else {
    res.redirect("/become-member?isFailure=true");
  }
});
module.exports = router;
