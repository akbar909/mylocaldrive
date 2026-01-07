const { body, validationResult } = require("express-validator");

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
    return res.status(400).render("errors/error", {
      title: "Validation Error",
      status: 400,
      message: "Validation Error",
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  registerValidationRules,
  validate
};
