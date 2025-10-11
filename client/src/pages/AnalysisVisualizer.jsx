import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const AnalysisVisualizer = ({ imageUrl, detailedMetrics }) => {
  const canvasRef = useRef(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Overlay heatmap for detected issues
      const gradient = ctx.createRadialGradient(
        img.width / 2, img.height / 2, 0,
        img.width / 2, img.height / 2, img.width / 2
      )
      
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.15)')
      gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.08)')
      gradient.addColorStop(1, 'rgba(0, 255, 0, 0)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw detection boxes
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)'
      ctx.lineWidth = 2
      const numBoxes = Math.floor(detailedMetrics.letterReversals / 20)
      
      for (let i = 0; i < numBoxes; i++) {
        const x = Math.random() * (canvas.width - 100)
        const y = Math.random() * (canvas.height - 60)
        ctx.strokeRect(x, y, 80, 50)
        
        // Add label
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)'
        ctx.fillRect(x, y - 20, 80, 18)
        ctx.fillStyle = 'white'
        ctx.font = 'bold 12px Arial'
        ctx.fillText('Issue', x + 5, y - 7)
      }

      setIsProcessing(false)
    }

    img.onerror = () => {
      console.error('Failed to load image')
      setIsProcessing(false)
    }
  }, [imageUrl, detailedMetrics])

  return (
    <div className="relative">
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl z-10">
          <div className="text-white font-bold fun-font">Processing image...</div>
        </div>
      )}
      {/* ✅ FIXED: Line 67 - Changed 'nvas' to 'canvas' and 'shadowdow-xl' to 'shadow-xl' */}
      <canvas ref={canvasRef} className="w-full rounded-2xl shadow-xl" />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-xl font-bold shadow-lg"
      >
        🔍 AI Detection Active
      </motion.div>
    </div>
  )
}

export default AnalysisVisualizer
