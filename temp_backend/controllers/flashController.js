import mongoose from "mongoose";
import Flashcard from "../models/FlashCard.js";

// @desc     Get the All Flashcard for a document
// @route   GET /api/flashcards/:documentId
// @access  Private
export const getFlashcards = async (req,res,next) =>{
    try{
        const flashCards = await Flashcard.find({userId:req.user._id,documentId:req.params.documentId})
        .populate("documentId" , "title fileName")
        .sort({createdAt:-1})

    // console.log(flashCards)
    res.status(200).json({
        success:true,
        count:flashCards.length,
        data:flashCards
    })
    }catch(error){
        next(error)
    }
}



// @desc    Get the All Flashcard sets for the user
// @route   GET /api/flashcards
// @access  Private
export const getAllFlashcardSets = async (req,res,next) =>{
    try{
        const flashcardSets = await Flashcard.find({userId:req.user._id})
        .populate("documentId" , "title fileName")
        .sort({createdAt:-1})
        // console.log(flashcardSets)
    res.status(200).json({
        success:true,
        count:flashcardSets.length,
        data:flashcardSets
    })
    }catch(error){
        next(error)
    }
}



// @desc    Mark flashcard as Reviewed
// @route   POST /api/flashcards/:cardId/review
// @access  Private
export const reviewFlashcard = async (req,res,next) =>{
    try{
        const flashcardSet = await Flashcard.findOne({"cards._id": req.params.cardId, userId:req.user._id})

        if(!flashcardSet){
            return res.status(400).json({
                success:false,
                error:"FlashCard set or card not found",
                statusCode:400
            })
        }

        const cardIndex = flashcardSet.cards.findIndex(card=> card._id.toString() === req.params.cardId)

        if(cardIndex === -1){
            return res.status(400).json({
                success:false,
                error:"Card not found in set",
                statusCode:404
            })
        }

        // Update review info
        flashcardSet.cards[cardIndex].lastReviewed = new Date()
        flashcardSet.cards[cardIndex].reviewCount += 1

        await flashcardSet.save()

        return res.status(200).json({
                success:true,
                data:flashcardSet,
                message:"flashCard reviewed successfully",
                statusCode:200
            })
    }catch(error){
        next(error)
    }
}



// @desc    toggle  star/favorite on flashCard
// @route   PUT /api/flashcard/:cardId/star
// @access  Private
export const toggleStarFlashcard = async (req,res,next) =>{
    try{
         const flashcardSet = await Flashcard.findOne({"cards._id": req.params.cardId, userId:req.user._id})

        if(!flashcardSet){
            return res.status(404).json({
                success:false,
                error:"FlashCard set or card not found",
                statusCode:404
            })
        }

        const cardIndex = flashcardSet.cards.findIndex(card=> card._id.toString() === req.params.cardId)

        if(cardIndex === -1){
            return res.status(404).json({
                success:false,
                error:"Card not found in set",
                statusCode:404
            })
        }

        // Toggle star
        flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;

        await flashcardSet.save();

        return res.status(200).json({
                success:true,
                data:flashcardSet,
                message:`FlashCard ${flashcardSet.cards[cardIndex].isStarred ? "starred" : 'unstarred'}`,
                statusCode:200
            })
    }catch(error){
        next(error)
    }
}



// @desc     DELETE  Flashcard sets
// @route   GET /api/flashcard/:id
// @access  Private
export const deleteFlashcardSet = async (req,res,next) =>{
    try{
        const flashcardSet = await Flashcard.findOne({_id:req.params.id, userId:req.user._id})

         if(!flashcardSet){
            return res.status(404).json({
                success:false,
                error:"FlashCard set  not found",
                statusCode:404
            })
        }

        await flashcardSet.deleteOne()

         return res.status(200).json({
                success:true,
                data:flashcardSet,
                message:`Flashcard Deleted Successfully`,
                statusCode:200
            })
    }catch(error){
        next(error)
    }
}