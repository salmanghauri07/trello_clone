import { z } from "zod";

/**
 * Expected body:
 * {
 *   name: "Salman",
 *   email: "salman@example.com",
 *   password: "secret123",
 *   company: "Acme Inc"   // optional, string
 * }
 */

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .transform((s) => s.trim()),

  email: z
    .string()
    .email("Invalid email address")
    .transform((s) => s.toLowerCase().trim()),

  password: z.string().min(6, "Password must be at least 6 characters"),

  company: z
    .string()
    .optional()
    .transform((s) => (s ? s.trim() : undefined)),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((s) => s.toLowerCase().trim()),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const otpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export default {
  signupSchema,
  loginSchema,
  otpSchema,
};
