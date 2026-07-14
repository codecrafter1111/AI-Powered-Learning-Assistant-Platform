import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Sparkle, BookOpen, Lightbulb } from 'lucide-react'
import aiService from '../../services/aiService'
import toast from 'react-hot-toast'
import { MarkdownRenderer } from '../common/MarkdownRenderer'

export const AIAction = () => {

  const { id: documentId } = useParams();
  const [loadingAction, setLoadingAction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState("")
  const [modalTitle, setModalTitle] = useState("")
  const [concept, setConcept] = useState("")

  const handleGenerateSummary = async () => {
    setLoadingAction("summary")
    try {
      const { summary } = await aiService.generateSummary(documentId)
      setModalTitle("Generate Summary")
      setIsModalOpen(true)
      setModalContent(summary)
    } catch (error) {
      toast.error(error?.error || error?.message || "Failed to generate summary.")
    } finally {
      setLoadingAction(null)
    }
  }


  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if(!concept.trim()){
      toast.error("Please enter a concept to explain.");
      return;
    }
    setLoadingAction("explain");
    try {
      const { explanation } = await aiService.explainConcept(documentId, concept)
      setModalContent(explanation)
      setModalTitle(`Explanation of "${concept}"`);
      setIsModalOpen(true)
      setConcept("")
    } catch (error) {
      toast.error(error?.error || error?.message || "Failed to explain concept.")
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <>
      <div className='p-3 sm:p-6 space-y-4 sm:space-y-6'>
        {/* Header */}
        <div className='flex items-center gap-4 sm:gap-4 mb-2 sm:mb-10'>
          <div className='bg-teal-500 rounded-xl p-2.5 sm:p-3 flex items-center justify-center shrink-0'>
            <Sparkle className='w-5 h-5 sm:w-6 sm:h-6 text-white' strokeWidth={2} />
          </div>
          <div>
            <h3 className='text-base sm:text-lg font-semibold text-gray-900'>AI Assistant</h3>
            <p className='text-gray-500 text-xs sm:text-sm'>Powered by advanced AI</p>
          </div>
        </div>

        {/* Generate Summary */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm mt-4 p-4 sm:p-6'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='bg-blue-50 rounded-lg p-2 flex items-center justify-center shrink-0'>
                  <BookOpen className='w-5 h-5 text-blue-500' strokeWidth={2} />
                </div>
                <h4 className='text-sm sm:text-base font-semibold text-gray-900'>Generate Summary</h4>
              </div>
              <p className='text-gray-500 text-xs sm:text-sm'>Get a concise summary of the entire document</p>
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={loadingAction === "summary"}
              className='w-full sm:w-auto bg-teal-500 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 whitespace-nowrap flex items-center justify-center'
            >
              {loadingAction === "summary" ? (
                <span className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Loading...
                </span>
              ) : (
                "Summarize"
              )}
            </button>
          </div>
        </div>

        {/* Explain Concept */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='bg-yellow-50 rounded-lg p-2 flex items-center justify-center shrink-0'>
              <Lightbulb className='w-5 h-5 text-yellow-500' strokeWidth={2} />
            </div>
            <h4 className='text-sm sm:text-base font-semibold text-gray-900'>Explain a Concept</h4>
          </div>
          <p className='text-gray-500 text-xs sm:text-sm mb-4'>Enter a topic or concept from the document to get a detailed explanation.</p>
          <form onSubmit={handleExplainConcept} className='flex flex-col sm:flex-row gap-3'>
            <input
              type='text'
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. 'React Hooks'"
              className='flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm placeholder-gray-400'
              disabled={loadingAction === "explain"}
            />
            <button
              type='submit'
              disabled={loadingAction === "explain"}
              className='w-full sm:w-auto bg-teal-500 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 whitespace-nowrap flex items-center justify-center'
            >
              {loadingAction === "explain" ? (
                <span className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Loading...
                </span>
              ) : (
                "Explain"
              )}
            </button>
          </form>
        </div>
      </div>


      {/* Result Modal  */}
      <Modal
      isOpen={isModalOpen}
      onclose={()=> setIsModalOpen(false)}
      title={modalTitle}
      >
        <div className='max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate'>
          <MarkdownRenderer content={modalContent}/>
        </div>
      </Modal>      
    </>
  )
}
