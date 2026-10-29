import * as zod from "zod";

export const loginSchema = zod
    .object({
        email: zod
            .email("Enter a valid email Address"),
        password: zod
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !, @, #, $, %).",
            ),
    });

export type loginData = zod.infer<typeof loginSchema>