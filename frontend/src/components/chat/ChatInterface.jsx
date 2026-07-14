import React, { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, Sparkles, User } from "lucide-react"
import { useParams } from 'react-router-dom'
import aiService from "../../services/aiService"
// import { useAuth } from "../../context/useAuth"
import Spinner from '../common/Spinner'
import { MarkdownRenderer } from '../common/MarkdownRenderer'

export const ChatInterface = () => {
    const { id: documentId } = useParams()
    // const { user } = useAuth()
    const [history, setHistory] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const messageEndRef = useRef(null)

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                setInitialLoading(true);
                const response = await aiService.getChatHistory(documentId)
                setHistory(response.data)
            } catch (error) {
                console.error("Failed to fetch chat history:", error)
            } finally {
                setInitialLoading(false)
            }
        }

        fetchChatHistory()
    }, [documentId])


    useEffect(() => {
        scrollToBottom()
    }, [history])


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return

        const userMessage = { role: "user", content: message, timestamp: new Date() }
        setHistory(prev => [...prev, userMessage])
        setMessage("")
        setLoading(true)

        try {
            const response = await aiService.chat(documentId, userMessage.content)
            const assistantMessage = {
                role: "assistant",
                content: response.data.answer,
                timestamp: new Date(),
                relevantChunks: response.data.relevantChunks
            }
            setHistory(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error("chat error", error)
            const errorMessage = {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again",
                timestamp: new Date()
            }
            setHistory(prev => [...prev, errorMessage])
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = (msg, index) => {
        const isUser = msg.role === "user"
        const isAssistant = msg.role === "assistant"

        return (
            <div
                key={index}
                className={`flex gap-4 mb-5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
                {isAssistant && (
                    <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                )}

                <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`px-5 py-3 rounded-2xl ${isUser
                            ? 'bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-white border border-slate-200 text-slate-800 shadow-md'
                        }`}>
                        {isAssistant ? (
                            <MarkdownRenderer content={msg.content} />
                        ) : (
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                        )}
                    </div>
                    <span className="text-xs text-slate-400 mt-1.5 px-2">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                {isUser && (
                    <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
                            <User className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                )}
            </div>
        )
    };

    if (initialLoading) {
        return (
            <div className='flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl justify-center items-center shadow-xl shadow-slate-200/60'>
                <div className='w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4'>
                    <MessageSquare className='w-7 h-7 text-emerald-600' strokeWidth={2} />
                </div>
                <Spinner />
                <p className='text-sm text-slate-500 mt-3 font-medium'>Loading chat history...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-15rem)] bg-linear-to-br from-slate-50 via-white to-emerald-50/30 rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden">

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div className="w-20 h-20 rounded-full bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6 shadow-lg shadow-emerald-200/50">
                            <MessageSquare className='w-10 h-10 text-emerald-600' strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">Start a conversation</h3>
                        <p className="text-slate-500 text-base max-w-md leading-relaxed">
                            Ask me anything about the document!
                        </p>
                        <div className="mt-7 p-3 bg-white rounded-xl border border-emerald-200/60 shadow-lg max-w-md">
                            <p className="text-sm text-emerald-700 font-medium">
                                💡 Try asking about key concepts, summaries, or specific topics in your document
                            </p>
                        </div>
                    </div>
                ) : (
                    history.map(renderMessage)
                )}

                <div ref={messageEndRef} />

                {loading && (
                    <div className="flex gap-4 mb-6">
                        <div className="shrink-0">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg animate-pulse">
                                <Sparkles className='w-5 h-5 text-white' strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-md">
                            <div className="flex gap-1.5">
                                <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: "0ms" }}></span>
                                <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: "150ms" }}></span>
                                <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: "300ms" }}></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200/80 bg-white/80 backdrop-blur-sm px-6 py-4">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 justify-center">
                    <div className="flex-1 ">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSendMessage(e)
                                }
                            }}
                            placeholder="Ask a follow-up question..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-slate-800 placeholder-slate-400 text-sm"
                            rows="1"
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="px-4 py-3 bg-linear-to-br mb-2 from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" strokeWidth={2.5} />
                        {/* <span className="hidden sm:inline">Send</span> */}
                    </button>
                </form>
                <p className="text-xs text-slate-400 mt-2 text-center">
                    Press Enter to send, Shift + Enter for new line
                </p>
            </div>
        </div>
    )
}
