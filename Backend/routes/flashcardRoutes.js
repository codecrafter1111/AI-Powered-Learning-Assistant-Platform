import express from "express"
import {
    getAllFlashcardSets,
    getFlashcards,
    reviewFlashcard,
    toggleStarFlashcard,
    deleteFlashcardSet} 
    from "../controllers/flashController.js"
import protect  from "../middleware/auth.js"
import wrapAsync from "../middleware/wrapAsync.js"

const router = express.Router()

// Route to get all FlashCard
router.get("/" ,protect,wrapAsync(getAllFlashcardSets))

// Route to get a particular FlashCard
router.get("/:documentId" ,protect,wrapAsync(getFlashcards))

// Route to post the review
router.post("/:cardId/review" , protect , wrapAsync(reviewFlashcard))

// Route to update the flash card
router.put("/:cardId/star" , protect ,wrapAsync(toggleStarFlashcard))

// Route to delete the flasha particular card
router.delete("/:id" ,protect,wrapAsync(deleteFlashcardSet))

export default router;