// client/src/App.jsx
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TextToSpeech from './pages/TextToSpeech.jsx'
import Translation from './pages/Translation.jsx'
import FocusMode from './pages/FocusMode.jsx'
import Settings from './pages/Settings.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Summarize from './pages/Summarize.jsx'
import Quiz from './pages/Quiz.jsx'
import SpeedReading from './pages/SpeedReading.jsx'
import { BionicProvider } from './context/BionicContext'
import Collections from './pages/Collections'
import { EyeComfortProvider } from './context/EyeComfortContext'
import EyeBreakOverlay from './components/EyeBreakOverlay'
import Goals from './pages/Goals'


function App() {
  useEffect(() => {
    // Load Lexend font
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <SettingsProvider>
            <BionicProvider>
               <EyeComfortProvider>
                <Router>
                  <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
                    <Navbar />
                    <main>
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/text-to-speech" element={<TextToSpeech />} />
                        <Route path="/translation" element={<Translation />} />
                        <Route path="/focus-mode" element={<FocusMode />} />
                        <Route path="/summarize" element={<Summarize />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/speed-reading" element={<SpeedReading />} /> {/* NEW! */}
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/collections" element={<Collections />} />
                        <Route path="/goals" element={<Goals />} />
                      </Routes>
                      <EyeBreakOverlay /> 
                    </main>
                    <Footer />
                  </div>
                </Router>
              </EyeComfortProvider>
            </BionicProvider>
          </SettingsProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App