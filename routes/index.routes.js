const express = require("express");
// Import validation rules and auth middleware
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require("../middleware/validation");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { signToken, requireAuth } = require("../middleware/auth");

router.get("/register", (req, res) =>
  res.render("pages/register", {
    title: "User Registration",
    currentPage: "register",
  })
);

router.post(
  "/register",
  registerValidationRules(),
  validate,
  async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
      await newUser.save();
      return res.redirect(303, "/login");
    } catch (err) {
      if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue || {})[0] || "username";
        return res.status(409).render("errors/error", {
          title: "Registration Error",
          status: 409,
          message: "User already exists",
          errors: [{ msg: `${duplicateField} already exists` }],
        });
      }
      console.error("Error registering user:", err);
      return next(err);
    }
  }
);

router.get("/login", (req, res) =>
  res.render("pages/login", { title: "User Login", currentPage: "login" })
);

router.post(
  "/login",
  loginValidationRules(),
  validate,
  async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const existingUser = await User.findOne({ username });
      if (!existingUser) {
        return res.status(400).render("errors/error", {
          title: "Login Error",
          status: 400,
          message: "Invalid credentials",
          errors: [{ msg: "Invalid password or username" }],
        });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!passwordMatch) {
        return res.status(400).render("errors/error", {
          title: " Login Error",
          status: 400,
          message: "Invalid credentials",
          errors: [{ msg: "Invalid Password or username" }],
        });
      }

      const token = signToken(existingUser._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
      return res.json({ message: "Login successful", token });
    } catch (err) {
      console.error("Error logging in:", err);
      return next(err);
    }
  }
);

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return next(err);
  }
});

module.exports = router;
