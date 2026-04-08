const ApiError = require('../utils/apiError');

/**
 * Creates a validation middleware using a Zod schema.
 * Validates req.body against the provided schema.
 * Input: zodSchema — a Zod schema object
 * Output: middleware function that validates or throws 400
 */
function validate(zodSchema) {
  return (req, res, next) => {
    try {
      const parsed = zodSchema.parse(req.body);
      req.body = parsed; // Replace body with parsed (coerced/stripped) data
      next();
    } catch (error) {
      const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      next(ApiError.badRequest(messages));
    }
  };
}

module.exports = validate;
