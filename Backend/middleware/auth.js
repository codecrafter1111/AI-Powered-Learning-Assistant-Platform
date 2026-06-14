import jwt from 'jsonwebtoken'
import User from "../models/User.js"

const protect = async (req, res, next) => {
    let token;

    //check if token exdists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]

            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: "No token provided",
                    statusCode: 401
                })
            }

            //Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select("-password")

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: "User not Found",
                    statusCode: 401
                })
            }
            next()
        }
        catch (err) {
            console.log("Auth Middleware error:", err.message)
            console.log("Error name:", err.name)

            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    error: "Token has expired",
                    statusCode: 401
                })
            }

            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({
                    success: false,
                    error: "Invalid token",
                    statusCode: 401
                })
            }

            return res.status(401).json({
                success: false,
                error: "Not Authorized, token failed",
                statusCode: 401
            })
        }
    }

    // If there was no any token
    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Not Authorized, no token ",
            statusCode: 401
        })
    }
}

export default protect