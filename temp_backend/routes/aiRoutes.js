import express from "express"
import {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory
} from "../controllers/aiController.js"
import protect from "../middleware/auth.js"
import wrapAsync from "../middleware/wrapAsync.js"

const router = express.Router()

//Route to Generate FlashCards
router.post("/generate-flashcards" , protect ,wrapAsync(generateFlashcards))

//Route to Generate Quiz
router.post("/generate-quiz" , protect ,wrapAsync(generateQuiz))

//Route to Generate summary
router.post("/generate-summary" , protect ,wrapAsync(generateSummary))

//Route to Chat
router.post("/chat" , protect ,wrapAsync(chat))

//Route to Explain-Concept
router.post("/explain-concept" , protect ,wrapAsync(explainConcept))

//Route to Chat-History of particular document
router.get("/chat-history/:document" , protect ,wrapAsync(getChatHistory))

export default router