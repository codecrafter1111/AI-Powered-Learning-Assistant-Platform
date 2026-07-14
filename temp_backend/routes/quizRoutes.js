import express from "express"
import {
    getQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz
} from "../controllers/quizController.js"
import wrapAsync from "../middleware/wrapAsync.js"
import protect from "../middleware/auth.js"

const router = express.Router()

// Route to Get all Quizzes
router.get("/:documentId",protect,wrapAsync(getQuizzes))


// Route to Get particular Quizzes by its id
router.get("/quiz/:id",protect,wrapAsync(getQuizById))


// Route to Get all Quizzes
router.post("/:id/submit",protect,wrapAsync(submitQuiz))


// Route to Get all Quizzes
router.get("/:id/result",protect,wrapAsync(getQuizResults))


// Route to Get all Quizzes
router.delete("/:id",protect,wrapAsync(deleteQuiz))


export default router