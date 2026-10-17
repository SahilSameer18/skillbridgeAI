import { z } from "zod";

export const updateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .optional(),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .toLowerCase()
    .optional(),
  avatar: z.string().nullable().optional(),
  currentPassword: z.string().min(1, "Current password is required to change email address").max(72).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: "Current password is required" })
    .min(1, "Current password is required")
    .max(72, "Password cannot exceed 72 characters"),
  newPassword: z
    .string({ required_error: "New password is required" })
    .trim()
    .min(8, "New password must be at least 8 characters")
    .max(72, "New password cannot exceed 72 characters (bcrypt limit)")
    .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
    .regex(/[0-9]/, "New password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "New password must contain at least one special character"),
});

