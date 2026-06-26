/**
 * @description Express middleware to validate request data against Zod schemas
 */

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    // Format error messages nicely
    const errors = result.error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    
    return res.status(400).json({
      success: false,
      message: result.error.errors[0]?.message || "Validation failed",
      errors,
    });
  }
  
  // Set parsed data back to req.body (preserves coercion/strip logic)
  req.body = result.data;
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    
    return res.status(400).json({
      success: false,
      message: result.error.errors[0]?.message || "Invalid path parameters",
      errors,
    });
  }
  
  req.params = result.data;
  next();
};
