import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

/**
 * Retrieves all documents for the current user
 * @returns {Promise<object>} Array of document objects
 * @throws {Error} If fetching documents fails
 */
const getDocument = async () => {
    try{
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT)
        return response.data?.data
    }catch(error){
       throw error.response?.data || {message:"Failed to fetch Document"}
    }
}

/**
 * Uploads a new document to the server
 * @param {FormData} formData - Form data containing the document file and metadata
 * @returns {Promise<object>} Upload response with document details
 * @throws {Error} If document upload fails
 */
const uploadDocument = async (formData) => {
    try{
        const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD,formData,{
            headers:{
            "Content-type":"multipart/form-data"
        }})
        return response.data
    }catch(error){
        throw error.response?.data || {message:"Failed to upload document"}
    }
    
}

/**
 * Deletes a document by its ID
 * @param {string} id - The ID of the document to delete
 * @returns {Promise<object>} Deletion confirmation
 * @throws {Error} If document deletion fails
 */
const deleteDocument = async (id) => {
    try{
        const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id)) 
        return response.data
    }catch(error){
        throw error.response?.data || {message:"Failed to delete document"}
    }
    
}

/**
 * Retrieves a specific document by its ID
 * @param {string} id - The ID of the document to retrieve
 * @returns {Promise<object>} Document details
 * @throws {Error} If fetching document details fails
 */
const getDocumentById = async (id) => {
    try{
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id))
        return response.data
    }catch(error){
        throw error.response?.data || {message:"Failed to fetch  document details"}
    }
    
}

/**
 * Document Service module providing document management operations
 * @module documentService
 */
const documentService = {
    getDocument,
    uploadDocument,
    deleteDocument,
    getDocumentById
}

export default documentService


