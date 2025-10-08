import express from 'express'
import axios from 'axios'

const router = express.Router()

router.post('/url', async (req, res) => {
  try {
    const { url } = req.body
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    })
    
    res.json({
      success: true,
      html: response.data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router
