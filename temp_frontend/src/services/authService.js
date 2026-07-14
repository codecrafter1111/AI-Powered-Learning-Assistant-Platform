import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

/**
 * Authenticates a user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<object>} Login response data with user info and token
 * @throws {Error} If login fails
 */
const login = async (email,password) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{email,password})
        return response.data
    }catch(error){
        throw error.response?.data || {message:"An unknown error occured"}
    }
}

/**
 * Registers a new user account
 * @param {string} username - Desired username
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<object>} Registration response data
 * @throws {Error} If registration fails
 */
const register = async (username,email,password) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{username,email,password})
        return response.data
    }catch(error){
        throw error.response?.data || {message:"An unknown error occured"}
    }
}

/**
 * Retrieves the current user's profile information
 * @param {object} userData - User data parameters
 * @returns {Promise<object>} User profile data
 * @throws {Error} If fetching profile fails
 */
const getprofile = async (userData) => {
    try{
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE,userData)
        return response.data
    }catch(error){
        throw error.response?.data || {message:"An unknown error occured"}
    }
}

/**
 * Updates the current user's profile information
 * @param {object} userData - Updated user data
 * @returns {Promise<object>} Updated profile data
 * @throws {Error} If profile update fails
 */
const updateProfile = async (userData) => {
    try{
        const response = await axiosInstance.get(API_PATHS.AUTH.UPDATE_PROFILE,userData)
        return response.data
    }catch(error){
        throw error.response?.data || {message:"An unknown error occured"}
    }
}

/**
 * Changes the current user's password
 * @param {string} password - New password
 * @returns {Promise<object>} Password change confirmation
 * @throws {Error} If password change fails
 */
const changePassword = async (password) => {
    try{
        const response = await axiosInstance.get(API_PATHS.AUTH.CHANGE_PASSWORD,password)
        return response.data
    }catch(error){
        throw error.response?.data || {message:"An unknown error occured"}
    }
}

/**
 * Authentication Service module providing user authentication and profile management
 * @module authService
 */
const authService = {
    login,
    register,
    getprofile,
    updateProfile,
    changePassword,
}

export default authService


