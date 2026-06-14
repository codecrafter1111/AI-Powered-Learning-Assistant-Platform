import express from "express";
import { register, login, getprofile, updateProfile, changePassword } from "../controllers/authController.js"
import protect from "../middleware/auth.js";
import { registerValidate, loginValidate } from "../middleware/validateMiddleware.js"
import wrapAsync from "../middleware/wrapAsync.js";

const router = express.Router();
 
         // Public Routes

//Route for register the user
router.post("/register", registerValidate, wrapAsync(register));
//Route for login the exist user
router.post("/login", loginValidate, wrapAsync(login));

        // Protected Routes

// Route for profile
router.get("/profile", protect, wrapAsync(getprofile));
// Route for update profile
router.put("/profile", protect, wrapAsync(updateProfile));
// Route for update password
router.post("/change-password", protect, wrapAsync(changePassword));


export default router;