const { Router } = require("express");
const queries = require("../db/queries.js");

require("dotenv").config();

const router = Router();

router.get("/", (req, res) => {
  let isFailure = req.query["isFailure"] === "true";
  res.render("become-admin", { isFailure });
});
router.post("/", async (req, res) => {
  if (req.body["code"] === process.env.ADMIN_CODE) {
    await queries.updateAdminShip(req.user.id);
    res.redirect("/");
  } else {
    res.redirect("/become-admin?isFailure=true");
  }
});

module.exports = router;
