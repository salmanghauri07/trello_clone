// validations/boardValidation.js
import { z } from "zod";

export const createBoardSchema = z.object({
  title: z
    .string()
    .min(3, "Board name must be at least 3 characters long")
    .max(50, "Board name cannot exceed 50 characters"),
  description: z
    .string()
    .max(255, "Description cannot exceed 255 characters")
    .optional(),
});
