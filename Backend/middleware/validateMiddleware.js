import { body } from "express-validator";

// Validation middlewares
export const registerValidate = [
    body("name")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long"),
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email address"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];

// Validation middlewares
export const loginValidate = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email address"),
    body("password")
        .notEmpty()
        .withMessage("Password must be at least 6 characters long")
];

