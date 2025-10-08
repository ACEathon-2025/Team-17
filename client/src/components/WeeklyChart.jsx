import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTheme } from '../context/ThemeContext'

const WeeklyChart = ({ data }) => {
  const { isDark } = useTheme()

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold dyslexia-text">{payload[0].payload.day}</p>
          <p className="text-sm text-blue-600 dyslexia-text">Sessions: {payload[0].value}</p>
          <p className="text-sm text-purple-600 dyslexia-text">Words: {payload[0].payload.words}</p>
          <p className="text-sm text-green-600 dyslexia-text">Minutes: {payload[0].payload.minutes}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
        <XAxis 
          dataKey="day" 
          stroke={isDark ? '#9ca3af' : '#6b7280'}
          style={{ fontSize: '12px', fontFamily: 'Lexend' }}
        />
        <YAxis 
          stroke={isDark ? '#9ca3af' : '#6b7280'}
          style={{ fontSize: '12px', fontFamily: 'Lexend' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ fontSize: '12px', fontFamily: 'Lexend' }}
        />
        <Bar dataKey="sessions" fill="#3b82f6" name="Sessions" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default WeeklyChart
