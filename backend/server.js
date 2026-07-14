import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import connectDB from "./config/db.js"
import errorHandler from "./middleware/errorHandler.js"

// Import Routes
import authRoutes from "./routes/authRoutes.js"
import documentRoutes from "./routes/documentRoutes.js"
import flashcardRoutes from "./routes/flashcardRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import quizRoutes from "./routes/quizRoutes.js"
import  progressRoute  from "./routes/progressRoute.js"

// ES6 module __dirname alternative
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initilize express app
const app = express()

// Connect to Database
connectDB();

// Middleware for CORS (cross-origin resource sharing),  
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://codecrafter1111.github.io"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// JSON parsing
app.use(express.json())
// URL encoding
app.use(express.urlencoded({ extended: true }))


// Statice folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


// Routes
app.use("/api/auth", authRoutes)
app.use("/api/documents", documentRoutes)
app.use("/api/flashcards" , flashcardRoutes)
app.use("/api/ai" , aiRoutes)
app.use("/api/quizzes" , quizRoutes)
app.use("/api/progress" , progressRoute)

// Express Error Handling Middleware
app.use(errorHandler);


app.get("/", (req, res) => {
res.status(200).json({
    success: true,
    message: "AI Learning Assistant Backend is running 🚀",
});
});

app.get("/health", (req, res) => {
res.status(200).json({
    success: true,
    status: "OK",
});
});



// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        statusCode: 404
    });
})

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} on port http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err)=>{
    console.error(`Error: ${err.message}`);
    process.exit(1)
})