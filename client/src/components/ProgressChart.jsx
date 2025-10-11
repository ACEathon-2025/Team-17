import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTheme } from '../context/ThemeContext'

const ProgressChart = ({ history }) => {
  const { isDark } = useTheme()

  // Transform history data for chart
  const chartData = history.map((item, index) => ({
    session: `Session ${index + 1}`,
    risk: item.confidence * 100,
    date: new Date(item.createdAt).toLocaleDateString()
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border-2 border-purple-200 dark:border-purple-800">
      <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6">
        📈 Progress Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis 
            dataKey="session" 
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            style={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <YAxis 
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            style={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `2px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px',
              fontWeight: 'bold'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="risk" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            name="Risk Score %" 
            dot={{ fill: '#8b5cf6', r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ProgressChart
