import { ZodError } from "zod";
import messages from "../config/messages.js";
import ApiResponse from "../utils/apiResponse.js";

function validateSchema(schema) {
  return async function (req, res, next) {
    try {
      const parsed = await schema.parseAsync(req.body);
      const body = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        // ZodError contains `errors` array with details
        const formattedErrors = err.issues.map((e) => ({
          path: e.path.join("."), // which field failed
          message: e.message, // validation message
        }));

        return ApiResponse.error(res, formattedErrors, 400);
      }
      // fallback for unexpected errors
      return ApiResponse.error(res, messages.VALIDATION_ERROR, 400);
    }
  };
}

export default validateSchema;
