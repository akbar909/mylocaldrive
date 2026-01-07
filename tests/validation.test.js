const { registerValidationRules, validate } = require("../middleware/validation");
const { body, validationResult } = require("express-validator");

describe("Registration Validation Middleware", () => {
  
  describe("Username Validation", () => {
    
    test("should fail if username is less than 3 characters", async () => {
      const rules = registerValidationRules();
      const usernameRule = rules[0];
      
      const req = { body: { username: "ab" } };
      await usernameRule.run(req);
      const errors = validationResult(req);
      
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].msg).toContain("at least 3 characters");
    });

    test("should fail if username contains special characters", async () => {
      const rules = registerValidationRules();
      const usernameRule = rules[0];
      
      const req = { body: { username: "test@user" } };
      await usernameRule.run(req);
      const errors = validationResult(req);
      
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].msg).toContain("letters, numbers, and underscores");
    });

    test("should pass with valid username", async () => {
      const rules = registerValidationRules();
      const usernameRule = rules[0];
      
      const req = { body: { username: "testuser123" } };
      await usernameRule.run(req);
      const errors = validationResult(req);
      
      expect(errors.isEmpty()).toBe(true);
    });
  });

  describe("Email Validation", () => {
    
    test("should fail if email is invalid", async () => {
      const rules = registerValidationRules();
      const emailRule = rules[1];
      
      const req = { body: { email: "testgmail.com" } };
      await emailRule.run(req);
      const errors = validationResult(req);
      
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].msg).toContain("valid email");
    });

    test("should pass with valid email", async () => {
      const rules = registerValidationRules();
      const emailRule = rules[1];
      
      const req = { body: { email: "test@gmail.com" } };
      await emailRule.run(req);
      const errors = validationResult(req);
      
      expect(errors.isEmpty()).toBe(true);
    });
  });

  describe("Password Validation", () => {
    
    test("should fail if password is less than 8 characters", async () => {
      const rules = registerValidationRules();
      const passwordRule = rules[2];
      
      const req = { body: { password: "Test123" } };
      await passwordRule.run(req);
      const errors = validationResult(req);
      
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].msg).toContain("at least 8 characters");
    });

    test("should fail if password has no uppercase", async () => {
      const rules = registerValidationRules();
      const passwordRule = rules[2];
      
      const req = { body: { password: "test@1234" } };
      await passwordRule.run(req);
      const errors = validationResult(req);
      
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].msg).toContain("uppercase letter");
    });

    test("should fail if password has no number", async () => {
      const rules = registerValidationRules();
      const passwordRule = rules[2];
      
      const req = { body: { password: "TestUser" } };
      await passwordRule.run(req);
      const errors = validationResult(req);
      
      expect(errors.isEmpty()).toBe(false);
    });

    test("should pass with valid password", async () => {
      const rules = registerValidationRules();
      const passwordRule = rules[2];
      
      const req = { body: { password: "Test@1234" } };
      await passwordRule.run(req);
      const errors = validationResult(req);
      
      expect(errors.isEmpty()).toBe(true);
    });
  });

  describe("Validate Middleware", () => {
    
    test("should call next() if no errors", (done) => {
      const req = {
        body: {
          username: "testuser",
          email: "test@gmail.com",
          password: "Test@1234"
        }
      };
      
      const res = {};
      const next = jest.fn(() => done());
      
      validate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test("should render error page if validation fails", async () => {
      const req = {
        body: {
          username: "ab",
          email: "invalid",
          password: "weak"
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        render: jest.fn()
      };
      
      // Run validations
      const rules = registerValidationRules();
      for (const rule of rules) {
        await rule.run(req);
      }
      
      validate(req, res, () => {});
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.render).toHaveBeenCalledWith(
        "errors/error",
        expect.objectContaining({
          title: "Validation Error",
          status: 400,
          message: "Validation Error"
        })
      );
    });
  });
});
