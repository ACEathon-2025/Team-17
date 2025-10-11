// client/src/utils/pdfGenerator.js
import jsPDF from 'jspdf'

export const generateAnalysisReport = (analysis, userData) => {
  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPos = margin

    // Extract user data
    const userName = typeof userData === 'string' ? userData : userData.name || 'Anonymous'
    const userAge = typeof userData === 'object' ? userData.age : null

    // Helper function to add text with auto-wrap
    const addText = (text, x, y, maxWidth, options = {}) => {
      const fontSize = options.fontSize || 11
      const fontStyle = options.fontStyle || 'normal'
      const color = options.color || [0, 0, 0]
      
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', fontStyle)
      doc.setTextColor(...color)
      
      const lines = doc.splitTextToSize(text, maxWidth)
      doc.text(lines, x, y)
      
      return y + (lines.length * fontSize * 0.4) + 2
    }

    // Header Background
    doc.setFillColor(99, 102, 241)
    doc.rect(0, 0, pageWidth, 50, 'F')

    // Logo/Icon
    doc.setFillColor(255, 255, 255)
    doc.circle(25, 25, 8, 'F')
    doc.setFillColor(99, 102, 241)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(99, 102, 241)
    doc.text('AI', 21, 28)

    // Title
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('VOXA AI Handwriting Analysis', 45, 25)

    // Subtitle
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(240, 240, 255)
    doc.text('Clinical-Grade Dyslexia Detection Report', 45, 35)

    yPos = 60

    // Patient Information Box
    doc.setFillColor(249, 250, 251)
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 35, 3, 3, 'F')
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(55, 65, 81)
    doc.text('Patient Information', margin + 5, yPos + 10)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(75, 85, 99)
    
    // Name
    doc.text(`Name: ${userName}`, margin + 5, yPos + 20)
    
    // Age - FIXED: Check multiple sources for age
    let displayAge = 'Not specified'
    if (userAge) {
      displayAge = `${userAge} years`
    } else if (analysis.age) {
      displayAge = `${analysis.age} years`
    }
    doc.text(`Age: ${displayAge}`, margin + 5, yPos + 27)
    
    // Date
    doc.text(
      `Report Date: ${new Date(analysis.createdAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`,
      pageWidth - margin - 70,
      yPos + 20
    )

    // Analysis ID
    doc.setFontSize(9)
    doc.setTextColor(156, 163, 175)
    const reportId = analysis._id ? String(analysis._id).substring(0, 12) : 'N/A'
    doc.text(`Report ID: ${reportId}`, pageWidth - margin - 70, yPos + 27)

    yPos += 45

    // Risk Level Section
    const riskColors = {
      'Low': [34, 197, 94],
      'Medium': [234, 179, 8],
      'High': [239, 68, 68]
    }

    const riskColor = riskColors[analysis.riskLevel] || [156, 163, 175]

    doc.setFillColor(...riskColor)
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 30, 3, 3, 'F')

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(
      `Risk Level: ${analysis.riskLevel || 'Unknown'}`,
      margin + 10,
      yPos + 15
    )

    doc.setFontSize(14)
    const confidence = analysis.confidence ? Math.round(analysis.confidence * 100) : 0
    doc.text(
      `Confidence: ${confidence}%`,
      pageWidth - margin - 60,
      yPos + 15
    )

    yPos += 40

    // Divider
    doc.setDrawColor(229, 231, 235)
    doc.setLineWidth(0.5)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    // Detailed Metrics Section
    if (analysis.detailedMetrics && Object.keys(analysis.detailedMetrics).length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(55, 65, 81)
      doc.text('Detailed Metrics', margin, yPos)
      yPos += 10

      const metrics = [
        { name: 'Letter Reversals', value: analysis.detailedMetrics.letterReversals || 0 },
        { name: 'Spacing Issues', value: analysis.detailedMetrics.spacingIssues || 0 },
        { name: 'Formation Issues', value: analysis.detailedMetrics.formationIssues || 0 },
        { name: 'Pressure Variation', value: analysis.detailedMetrics.pressureVariation || 0 },
        { name: 'Baseline Alignment', value: analysis.detailedMetrics.baselineAlignment || 0 },
        { name: 'Letter Sizing', value: analysis.detailedMetrics.letterSizing || analysis.detailedMetrics.formationIssues || 0 },
        { name: 'Stroke Control', value: analysis.detailedMetrics.strokeControl || analysis.detailedMetrics.pressureVariation || 0 },
        { name: 'Overall Risk Score', value: analysis.detailedMetrics.overallRisk || 0 }
      ]

      metrics.forEach((metric, index) => {
        if (index % 2 === 0 && index > 0) {
          yPos += 8
        }

        if (yPos > pageHeight - 40) {
          doc.addPage()
          yPos = margin
        }

        const xPos = (index % 2 === 0) ? margin : pageWidth / 2 + 5
        const barWidth = (pageWidth / 2) - margin - 10
        const barHeight = 6

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(75, 85, 99)
        doc.text(metric.name, xPos, yPos)

        doc.setFont('helvetica', 'bold')
        doc.text(`${metric.value}%`, xPos + barWidth - 15, yPos)

        doc.setFillColor(229, 231, 235)
        doc.roundedRect(xPos, yPos + 2, barWidth, barHeight, 2, 2, 'F')

        const fillWidth = Math.max(0, Math.min(100, metric.value)) / 100 * barWidth
        if (fillWidth > 0) {
          const barColor = metric.value > 70 ? [239, 68, 68] : 
                          metric.value > 40 ? [234, 179, 8] : 
                          [34, 197, 94]
          doc.setFillColor(...barColor)
          doc.roundedRect(xPos, yPos + 2, fillWidth, barHeight, 2, 2, 'F')
        }
      })

      yPos += 20
    }

    if (yPos > pageHeight - 80) {
      doc.addPage()
      yPos = margin
    }

    doc.setDrawColor(229, 231, 235)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    // Detected Indicators
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(55, 65, 81)
    doc.text('Detected Indicators', margin, yPos)
    yPos += 8

    if (analysis.indicators && Array.isArray(analysis.indicators) && analysis.indicators.length > 0) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(75, 85, 99)

      analysis.indicators.forEach((indicator) => {
        if (yPos > pageHeight - 30) {
          doc.addPage()
          yPos = margin
        }

        doc.setFillColor(99, 102, 241)
        doc.circle(margin + 2, yPos - 1, 1.5, 'F')

        const maxWidth = pageWidth - margin * 2 - 10
        yPos = addText(String(indicator), margin + 8, yPos, maxWidth, { fontSize: 10 })
        yPos += 3
      })
    } else {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(156, 163, 175)
      doc.text('No specific indicators detected.', margin, yPos)
      yPos += 8
    }

    yPos += 5

    if (yPos > pageHeight - 80) {
      doc.addPage()
      yPos = margin
    }

    doc.setDrawColor(229, 231, 235)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    // Recommendations
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(55, 65, 81)
    doc.text('Recommendations', margin, yPos)
    yPos += 8

    if (analysis.recommendations && Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(75, 85, 99)

      analysis.recommendations.forEach((recommendation, index) => {
        if (yPos > pageHeight - 30) {
          doc.addPage()
          yPos = margin
        }

        doc.setFillColor(99, 102, 241)
        doc.circle(margin + 3, yPos - 1, 2.5, 'F')
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text(`${index + 1}`, margin + 1.5, yPos + 1)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(75, 85, 99)
        const maxWidth = pageWidth - margin * 2 - 12
        yPos = addText(String(recommendation), margin + 10, yPos, maxWidth, { fontSize: 10 })
        yPos += 4
      })
    }

    if (analysis.notes && String(analysis.notes).trim()) {
      yPos += 5

      if (yPos > pageHeight - 40) {
        doc.addPage()
        yPos = margin
      }

      doc.setDrawColor(229, 231, 235)
      doc.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 10

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(55, 65, 81)
      doc.text('Additional Notes', margin, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(75, 85, 99)
      
      const maxWidth = pageWidth - margin * 2
      yPos = addText(String(analysis.notes), margin, yPos, maxWidth, { fontSize: 10 })
    }

    // Footer
    const totalPages = doc.internal.getNumberOfPages()
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      
      doc.setDrawColor(229, 231, 235)
      doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20)

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(156, 163, 175)
      
      doc.text(
        'VOXA AI Handwriting Analysis • Not a medical diagnosis • Consult a professional',
        margin,
        pageHeight - 12
      )

      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin - 30,
        pageHeight - 12
      )

      doc.setFontSize(8)
      doc.text(
        'This report is for screening purposes only. Please consult with a healthcare professional for formal diagnosis.',
        margin,
        pageHeight - 6
      )
    }

    const date = new Date().toISOString().split('T')[0]
    const filename = `VOXA_Analysis_${userName.replace(/[^a-zA-Z0-9]/g, '_')}_${date}.pdf`

    doc.save(filename)

    console.log('✅ PDF Report generated successfully')
    return true

  } catch (error) {
    console.error('❌ PDF generation error:', error)
    alert('Failed to generate PDF report. Please try again.')
    return false
  }
}

export default { generateAnalysisReport }
