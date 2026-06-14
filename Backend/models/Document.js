import mongoose from "mongoose";

const documentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    title: {
        type: String,
        trim:true,
        require: [true, "Please provide a document title"],
    },
    fileName:{
        type:String,
        require: true,
    },
    filePath:{
        type:String,
        require: true,
    },
    fileSize:{
        type:Number,
        require: true,
    },
    extractedText:{
        type:String,
        default:""
    },
    chunks:[{
        content:{
            type:String,
            require:true
        },
        pageNumber:{
            type:Number,
            default:0
        },
        chunkIndex:{
            type:Number,
            require:true,
        }
    }],
    uploadDate:{
        type:Date,
        default:Date.now
    },
    lastAccessed:{
        type:Date,
        default: Date.now
    },
    status:{
        type:String,
        enemm:["processing","ready","failed"]
    }
},{timestamps:true})

// Idex for faster queiries
documentSchema.index({userId:1,uploadDate:-1})

const Document = mongoose.model("Document", documentSchema)

export default Document;
