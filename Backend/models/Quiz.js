import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        require: true,
    },
    title: {
        type: String,
        require: true,
        trim: true,
    },
    questions: [{
        question: {
            type: String,
            require: true,
        },
        options: {
            type: [String],
            require: true,
            validate: [array => array.length === 4, "Must have exactly 4 Options"]
        },
        correctAnswer: {
            type: String,
            require: true,
        },
        explanation: {
            type: String,
            default: ""
        },
        difficulty: {
            type: String,
            default: "",
            enum: ["easy", "medium", "hard"]
        },
    }],
    userAnswer: [{
        questionIndex: {
            type: Number,
            require: true,
        },
        selectedAnswer: {
            type: String,
            require: true,
        },
        isCorrect: {
            type: Boolean,
            require: true,
        },
        answeredAt: {
            type: Date,
            default: Date.now
        },
    }],
    score: {
        type: Number,
        default: 0,
    },
    totalQuestions: {
        type: Number,
        require: true
    },
    completedAt: {
        type: Date,
        require: null,
    },
},  
    { timestamps: true 
})


// Index for faster querires
quizSchema.index({userId:1,documentId:1})

const Quiz = mongoose.model("Quiz", quizSchema)

export default Quiz