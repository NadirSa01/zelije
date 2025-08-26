"use client";
import { z } from "zod";
export const detailSchema = z.object({
  id: z.string(),
  colorEn: z
    .string()
    .min(2, { message: "Color must be at least 2 characters" })
    .max(50, { message: "Color must be at most 50 characters" }),

  colorAr: z
    .string()
    .min(2, { message: "Color must be at least 2 characters" })
    .max(50, { message: "Color must be at most 50 characters" }),

  colorFr: z
    .string()
    .min(2, { message: "Color must be at least 2 characters" })
    .max(50, { message: "Color must be at most 50 characters" }),

  colorCode: z
    .string()
    .length(7, { message: "Color code must be exactly 7 characters" })
    .regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Color code must be a valid hex code",
    }),
  quantity: z
    .number()
    .min(1, { message: "Quantity must be at least 1" })
    .optional(),
  picture: z.string().min(2).optional(),
});
export const productSchema = z.object({
  nameEn: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  nameAr: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  nameFr: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),

  price: z
    .string()
    .min(1, { message: "Price must be a positive number" })
    .optional(),
  size: z
    .string()
    .min(2, { message: "Size must be at least 2 characters" })
    .max(50, { message: "Size must be at most 50 characters" }),
  details: z.array(detailSchema).min(1, { message: "At least one detail is required." }),

});
export type ProductSchema = z.infer<typeof productSchema>;
export type DetailSchema = z.infer<typeof detailSchema>;
