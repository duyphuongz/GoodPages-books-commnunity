import z from "zod";

const forgotPasswordSchema = z.object({
    oldPassword: z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    newPassword: z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmNewPassword: z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
}).refine((data) => data.newPassword == data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Password and Confirm Password is not matched"

});

export {
    forgotPasswordSchema
}