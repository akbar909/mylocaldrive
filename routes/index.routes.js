const express = require("express");
const {
  registerValidationRules,
  validate,
} = require("../middleware/validation");
const router = express.Router({ mergeParams: true });

router.get("/register", (req, res) =>
  res.render("pages/register", { title: "User Registration" })
);

router.post("/register", registerValidationRules(), validate, (req, res) => {
  const { username, email, password } = req.body;
  console.log(`Username: ${username}, Email: ${email}, Password: ${password}`);
  res.send("Registration successful!");
});

module.exports = router;
