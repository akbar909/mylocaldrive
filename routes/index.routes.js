const express = require("express");
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require("../middleware/validation");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

router.get("/login", (req, res) =>
  res.render("pages/login", { title: "User Login" })
);

router.get("/register", (req, res) =>
  res.render("pages/register", { title: "User Registration" })
);

router.post("/register", registerValidationRules(), validate, (req, res) => {
  const { username, email, password } = req.body;
  // Hash password with bcrypt using 10 salt rounds for security
  const hasPassword= bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hasPassword });
  // Persist user data to MongoDB database
  newUser
    .save()
    .then(() => res.send("User registered successfully"))
    .catch((err) => {
      console.error("Error registering user:", err);
      res.status(500).send("Server error");
    });
});

module.exports = router;
