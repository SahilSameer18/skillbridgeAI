import { z } from "zod";

export const profileUpdateSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(4, "Username must be at least 4 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores (no spaces)"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Enter a valid email address"),
  avatar: z.string().nullable().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Current password is required" })
      .min(1, "Current password is required"),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(8, "New password must be at least 8 characters")
      .max(72, "New password cannot exceed 72 characters")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
      .regex(/[0-9]/, "New password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "New password must contain at least one special character"),
    confirmPassword: z
      .string({ required_error: "Please confirm your new password" })
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
