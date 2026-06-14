import React, { useState, useEffect } from 'react'
import { Plus, Upload, Trash2, FileText, X, Flag, Dice1 } from 'lucide-react'
import toast from 'react-hot-toast'

import documentService from "../../services/documentService"
import Spinner from '../../components/common/Spinner'
import { Button } from '../../components/common/Button'
import { DocumentCard } from '../../components/documents/DocumentCard'

const DocumentListPage = () => {

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  // state for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadFileTitle, setUploadFileTitle] = useState('')
  const [uploading, setUploading] = useState(false)

  //state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocument()
      setDocuments(data)
    } catch (error) {
      toast.error("Failed to fetch document")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadFile(file)
      setUploadFileTitle(file.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadFileTitle) {
      toast.error("Please provide a title and select a file.")
      return
    }
    setUploading(true)
    const formData = new FormData()
    formData.append("file", uploadFile)
    formData.append("title", uploadFileTitle)

    try {
      await documentService.uploadDocument(formData)
      toast.success("Document uplaoded successfully!")
      setIsUploadModalOpen(false)
      setUploadFile(null)
      setUploadFileTitle('')
      setLoading(true)
      fetchDocuments()
    } catch (error) {
      toast.error(error.message || "Upload failed ! \n Size of the PDF should be less than 10MB")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return
    setDeleting(true)
    try {
      await documentService.deleteDocument(selectedDoc._id)
      toast.success(`'${selectedDoc.title}' deleted.`)
      setIsDeleteModalOpen(false)
      setSelectedDoc(null)
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id))
    } catch (error) {
      toast.error(error.message || "Failed to delete document.")
    } finally {
      setDeleting(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex items-center justify-center min-h-100'>
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className='flex items-center justify-center min-h-100'>
          <div className='text-center max-w-md'>
            <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-6' >
              <FileText className='w-10 h-10 text-slate-400'
                strokeWidth={1.5} />
            </div>
            <h3 className='text-xl font-medium text-slate-500 tracking-tight mb-2'>No Document Yet</h3>
            <p className='text-sm text-slate-500 mb-6'> Get started by uploading your first PDF document to begin learning.</p>
            <button onClick={() => setIsUploadModalOpen(true)} className='inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]'>
              <Plus className='w-5 h-5' strokeWidth={2.5} />
              Upload Document
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
        {documents?.map((doc) => (
          <DocumentCard key={doc._id} document={doc} onDelete={handleDeleteRequest} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size[20px,20px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
              My Documents
            </h1>
            <p className="text-slate-500 text-sm">
              Manage and organize your learning materials
            </p>
          </div>

          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>

        {renderContent()}
      </div>

                            {/* POP for PDF UPLOAD  */}

      {/* Modal Overlay */}
      {isUploadModalOpen && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in duration-200'>
            {/* Close Button */}
            <button 
              onClick={() => setIsUploadModalOpen(false)}
              className='absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors'>
              <X className="w-6 h-6" strokeWidth={2} />
            </button>

            {/* Modal Header */}
            <div className='mb-2'>
              <h2 className='text-2xl font-semibold text-slate-900'>Upload New Document</h2>
            </div>
            <p className='text-slate-500 text-sm mb-6'>
              Add a PDF document to your library
            </p>

            {/* Form  */}
            <form onSubmit={handleUpload} className='space-y-5'>
              {/* Title Input  */}
              <div>
                <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2'>Document Title</label>
                <input
                  type="text"
                  value={uploadFileTitle}
                  onChange={(e) => setUploadFileTitle(e.target.value)}
                  required
                  className='w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900'
                  placeholder="e.g., React Interview Prep" />
              </div>

              {/* File upload  */}
              <div className='space-y-2'>
                <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide'>PDF File</label>
                <div className='relative'>
                  <input
                    type="file"
                    id='file-upload'
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                    onChange={handleFileChange}
                    accept='.pdf'
                  />
                  <div className='border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer'>
                    <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-3'>
                      <Upload className='w-6 h-6 text-emerald-500' strokeWidth={2} />
                    </div>
                    <p className='text-sm text-slate-600 mb-1'>
                      {uploadFile ?
                      (
                        <span className='font-medium text-slate-900'>{uploadFile.name}</span>
                      ) : (
                      <>
                      <span className='text-emerald-600 font-medium'>
                        Click to upload
                      </span>
                      {" "} or drag and drop 
                      </>)}
                    </p>
                    <p className='text-xs text-slate-400'>PDF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Action Button  */}
              <div className='flex gap-3 pt-2'>
                <button 
                  type='button' 
                  onClick={()=>{setIsUploadModalOpen(false)}} 
                  disabled={uploading} 
                  className='flex-1 px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                  Cancel
                </button>

                <button 
                  type='submit' 
                  disabled={uploading} 
                  className='flex-1 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'>
                  {uploading ?
                  (
                    <span className='flex items-center justify-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      Uploading...
                    </span>
                  ):(
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200'>
            {/* Close Button  */}
            <button 
              onClick={()=> setIsDeleteModalOpen(false)}
              className='absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors'>
              <X className='w-6 h-6' strokeWidth={2}/>
            </button>

            {/* Modal header  */}
            <div className='text-center mb-6'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4'>
                <Trash2 className='w-8 h-8 text-red-500' strokeWidth={2}/>
              </div>
              <h2 className='text-2xl font-semibold text-slate-900'>Confirm Deletion</h2>
            </div>

            {/* Content  */}
            <p className='text-center text-slate-600 mb-8'>
              Are you sure you want to delete{' '}
              <span className='font-semibold text-slate-900'>
                "{selectedDoc?.title}"
              </span>
              ? This action cannot be undone.
            </p>

            {/* Action Button  */}
            <div className='flex gap-3'>
              <button
                type='button'
                onClick={()=> setIsDeleteModalOpen(false)}
                disabled={deleting}
                className='flex-1 px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className='flex-1 px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'>
                {deleting?(
                  <span className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'/>
                    Deleting...
                  </span>
                ):("Delete")} 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentListPage