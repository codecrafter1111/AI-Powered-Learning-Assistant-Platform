import React, { useState, useEffect } from 'react'
import progressService from "../../services/progressService"
import toast from 'react-hot-toast'
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock } from "lucide-react"
import Spinner from '../../components/common/Spinner'

const DashboardPage = () => {
  const [dashboardData, setdashboardData] = useState(null)
  const [loading, setloading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData()
        setdashboardData(data.data)
        console.log("Dashboard API Response:", data)
        console.log("Dashboard Data:", data.data)
        console.log("Overview:", data.data?.overview)
      } catch (error) {
        toast.error("Failed to fetch dashboard data")
        console.error(error)
      } finally {
        setloading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className=' min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-slate-100'>
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
          <p className='text-slate-600 text-sm'>No dashboard data is available</p>
        </div>
      </div>
    )
  }

  const state = [
    {
      label: "TOTAL DOCUMENTS",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      bgColor: "bg-blue-500",
    },
    {
      label: "TOTAL FLASHCARDS",
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      bgColor: "bg-pink-500",
    },
    {
      label: "TOTAL QUIZZES",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      bgColor: "bg-emerald-500",
    },
  ]

  return (
    <div className='space-y-7 px-2 py-1'>
      {/* Header Section */}
      <div>
        <h1 className='text-3xl font-semibold text-gray-900'>Dashboard</h1>
        <p className='text-gray-600 mt-2'>Track your learning progress and activity</p>
      </div>

      {/* Stats Cards */}
      <div className='flex flex-wrap gap-6'>
        {state.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 flex-1 min-w-70'
            >
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>
                    {stat.label}
                  </p>
                  <p className='text-4xl font-bold text-gray-900'>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className='text-white' size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity Section */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
        <div className='flex items-center gap-3 mb-8'>
          <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
            <Clock className='text-gray-600' size={22} />
          </div>
          <h2 className='text-2xl font-semibold text-gray-900'>Recent Activity</h2>
        </div>

        <div className='space-y-3'>
          {dashboardData.recentActivity &&
            (dashboardData.recentActivity.document.length > 0 || dashboardData.recentActivity.quizzes.length > 0) ? (
            <div>
              {[
                ...(dashboardData.recentActivity.document || []).map(doc => ({
                  id: doc._id,
                  description: doc.title || doc.fileName,
                  timestamp: doc.lastAccessed,
                  link: `./documents/${doc._id}`,
                  type: "document"
                })),
                ...(dashboardData.recentActivity.quizzes || []).map(quiz => ({
                  id: quiz._id,
                  description: quiz.title,
                  timestamp: quiz.completedAt || quiz.createdAt,
                  link: `./quizzes/${quiz._id}`,
                  type: "quiz"
                })),
              ]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className='flex items-start justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200'
                  >
                    <div className='flex items-start gap-4'>
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${activity.type === "document"
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                        }`} />
                      <div>
                        <p className='text-gray-900 font-normal text-[15px]'>
                          {activity.type === "document" ? "Accessed Document: " : 'Attempted Quiz: '}
                          <span className='text-gray-900'>{activity.description}</span>
                        </p>
                        <p className='text-[13px] text-gray-500 mt-1'>
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                          }).replace(',', '') : 'Invalid Date'}
                        </p>
                      </div>
                    </div>
                    <button className='text-emerald-500 hover:text-emerald-600 font-medium text-[15px] transition-colors shrink-0'>
                      View
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <Clock className='w-8 h-8 text-gray-400' />
              </div>
              <p className='text-gray-600 font-medium'>No recent activity</p>
              <p className='text-gray-500 text-sm mt-1'>Your activity will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
              }

              export default DashboardPage