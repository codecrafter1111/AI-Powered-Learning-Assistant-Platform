import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

/**
 * Generates flashcards for a specific document using AI
 * @param {string} documentId - The ID of the document to generate flashcards from
 * @param {object} options - Additional options for flashcard generation
 * @returns {Promise<object>} The generated flashcards data
 * @throws {Error} If flashcard generation fails
 */
const generateFlashcards = async (documentId,options) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS,{documentId,...options})
        return response.data
    }catch(error){
       throw error.response?.data || {message:"Failed to generate flashcards"}
    }
}

/**
 * Generates a quiz for a specific document using AI
 * @param {string} documentId - The ID of the document to generate quiz from
 * @param {object} options - Additional options for quiz generation
 * @returns {Promise<object>} The generated quiz data
 * @throws {Error} If quiz generation fails
 */
const generateQuiz = async (documentId,options) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ,{documentId,...options})
        return response.data
    }catch(error){
        throw error.response?.data || {message:"Failed to generate Quiz"}
    }
    
}

/**
 * Generates a summary of a specific document using AI
 * @param {string} documentId - The ID of the document to summarize
 * @returns {Promise<object>} The generated summary data
 * @throws {Error} If summary generation fails
 */
const generateSummary = async (documentId) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, { documentId })
        return response.data?.data
    }catch(error){
        throw error.response?.data || {message:"Failed to generate summary"}
    }
    
}

/**
 * Sends a chat message about a specific document and gets AI response
 * @param {string} documentId - The ID of the document context for the chat
 * @param {string} message - The user's message/question
 * @returns {Promise<object>} The AI chat response
 * @throws {Error} If chat request fails
 */
const chat = async (documentId,message) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AI.CHAT,{documentId,question:message}) // Removed hostory from payload
        return response.data
    }catch(error){
        throw error.response?.data || {message:"chat request failed"}
    }
    
}

/**
 * Requests AI explanation of a specific concept from a document
 * @param {string} documentId - The ID of the document containing the concept
 * @param {string} concept - The concept to be explained
 * @returns {Promise<object>} The explanation data
 * @throws {Error} If explanation request fails
 */
const explainConcept = async (documentId,concept) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT,{documentId,concept})
        return response.data?.data
    }catch(error){
        throw error.response?.data || {message:"Failed to explain concept"}
    }
    
}

/**
 * Retrieves the chat history for a specific document
 * @param {string} documentId - The ID of the document to get chat history for
 * @returns {Promise<object>} The chat history data
 * @throws {Error} If fetching chat history fails
 */
const getChatHistory = async (documentId) => {
    try{
        const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY,(documentId))
        return response.data
    }catch(error){
        throw error.response?.data || {message:"Failed to fetch chat history"}
    }
    
}

/**
 * AI Service module providing various AI-powered features for document analysis
 * @module aiService
 */
const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory,
}

export default aiService