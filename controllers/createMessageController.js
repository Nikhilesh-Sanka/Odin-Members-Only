const queries = require("../db/queries.js");
const { body, validationResult } = require("express-validator");

const validateInput = [
  body("message").trim().notEmpty().withMessage("Message cannot be empty"),
];

const createMessageController = [
  validateInput,
  async (req, res) => {
    let errors = validationResult(req).errors;
    if (errors.length === 0) {
      await queries.addMessage(req.body["message"], req.user.id);
      res.redirect("/");
    } else {
      res.render("createMessageForm", { errors });
    }
  },
];

module.exports = createMessageController;
