import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import regenerator-runtime for speech recognition
import 'regenerator-runtime/runtime'

// Test speech recognition support
const testSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  
  if (SpeechRecognition) {
    console.log('✅ Speech Recognition: Supported')
    try {
      const test = new SpeechRecognition()
      console.log('✅ Speech Recognition: Can instantiate')
      return true
    } catch (error) {
      console.error('❌ Speech Recognition: Cannot instantiate', error)
      return false
    }
  } else {
    console.error('❌ Speech Recognition: Not supported in this browser')
    console.log('Browser info:', {
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
      platform: navigator.platform
    })
    return false
  }
}

// Run test on load
testSpeechRecognition()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
