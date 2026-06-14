import mongoose, { mongo } from "mongoose";

const ChatHistorySchema = mongoose.Schema({
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
    message: [{
        role: {
            type: String,
            enum: ["user", "assistent"]
        },
        content: {
            type: String,
            require: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        relevantChunks: {
            type: [Number],
            default: []
        }
    }]
}, { timestamps: true })

// index for the faster queries

ChatHistorySchema.index({ userId: 1, documentId: 1 })

const ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema)

export default ChatHistory