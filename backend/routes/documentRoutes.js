import express from 'express'
import wrapAsync from "../middleware/wrapAsync.js"
import protect from "../middleware/auth.js"
import upload from "../config/multer.js"
import { uploadDocument,getDocuments,getDocumentById,deleteDocument } from '../controllers/documentController.js'
const router = express.Router()


            //All Routes are Protected

// Route for Upload Document
router.post("/upload", protect, upload.single("file"), wrapAsync(uploadDocument))

// Route for Get multiple Document
router.get("/", protect, wrapAsync(getDocuments))

// Route for Get single Document
router.get("/:id", protect, wrapAsync(getDocumentById))

// // Route for update Document
// router.put("/:id", protect, wrapAsync(updateDocument))

// Route for delete Document
router.delete("/:id", protect, wrapAsync(deleteDocument))

export default router;