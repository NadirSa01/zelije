"use client"
import { z } from "zod";
export const loginSchema = z.object({
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(1,{message:"Password must be at least 1 character long"}).max(100),
})  