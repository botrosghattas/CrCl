import * as zod from "zod";

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

export const registerSchema = zod
    .object({
        name: zod
            .string("Name must be a text")
            .nonempty("This field is required")
            .min(3, "Name must be 3 letters or more"),
        username: zod
            .string()
            .nonempty("This field is required")
            .regex(/^\S+$/, "No spaces allowed")
            .min(3, "username must be 3 characters or more"),
        gender: zod
            .string()
            .nonempty("Please select your gender")
            .refine(
                (value) => ["male", "female"].includes(value as string),
                "Gender must be male or female",
            ),
        email: zod
            .email("Enter a valid email Address"),
        dateOfBirth: zod
            .string()
            .nonempty("This field is required")
            .refine((date) => {
                return new Date(date) <= eighteenYearsAgo;
            }, "You must be at least 18 years old to continue."),
        password: zod
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !, @, #, $, %).",
            ),
        rePassword: zod.string(),
    })
    .refine((formValues) => formValues.password === formValues.rePassword, {
        path: ["rePassword"],
        error: "Passwords must match",
    });

export type registrationData = zod.infer<typeof registerSchema>