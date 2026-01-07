const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router({ mergeParams: true });

// Validation middleware
const registerValidationRules = () => {
  return [
    body("username")
      .trim()
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
      .isLength({ max: 20 }).withMessage("Username must be less than 20 characters")
      .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),
    
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Please enter a valid email address"),
    
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/).withMessage("Password must contain at least one number")
  ];
};

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/register", (req, res) => res.render("pages/register", { title: "User Registration" }));

router.post("/register", registerValidationRules(), validate, (req, res) => {
  const { username, email, password } = req.body;
  console.log(`Username: ${username}, Email: ${email}, Password: ${password}`);
  res.status(200).json({ message: "Registration successful!", user: { username, email } });
});

// Error handling route
router.get("/error", (req, res) => {
  res.status(400).render("errors/error", {
    title: "Error",
    status: 400,
    message: "Bad Request",
    details: "Something went wrong. Please try again."
  });
});

// 404 handler
router.use((req, res) => {
  res.status(404).render("errors/error", {
    title: "Page Not Found",
    status: 404,
    message: "Page Not Found",
    details: "The page you are looking for does not exist."
  });
});

module.exports = router;
