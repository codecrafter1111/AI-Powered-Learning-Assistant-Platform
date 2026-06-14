import mongoose from "mongoose"
import Document from "../models/Document.js"
import Flashcard from "../models/FlashCard.js"
import Quiz from "../models/Quiz.js"
import ChatHistory from "../models/ChatHistory.js"
import * as geminiService from "../utils/geminiService.js"
import { chunkText, findRelevantChunks } from "../utils/textChunker.js"

//@desc Generate flashcards from document
//@route POST/api/ai/generate-flashcards
// @access  Private
export const generateFlashcards = async (req, res, next) => {
    try {
        const { documentId, count = 10 } = req.body

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Please provide documentID",
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        })

        if (!document) {
            return res.status(400).json({
                success: false,
                error: "Document not found or not Ready",
                statusCode: 400
            })
        }


        //Generate flshcards using Gemini
        const cards = await geminiService.generateFlashcards(document.extractedText, parseInt(count))

        // Save to database
        const flashcardSets = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarred: false,
            }))
        })


        res.status(200).json({
            success: true,
            data: flashcardSets,
            message: "FlashCard generated successfully",
            status: 200
        })

    } catch (error) {
        next(error)
    }
}


//@desc Generate Quiz from document
//@route POST/api/ai/generate-quiz
// @access  Private
export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId, numQuestion = 5, title } = req.body

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Please provide documentID",
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        })

        if (!document) {
            return res.status(400).json({
                success: false,
                error: "Document not found or not Ready",
                statusCode: 400
            })
        }


        //Generate Quiz using Gemini
        const question = await geminiService.generateQuiz(document.extractedText, parseInt(numQuestion))

        // Save to database
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title} - Quiz`,
            questions: question,
            totalQuestions: question.length,
            userAnswer: [],
            score: 0
        })


        res.status(200).json({
            success: true,
            data: quiz,
            message: "Quiz generated successfully",
            status: 200
        })

    } catch (error) {
        next(error)
    }
}


//@desc Generate  document Summary
//@route POST/api/ai/generate-summary
// @access  Private
export const generateSummary = async (req, res, next) => {
    try {
        const { documentId } = req.body

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Please provide documentID",
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        })

        if (!document) {
            return res.status(400).json({
                success: false,
                error: "Document not found or not Ready",
                statusCode: 400
            })
        }

        //Generate Quiz using Gemini
        const summary = await geminiService.generateSummary(document.extractedText)
        return res.status(200).json({
            success: true,
            data: {
                documentId: documentId,
                title: document.title,
                summary
            },
            message: "Summary Generated Successfully",
            statusCode: 200
        })

    } catch (error) {
        next(error)
    }
}

//@desc  Chat with document
//@route POST/api/ai/chat
// @access  Private
export const chat = async (req, res, next) => {
    try {
        const { documentId, question } = req.body

        if (!documentId || !question) {
            return res.status(400).json({
                success: false,
                error: "Please provide documentID and Question",
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        })

        if (!document) {
            return res.status(400).json({
                success: false,
                error: "Document not found or not Ready",
                statusCode: 400
            })
        }

        // Find relevent chunks
        const relevantChunk = findRelevantChunks(document.chunks, question, 3)
        const chunkindices = relevantChunk.map(c => c.chunkIndex)

        // Get or create chat history
        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id,
        })

        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                message: []
            })
        }

        //Generate response using Gemini
        const answer = await geminiService.chatWithContext(question, relevantChunk)

        //Save conversation
        chatHistory.message.push(
            {
                role: "user",
                content: question,
                timestamp: new Date(),
                relevantChunk: []
            },
            {
                role: "assistent",
                content: question,
                timestamp: new Date(),
                relevantChunk: chunkindices
            }
        )

        await chatHistory.save()

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                relevantChunk: chunkindices,
                chatHistoryId: chatHistory._id
            },
            message: "Response generated successfuly",
            status: 200
        })
    } catch (error) {
        next(error)
    }
}




//@desc Explain-Concept from document
//@route POST/api/ai/explain-concept
// @access  Private
export const explainConcept = async (req, res, next) => {
    try {
        const { documentId, concept } = req.body

        if (!documentId || !concept) {
            return res.status(400).json({
                success: false,
                error: "Please provide documentID and Concept",
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        })

        if (!document) {
            return res.status(400).json({
                success: false,
                error: "Document not found or not Ready",
                statusCode: 400
            })
        }

        //Find Relevent chunks for the concept
        const relevantChunk = findRelevantChunks(document.chunks, concept, 3)
        const context = relevantChunk.map(c => c.content).join("\n\n")

    

        //Generate Explanation using Gemini
        const explanation = await geminiService.explainConcept(concept, context)

        res.status(200).json({
            success: true,
            data: {
                concept,
                explanation,
                relevantChunk: relevantChunk.map(c=>c.chunkIndex),
            },
            message: "Explanation generated successfuly",
            status: 200
        })
    } catch (error) {
        next(error)
    }
}


//@desc Get Chat History for a document
//@route POST/api/ai/chat-history
// @access  Private
export const getChatHistory = async (req, res, next) => {
    try {
         const { documentId } = req.params

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Please provide documentID",
                statusCode: 400
            })
        }

        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            socumentId:documentId
        }).select("messages") // only retrieve teh message array

        if (!chatHistory) {
            return res.status(200).json({
                success: true,
                data: [], // Return an empty array if no chat history fonund
                messages:"NO chat history found for this document",
                statusCode: 400
            })
        }

        res.status(200).json({
                success: true,
                data:chatHistory.messages,
                error: "Chat history retrive successfully",
                statusCode: 200
            })

    } catch (error) {
        next(error)
    }
}




