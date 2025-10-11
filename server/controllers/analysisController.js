import Analysis from '../models/Analysis.model.js'
import path from 'path'
import fs from 'fs'

/**
 * Upload handwriting image (NO AI - just storage)
 * POST /api/analysis/upload
 */
export const uploadImage = async (req, res) => {
  try {
    // Check if file uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      })
    }

    const imageUrl = `/uploads/handwriting/${req.file.filename}`

    console.log('📤 Image uploaded:', imageUrl)

    res.json({
      success: true,
      imageUrl,
      message: 'Image uploaded successfully'
    })

  } catch (error) {
    console.error('❌ Upload error:', error)

    // Cleanup uploaded file on error
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path)
        }
      } catch (cleanupError) {
        console.error('File cleanup error:', cleanupError)
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

/**
 * Save analysis results (AI done in React frontend)
 * POST /api/analysis/save
 */
export const saveAnalysis = async (req, res) => {
  try {
    const { 
      userId, 
      imageUrl, 
      riskLevel, 
      confidence, 
      indicators, 
      recommendations, 
      detailedMetrics, 
      age, 
      notes 
    } = req.body

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      })
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      })
    }

    if (!riskLevel || !confidence) {
      return res.status(400).json({
        success: false,
        message: 'Analysis results are required'
      })
    }

    console.log('💾 Saving analysis for user:', userId)

    // Save to database
    const analysis = new Analysis({
      userId,
      imageUrl,
      riskLevel,
      confidence,
      indicators: indicators || [],
      recommendations: recommendations || [],
      detailedMetrics: detailedMetrics || {},
      age: age ? parseInt(age) : null,
      notes: notes || ''
    })

    await analysis.save()

    console.log('✅ Analysis saved:', analysis._id)

    // Return result
    res.json({
      success: true,
      analysis: {
        id: analysis._id,
        riskLevel: analysis.riskLevel,
        confidence: analysis.confidence,
        indicators: analysis.indicators,
        recommendations: analysis.recommendations,
        detailedMetrics: analysis.detailedMetrics,
        imageUrl: analysis.imageUrl,
        createdAt: analysis.createdAt
      }
    })

  } catch (error) {
    console.error('❌ Save error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save analysis',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

/**
 * Get analysis history for user
 * GET /api/analysis/history/:userId
 */
export const getAnalysisHistory = async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 10, skip = 0 } = req.query

    const analyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean()

    const total = await Analysis.countDocuments({ userId })

    res.json({
      success: true,
      analyses,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > (parseInt(skip) + parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Error fetching history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis history'
    })
  }
}

/**
 * Get single analysis by ID
 * GET /api/analysis/:analysisId
 */
export const getAnalysisById = async (req, res) => {
  try {
    const { analysisId } = req.params

    const analysis = await Analysis.findById(analysisId).lean()

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      })
    }

    res.json({
      success: true,
      analysis
    })
  } catch (error) {
    console.error('Error fetching analysis:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis'
    })
  }
}

/**
 * Delete analysis
 * DELETE /api/analysis/:analysisId
 */
export const deleteAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.params
    const { userId } = req.body

    const analysis = await Analysis.findOne({ _id: analysisId, userId })

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      })
    }

    // Delete image file
    if (analysis.imageUrl) {
      try {
        const imagePath = path.join(process.cwd(), 'uploads', 'handwriting', path.basename(analysis.imageUrl))
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
          console.log('🗑️ Deleted image file:', imagePath)
        }
      } catch (fileError) {
        console.error('Error deleting image file:', fileError)
        // Continue with database deletion even if file deletion fails
      }
    }

    await Analysis.findByIdAndDelete(analysisId)

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting analysis:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete analysis'
    })
  }
}

/**
 * Get analysis statistics for user
 * GET /api/analysis/stats/:userId
 */
export const getAnalysisStats = async (req, res) => {
  try {
    const { userId } = req.params

    const analyses = await Analysis.find({ userId }).lean()

    if (analyses.length === 0) {
      return res.json({
        success: true,
        stats: {
          totalAnalyses: 0,
          averageConfidence: 0,
          riskDistribution: { Low: 0, Medium: 0, High: 0 },
          latestAnalysis: null
        }
      })
    }

    // Calculate stats
    const totalAnalyses = analyses.length
    const averageConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0) / totalAnalyses
    
    const riskDistribution = analyses.reduce((acc, a) => {
      acc[a.riskLevel] = (acc[a.riskLevel] || 0) + 1
      return acc
    }, { Low: 0, Medium: 0, High: 0 })

    const latestAnalysis = analyses[0]

    res.json({
      success: true,
      stats: {
        totalAnalyses,
        averageConfidence: Math.round(averageConfidence * 100) / 100,
        riskDistribution,
        latestAnalysis: {
          id: latestAnalysis._id,
          riskLevel: latestAnalysis.riskLevel,
          confidence: latestAnalysis.confidence,
          createdAt: latestAnalysis.createdAt
        }
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    })
  }
}
