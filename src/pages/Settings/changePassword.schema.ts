import * as zod from "zod";

export const changePasswordSchema = zod
    .object({
        currentPassword: zod.string(),
        newPassword: zod
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !, @, #, $, %).",
            ),
        reNewPassword: zod.string()
    })
    .refine((formValues) => formValues.newPassword === formValues.reNewPassword, {
        path: ["rePassword"],
        error: "Passwords must match",
    });

export type changePasswordData = zod.infer<typeof changePasswordSchema>