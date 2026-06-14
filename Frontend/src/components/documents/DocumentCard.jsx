import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from 'lucide-react'
import moment from "moment"

export const DocumentCard = ({ document, onDelete }) => {
    const navigate = useNavigate();

    // Helper function to format file size
    const formatFileSize = (bytes) => {
        const units = ["B", "KB", "MB", "GB", "TB"];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    }

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(document);
    }

    return (
        <div
            className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-400/10 transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={handleNavigate}
        >
            {/* Header Section */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className='shrink-0 w-14 h-14 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-xl flex justify-center items-center'>
                        <FileText className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>
                    <button
                        onClick={handleDelete}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate" title={document.title}>
                    {document.title}
                </h3>

                {/* Document info */}
                <div className='flex items-center gap-3 text-sm text-slate-500 mb-4'>
                    {document.fileSize !== undefined && (
                        <span className='font-medium'>{formatFileSize(document.fileSize)}</span>
                    )}
                </div>

                {/* Stats Section */}
                <div className="flex items-center gap-3 mb-4">
                    {document.flashcardCount !== undefined && (
                        <div className='flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg'>
                            <BookOpen className='w-3.5 h-3.5 text-purple-600' strokeWidth={2} />
                            <span className='text-xs font-semibold text-purple-700'>{document.flashcardCount} Flashcards</span>
                        </div>
                    )}
                    {document.quizCount !== undefined && (
                        <div className='flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg'>
                            <BrainCircuit className='w-3.5 h-3.5 text-emerald-600' strokeWidth={2} />
                            <span className='text-xs font-semibold text-emerald-700'>{document.quizCount} Quizzes</span>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className='pt-4 border-t border-slate-100'>
                    <div className='flex items-center gap-1.5 text-xs text-slate-500'>
                        <Clock className='w-3.5 h-3.5' strokeWidth={2} />
                        <span>Uploaded {moment(document.createdAt).fromNow()}</span>
                    </div>
                </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none" />
        </div>
    )
}
