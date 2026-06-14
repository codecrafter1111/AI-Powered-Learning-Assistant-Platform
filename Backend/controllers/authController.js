import jwt from "jsonwebtoken";
import User from "../models/User.js";


// Generate JWT token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRER_IN || "7d" }
    );
}


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        // check if user Exist or not
        const userExists = await User.findOne({ $or: [{ email }, { username }] })

        if (userExists) {
            return res.status(400).json({
                success: true,
                error: userExists.email === email ? "Email already registered" : "Username already registered",
                statusCode: 400
            })
        }

        // Create User
        const user = await User.create({
            username: username,
            email: email,
            password: password
        });

        // Generate token
        const token = generateToken(user._id)
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt
                },
                token,
            },
            message: "User register successfully"
        })
    } catch (error) {
        next(error)
    }
}


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        
        // Check if either username or email is provided along with password
        if ((!username && !email) || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide username or email and password",
                statusCode: 401
            })
        }

        // Get the identifier (could be username or email)
        const identifier = username || email;
        
        // check Username or Email - search both fields with the identifier
        const user = await User.findOne({$or: [{ username }, { email }]}).select("+password")
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid Credentials",
                statusCode: 401
            })
        }


        // check password
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid Password",
                statusCode: 401
            })
        }

        // Generate Token
        const token = generateToken(user._id)
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
            token,
            message: "Token Successfuly generated"
        })
    } catch (error) {
        next(error)
    }
}


// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getprofile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        return res.status(200).json({
                success: true,
                data:{
                    id:user._id,
                    username:user.username,
                    email:user.email,
                    profileImage:user.profileImage,
                    createdAt:user.createdAt,
                    updateAt:user.updatedAt
                }
            })
    }catch (error) {
        next(error)
    }
}


// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const { username, email, profileImage } = req.body

        // Build update object with only provided fields
        const updateFields = {}
        if (username) updateFields.username = username
        if (email) updateFields.email = email
        if (profileImage) updateFields.profileImage = profileImage

        // Update user and return the updated document
        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateFields,
            { new: true, runValidators: true }
        )
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
                statusCode: 404
            })
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                updatedAt: user.updatedAt
            },
            message: "Profile updated successfully"
        })

    } catch (error) {
        next(error)
    }
}


// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
    try {
        const {currentPassword, newPassword} = req.body

        if(!currentPassword || !newPassword){
            return res.status(401).json({
                success:false,
                error:"Please provide the Current and new password",
                statusCode:401
            })
        }

        const user = await User.findById(req.user._id).select("+password")

        // Check the current password
        const isMatch = await user.matchPassword(currentPassword)
        if(!isMatch){
            return res.status(401).json({
                success:false,
                error:"Current password is incorrect, Please provide the valid password",
                statusCode:401
            })
        }


        // Updating the password
        user.password = newPassword
        await user.save()
        res.status(200).json({
                success:true,
                message:"Your password has been updated Successfuly",
                statusCode:200
            })
    } catch (error) {
        next(error)
    }
}

