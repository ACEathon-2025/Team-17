import { api } from '../utils/api'

class AnalysisService {
  /**
   * Analyze handwriting image
   */
  async analyzeHandwriting(imageFile, userId, age = null, notes = '') {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('userId', userId)
      if (age) formData.append('age', age)
      if (notes) formData.append('notes', notes)

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analysis/analyze`, {
        method: 'POST',
        body: formData
        // Don't set Content-Type - browser will set it with boundary
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Analysis failed')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Analysis error:', error)
      throw error
    }
  }

  /**
   * Get analysis history
   */
  async getHistory(userId, limit = 10, skip = 0) {
    try {
      const response = await api.get(`/analysis/history/${userId}?limit=${limit}&skip=${skip}`)
      return response.data
    } catch (error) {
      console.error('Get history error:', error)
      throw error
    }
  }

  /**
   * Get single analysis
   */
  async getAnalysisById(analysisId) {
    try {
      const response = await api.get(`/analysis/${analysisId}`)
      return response.data
    } catch (error) {
      console.error('Get analysis error:', error)
      throw error
    }
  }

  /**
   * Delete analysis
   */
  async deleteAnalysis(analysisId, userId) {
    try {
      const response = await api.delete(`/analysis/${analysisId}`, {
        data: { userId }
      })
      return response.data
    } catch (error) {
      console.error('Delete analysis error:', error)
      throw error
    }
  }

  /**
   * Get user statistics
   */
  async getStats(userId) {
    try {
      const response = await api.get(`/analysis/stats/${userId}`)
      return response.data
    } catch (error) {
      console.error('Get stats error:', error)
      throw error
    }
  }
}

export const analysisService = new AnalysisService()
