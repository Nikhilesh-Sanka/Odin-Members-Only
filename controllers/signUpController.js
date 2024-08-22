const { body, validationResult } = require("express-validator");
const queries = require("../db/queries");

require("dotenv").config();

const validateInputs = [
  body("first-name")
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty"),
  body("first-name")
    .optional({ checkFalsy: true })
    .isAlpha()
    .withMessage("First name should only contain alphabets"),
  body("last-name")
    .optional({ checkFalsy: true })
    .isAlpha()
    .withMessage("Last name should only contain alphabets if specified"),
  body("username").trim().notEmpty().withMessage("User name cannot be empty"),
  body("user-name")
    .optional({ checkFalsy: true })
    .isAlpha({ ignore: [" "] })
    .withMessage("User name should only contain alphabets"),
  body("username").custom(async (value) => {
    let doesUserExist = await queries.doesUserExists(value);
    if (doesUserExist) {
      throw new Error("username already exists, use something new");
    }
  }),
  body("password")
    .custom((value) => {
      let lengthResult = value.length >= 8;
      let capitalResult = /[A-Z]/.test(value);
      let numberResult = /[0-9]/.test(value);
      return lengthResult && capitalResult && numberResult;
    })
    .withMessage(
      "password should have a length of at least 8 and should contain a number and a capital letter "
    ),
  body("confirm-password")
    .custom((value, { req }) => {
      return req.body["password"] === value;
    })
    .withMessage(
      "confirm password field and password field's are not matching"
    ),
];

const signUpController = [
  validateInputs,
  async (req, res, next) => {
    let errors = validationResult(req).errors;
    let firstName = req.body["first-name"];
    let lastName = req.body["last-name"];
    let userName = req.body["username"];
    let password = req.body["password"];
    let isMember =
      req.body["status-code"] === process.env.MEMBER_CODE ||
      req.body["status-code"] === process.env.ADMIN_CODE
        ? "true"
        : "false";
    let isAdmin =
      req.body["status-code"] === process.env.ADMIN_CODE ? "true" : "false";

    if (errors.length === 0) {
      await queries.addUser(
        firstName,
        lastName,
        userName,
        password,
        isMember,
        isAdmin
      );
      next();
    } else {
      res.render("sign-up", {
        errors,
        firstName,
        lastName,
        userName,
        password,
      });
    }
  },
];

module.exports = signUpController;
