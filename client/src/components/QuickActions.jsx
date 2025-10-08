import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Volume2, Focus, FileText } from 'lucide-react'

const QuickActions = ({ text, currentPage }) => {
  const navigate = useNavigate()

  const actions = {
    'tts': [
      {
        label: 'Summarize',
        icon: FileText,
        onClick: () => {
          localStorage.setItem('summarize-text', text)
          navigate('/summarize')
        },
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        label: 'Focus Read',
        icon: Focus,
        onClick: () => {
          localStorage.setItem('focus-text', text)
          navigate('/focus-mode')
        },
        gradient: 'from-purple-500 to-pink-500'
      }
    ],
    'focus': [
      {
        label: 'Listen (TTS)',
        icon: Volume2,
        onClick: () => {
          localStorage.setItem('tts-text', text)
          navigate('/text-to-speech')
        },
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        label: 'Summarize',
        icon: FileText,
        onClick: () => {
          localStorage.setItem('summarize-text', text)
          navigate('/summarize')
        },
        gradient: 'from-purple-500 to-pink-500'
      }
    ],
    'summarize': [
      {
        label: 'Listen',
        icon: Volume2,
        onClick: () => {
          localStorage.setItem('tts-text', text)
          navigate('/text-to-speech')
        },
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        label: 'Focus Read',
        icon: Focus,
        onClick: () => {
          localStorage.setItem('focus-text', text)
          navigate('/focus-mode')
        },
        gradient: 'from-purple-500 to-pink-500'
      }
    ]
  }

  const currentActions = actions[currentPage] || []

  if (!text || currentActions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {currentActions.map((action, idx) => {
        const Icon = action.icon
        return (
          <button
            key={idx}
            onClick={action.onClick}
            className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r ${action.gradient} text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium shadow-sm`}
          >
            <Icon className="h-4 w-4" />
            <span>{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default QuickActions
