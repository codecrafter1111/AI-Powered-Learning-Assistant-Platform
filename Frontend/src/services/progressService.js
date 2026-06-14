import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

/**
 * Retrieves dashboard data including user progress and statistics
 * @returns {Promise<object>} Dashboard data with progress metrics
 * @throws {Error} If fetching dashboard data fails
 */
const getDashboardData = async () => {
    try{
        const response = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD)
        return response.data
    }catch(error){
        throw error.response?.data || { message:"failed to fetch dashboard data"}
    }
}

/**
 * Progress Service module providing user progress tracking and dashboard data
 * @module progressService
 */
const progressService = {
    getDashboardData
}

export default progressService