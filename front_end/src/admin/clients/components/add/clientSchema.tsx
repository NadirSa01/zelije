"use client"
import { z } from "zod";
export const clientSchema = z.object({
    fullName: z.string().min(2,{message:"Full name must be at least 2 characters long"}).max(100),
    telephone: z.string().min(10,{message:"Telephone must be at least 10 characters long"}).max(15),
    city: z.string().min(2,{message:"City must be at least 2 characters long"}).max(100),
    address: z.string().min(5,{message:"Address must be at least 5 characters long"}).max(300),
})
export type ClientSchema = z.infer<typeof clientSchema>;