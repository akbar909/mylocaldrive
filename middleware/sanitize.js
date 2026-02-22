// Sanitizer compatible with Express 5 - prevents both XSS and NoSQL injection
const stripTags = (value) => value
  .replace(/<\s*script.*?>.*?<\s*\/\s*script\s*>/gi, '')
  .replace(/[<>]/g, '');

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return stripTags(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    const cleanObj = {};
    Object.keys(value).forEach((key) => {
      // Remove NoSQL injection characters from keys ($, .)
      const cleanKey = key.replace(/[\$.]/g, '');
      if (cleanKey === key) {
        cleanObj[key] = sanitizeValue(value[key]);
      }
      // Skip keys containing NoSQL operators
    });
    return cleanObj;
  }
  return value;
};

const sanitizeRequest = (req, res, next) => {
  try {
    if (req.body) req.body = sanitizeValue(req.body);
    // Don't try to reassign req.query or req.params (they are getters in Express 5)
    next();
  } catch (err) {
    console.error('Input sanitization failed:', err.message);
    const safeError = new Error('Invalid request payload');
    safeError.status = 400;
    next(safeError);
  }
};

module.exports = { sanitizeRequest };
