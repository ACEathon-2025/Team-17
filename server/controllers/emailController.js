import nodemailer from 'nodemailer'

export const emailAnalysisReport = async (req, res) => {
  try {
    const { email, analysis, userName } = req.body

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    const htmlContent = `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">VOXA AI Analysis Report</h1>
        <h2>Student: ${userName}</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px;">
          <h3 style="color: ${analysis.riskLevel === 'High' ? '#dc2626' : analysis.riskLevel === 'Medium' ? '#eab308' : '#22c55e'}">
            Risk Level: ${analysis.riskLevel}
          </h3>
          <p>Confidence: ${Math.round(analysis.confidence * 100)}%</p>
          <h4>Detected Indicators:</h4>
          <ul>
            ${analysis.indicators.map(ind => `<li>${ind}</li>`).join('')}
          </ul>
          <h4>Recommendations:</h4>
          <ul>
            ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          This is an automated report from VOXA AI. Please consult a professional for formal diagnosis.
        </p>
      </div>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `VOXA AI Analysis Report - ${userName}`,
      html: htmlContent
    })

    res.json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ success: false, message: 'Failed to send email' })
  }
}
