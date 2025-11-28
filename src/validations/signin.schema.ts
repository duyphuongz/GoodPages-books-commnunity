import z from "zod";

const signInSchema = z.object({
    username: z.string().min(1, "username is required"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

export default signInSchema;