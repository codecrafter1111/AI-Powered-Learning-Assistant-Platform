import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

/**
 * Retrieves all flashcard sets for the current user
 * @returns {Promise<object>} Array of flashcard sets
 * @throws {Error} If fetching flashcard sets fails
 */
const getAllFlashcardSets = async () => {
    try{
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARDS_SETS)
        return response.data
    }catch(error){
        throw error.response?.data || { message:"failed to fetch Flashcard sets"}
    }
}

/**
 * Retrieves all flashcards for a specific document
 * @param {string} documentId - The ID of the document
 * @returns {Promise<object>} Array of flashcards for the document
 * @throws {Error} If fetching flashcards fails
 */
const getAllFlashcardForDocument = async (documentId) => {
    try{
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId))
        return response.data
    }catch(error){
        throw error.response?.data || { message:"failed to fetch Flashcard "}
    }
}

/**
 * Marks a flashcard as reviewed
 * @param {string} cardId - The ID of the flashcard set
 * @param {number} cardIndex - The index of the card within the set
 * @returns {Promise<object>} Review confirmation
 * @throws {Error} If reviewing flashcard fails
 */
const reviewFlashcard = async (cardId,cardIndex) => {
    try{
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARDS,(cardId),{cardIndex})
        return response.data
    }catch(error){
        throw error.response?.data || { message:"failed to review Flashcard "}
    }
}

/**
 * Toggles the starred/favorite status of a flashcard
 * @param {string} cardId - The ID of the flashcard set
 * @param {number} cardIndex - The index of the card within the set
 * @returns {Promise<object>} Updated card status
 * @throws {Error} If toggling star fails
 */
const toggleStar = async (cardId,cardIndex) => {
    try{
        const response = await axiosInstance.put(API_PATHS.FLASHCARDS.TOGGLE_STAR,(cardId),{cardIndex})
        return response.data
    }catch(error){
        throw error.response?.data || { message:"failed to star Flashcard "}
    }
}

/**
 * Deletes a flashcard set by its ID
 * @param {string} id - The ID of the flashcard set to delete
 * @returns {Promise<object>} Deletion confirmation
 * @throws {Error} If deleting flashcard set fails
 */
const deleteFlashcardSet = async (id) => {
    try{
        const response = await axiosInstance.put(API_PATHS.FLASHCARDS.TOGGLE_STAR,(id))
        return response.data
    }catch(error){
        throw error.response?.data || { message:"failed to delete Flashcards "}
    }
}

/**
 * Flashcard Service module providing flashcard management and review operations
 * @module flshcardsService
 */
const flshcardsService = {
    getAllFlashcardSets,
    getAllFlashcardForDocument,
    reviewFlashcard,
    toggleStar,
    deleteFlashcardSet
}

export default flshcardsService;
