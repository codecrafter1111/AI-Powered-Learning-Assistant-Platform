import express from "express"
import {getDashboard} from "../controllers/progressController.js"
import protect from "../middleware/auth.js"
import wrapAsync from "../middleware/wrapAsync.js"

const router = express.Router()

//Route for Dashboard
router.get("/dashboard" , protect ,wrapAsync(getDashboard))

export default router;