import { z } from "zod";
export const serviceSchema = z.object({
  nameEn: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(200, { message: "Name must be at most 50 characters" }),
  nameAr: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(200, { message: "Name must be at most 50 characters" }),
  nameFr: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(200, { message: "Name must be at most 50 characters" }),

  highPrice: z
    .string()
    .min(1, { message: "Price must be a positive number" })
    .optional(),
  lowPrice: z
    .string()
    .min(1, { message: "Price must be a positive number" })
    .optional()  ,
    picture:z
    .array(z.string())
    .min(1,{message:"Name must be at least 2 characters"})
    ,
    descriptionEn:z
    .string()
    .min(1,{message:"Entre your english  Description  "})
    .optional(),
    descriptionFr:z
    .string()
    .min(1,{message:"Entre your french  Description  "})
    .optional(),
    descriptionAr:z
    .string()
    .min(1,{message:"Entre your Arabic  Description  "})
    .optional(),
});
export type ServiceSchema = z.infer<typeof serviceSchema>;