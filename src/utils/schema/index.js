import * as Yup from "yup";

/**
 * Login schema
 */
const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required("Email is a required field")
        .email("Invalid email format"),
    password: Yup.string()
        .required("Password is a required field")
        .min(8, "Password must be at least 8 characters"),
    checked: Yup.boolean(),
});

export {
    loginSchema,
}