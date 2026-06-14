import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

/**
 * Retrieves all quizzes for a specific document
 * @param {string} documentId - The ID of the document
 * @returns {Promise<object>} Array of quizzes for the document
 * @throws {Error} If fetching quizzes fails
 */
const getQuizzesForDocument = async (documentId) => {
    try{
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC,(documentId))
        return response.data
    }catch(error){
        throw error.response?.data || { message:"failed to fetch quizzes"}
    }
}

/**
 * Retrieves a specific quiz by its ID
 * @param {string} quizId - The ID of the quiz to retrieve
 * @returns {Promise<object>} Quiz details with questions
 * @throws {Error} If fetching quiz fails
 */
const getQuizById = async (quizId) => {
    try{
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID,(quizId))
        return response.data
    }catch(error){
        throw error.response?.data || { message:"failed to fetch quiz"}
    }
}

/**
 * Submits quiz answers for grading
 * @param {string} quizId - The ID of the quiz being submitted
 * @param {object} answer - User's answers to the quiz questions
 * @returns {Promise<object>} Quiz submission response with results
 * @throws {Error} If quiz submission fails
 */
const submitQuiz = async (quizId,answer) => {
    try{
        const response = await axiosInstance.post(API_PATHS.QUIZZES.GET_QUIZ_BY_ID,(quizId),{answer})
        return response.data
    }catch(error){
        throw error.response?.data || { message:"failed to submit quiz"}
    }
}

/**
 * Retrieves the results for a completed quiz
 * @param {string} quizId - The ID of the quiz
 * @returns {Promise<object>} Quiz results with score and feedback
 * @throws {Error} If fetching quiz results fails
 */
const getQuizResults = async (quizId) => {
    try{
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULT,(quizId))
        return response.data
    }catch(error){
        throw error.response?.data || { message:"failed to fetch submit results"}
    }
}

/**
 * Deletes a quiz by its ID
 * @param {string} quizId - The ID of the quiz to delete
 * @returns {Promise<object>} Deletion confirmation
 * @throws {Error} If quiz deletion fails
 */
const deleteQuiz = async (quizId) => {
    try{
        const response = await axiosInstance.post(API_PATHS.QUIZZES.GET_QUIZ_BY_ID,(quizId))
        return response.data
    }catch(error){
        throw error.response?.data || { message:"failed to delete quiz"}
    }
}

/**
 * Quiz Service module providing quiz management and submission operations
 * @module quizService
 */
const quizService = {
    getQuizzesForDocument,
    getQuizById,
    getQuizResults,
    submitQuiz,
    deleteQuiz
}

export default quizService