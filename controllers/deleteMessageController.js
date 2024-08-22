const queries = require("../db/queries.js");

const deleteMessageController = async (req, res) => {
  let messageId = req.query["messageId"];
  await queries.deleteMessage(messageId);
  res.redirect("/");
};

module.exports = deleteMessageController;
