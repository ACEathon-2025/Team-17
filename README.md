# 📚 VOXA - AI-Powered Accessible Reading Platform

> **Making reading inclusive, accessible, and empowering for everyone through AI and machine learning.**

[![Version](https://img.shields.io/badge/version-0.9.0--beta-orange.svg)](https://github.com/yourusername/voxa)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node-18+-339933.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/status-in%20development-yellow.svg)](https://github.com/yourusername/voxa)

VOXA is a **comprehensive accessibility-focused reading platform** designed for individuals with dyslexia, ADHD, and reading difficulties. Built with React and powered by AI, it provides intelligent tools to make reading more accessible, enjoyable, and productive.

> ⚠️ **Project Status**: Currently in active development. Some features may be incomplete or undergoing refinement.

---

## 🚀 Current Features (Work in Progress)

### ✅ **Implemented Features**

#### **1. Text-to-Speech** 🔊
- ✅ Natural voice synthesis with Web Speech API
- ✅ Customizable speed, pitch, and volume controls
- ✅ Real-time word highlighting during playback
- ✅ Edit/Read mode toggle
- ✅ Click-to-define dictionary integration
- ✅ Bionic Reading Mode support
- ✅ Save to Collections
- 🚧 Additional voice options (in progress)

#### **2. Real-time Translation** 🌍
- ✅ Instant translation to 50+ languages
- ✅ MyMemory API integration (50,000 chars/day free)
- ✅ Dyslexia-friendly typography
- ✅ Auto-translation toggle
- ✅ Dual-language dictionary lookup
- ✅ Translation history tracking
- 🚧 Offline translation mode (planned)

#### **3. Focus Mode** 🎯
- ✅ Distraction-free reading environment
- ✅ Word-by-word or multi-word display
- ✅ Adjustable reading speed (100-400 WPM)
- ✅ Pause-to-lookup functionality
- ✅ Visual progress tracking
- ✅ Bionic Reading Mode integration
- ✅ Cross-feature text sharing
- 🚧 Customizable overlay colors (in progress)

#### **4. AI-Powered Summarization** ⚡
- ✅ Hugging Face AI integration (facebook/bart-large-cnn)
- ✅ Three length options (short, medium, long)
- ✅ Compression statistics
- ✅ Bionic Reading for summaries
- ✅ Save summaries to Collections
- ✅ Challenge tracking integration
- 🚧 Multi-model support (planned)
- 🚧 Custom summary templates (planned)

#### **5. Reading Comprehension Quiz** 🧠
- ✅ AI-generated multiple choice questions
- ✅ Instant feedback with visual indicators
- ✅ Score tracking and history
- ✅ Pass/fail grade system
- ✅ Challenge progress tracking
- 🚧 Question difficulty levels (in progress)
- 🚧 Detailed answer explanations (planned)

#### **6. Speed Reading Trainer** ⚡
- ✅ 5 training levels (150-600 WPM)
- ✅ 20+ practice texts
- ✅ Comprehension checks
- ✅ Progress charts (WPM & comprehension)
- ✅ Personalized recommendations
- ✅ Achievement system
- 🚧 Custom text upload (in progress)
- 🚧 Advanced RSVP techniques (planned)

#### **7. Bionic Reading Mode** ⚡
- ✅ Bold first letters for faster reading
- ✅ Works across all features
- ✅ 3 intensity levels (Light, Medium, Bold)
- ✅ Keyboard toggle support
- ✅ Persistent preferences
- 🚧 Custom bolding patterns (planned)

#### **8. Collections System** 📚
- ✅ Save texts from any feature
- ✅ Custom folder organization with emojis
- ✅ 4 default collections
- ✅ Search functionality
- ✅ Send saved texts to features
- ✅ Metadata tracking
- 🚧 Tags and filters (in progress)
- 🚧 Export collections (planned)
- 🚧 Sharing functionality (planned)

#### **9. Reading Goals & Challenges** 🎯
- ✅ Daily reading goals (words/minutes)
- ✅ Weekly consistency tracking
- ✅ Monthly word count targets
- ✅ Streak system with fire counter
- ✅ 5 unique challenges with rewards
- ✅ Points and achievement system
- ✅ Circular progress visualization
- 🚧 Custom challenges (planned)
- 🚧 Social leaderboards (planned)

#### **10. Eye Comfort Timer** 👁️
- ✅ 20-20-20 rule implementation
- ✅ Customizable intervals (10-30 min)
- ✅ Full-screen break overlays
- ✅ Adjustable break duration
- ✅ Sound notifications
- ✅ Statistics tracking
- ✅ Visible navbar timer
- 🚧 Eye exercises guide (planned)

#### **11. Enhanced Analytics Dashboard** 📈
- ✅ AI-powered insights
- ✅ Weekly activity charts
- ✅ Reading streak tracking
- ✅ Feature usage breakdown
- ✅ Collections widget
- ✅ Goals progress widget
- ✅ Eye Comfort statistics
- ✅ Quick Actions launcher
- 🚧 Advanced AI recommendations (in progress)
- 🚧 Export analytics (planned)

### 🤖 **AI/ML Features**

#### **Dictionary & Pronunciation** 📖
- ✅ Click-to-define in all features
- ✅ Free Dictionary API (130+ languages)
- ✅ Audio pronunciation
- ✅ Synonyms, antonyms, etymology
- ✅ Smart caching
- 🚧 Offline dictionary (planned)

#### **Sentiment Analysis** 😊
- ✅ Real-time emotional tone detection
- ✅ Visual sentiment indicators
- ✅ Emotionally charged word highlighting
- 🚧 Advanced emotion classification (planned)

#### **Cross-Feature Integration** ✨
- ✅ One-click text transfer between features
- ✅ Smart workflow suggestions
- ✅ localStorage-based instant transfers
- 🚧 Feature recommendation engine (in progress)

---

## 🛠 Tech Stack

### **Frontend**
- React 18.3 with Hooks
- Vite 5.4 (HMR, fast builds)
- Tailwind CSS 3.4
- Framer Motion 11.5 (animations)
- Recharts 2.12 (charts)
- Lucide React 0.441 (icons)
- React Router 6.26

### **AI/ML**
- Sentiment v5.0.2 (client-side analysis)
- Hugging Face Inference API
- Web Speech API
- Free Dictionary API

### **Backend**
- Node.js 18+
- Express.js 4.19
- MongoDB 8.0
- Mongoose 8.6
- Supabase (auth)
- Axios 1.7

---

## 📁 Project Structure

voxa/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ │ ├── Navbar.jsx # ✅ Professional dropdown navbar
│ │ │ ├── WordTooltip.jsx # ✅ Dictionary tooltip
│ │ │ ├── BionicText.jsx # ✅ Bionic reading
│ │ │ ├── EyeBreakOverlay.jsx # ✅ Eye break screen
│ │ │ └── ... (15+ components)
│ │ ├── context/ # React Context providers
│ │ │ ├── AuthContext.jsx # ✅ Authentication
│ │ │ ├── BionicContext.jsx # ✅ Bionic settings
│ │ │ ├── EyeComfortContext.jsx # ✅ Eye timer
│ │ │ └── ThemeContext.jsx # ✅ Dark/light mode
│ │ ├── pages/ # Main application pages
│ │ │ ├── Dashboard.jsx # ✅ Enhanced with 4 widgets
│ │ │ ├── TextToSpeech.jsx # ✅ Complete TTS
│ │ │ ├── Translation.jsx # ✅ 50+ languages
│ │ │ ├── FocusMode.jsx # ✅ Distraction-free
│ │ │ ├── Summarize.jsx # ✅ AI summarization
│ │ │ ├── Quiz.jsx # ✅ AI quiz generation
│ │ │ ├── SpeedReading.jsx # ✅ RSVP trainer
│ │ │ ├── Collections.jsx # ✅ Save & organize
│ │ │ ├── Goals.jsx # ✅ Challenges & streaks
│ │ │ └── Settings.jsx # ✅ Full customization
│ │ ├── services/ # Business logic layer
│ │ │ ├── dictionaryService.js # ✅ Word lookup
│ │ │ ├── summarizationService.js # ✅ AI summarization
│ │ │ ├── collectionsService.js # ✅ localStorage management
│ │ │ ├── goalsService.js # ✅ Goals tracking
│ │ │ ├── eyeComfortService.js # ✅ Timer logic
│ │ │ └── ... (10+ services)
│ │ └── App.jsx # ✅ Main router
│ └── package.json
├── server/ # Express backend
│ ├── controllers/ # 🚧 In progress
│ ├── models/ # 🚧 Database schemas
│ ├── routes/ # 🚧 API endpoints
│ └── server.js
├── .env.example # ✅ Environment template
└── README.md # ✅ This file

text

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (Recommended: v20 LTS)
- MongoDB (local or Atlas)
- Supabase account (free tier)
- Hugging Face account (free tier)

### Installation

1. Clone repository
git clone https://github.com/yourusername/voxa.git
cd voxa

2. Install backend dependencies
cd server
npm install

3. Install frontend dependencies
cd ../client
npm install

4. Set up environment variables
Copy .env.example to .env in both client/ and server/
Fill in your API keys (see Configuration section below)
5. Start backend server
cd server
npm run dev # Runs on http://localhost:5000

6. Start frontend (new terminal)
cd client
npm run dev # Runs on http://localhost:5173

text

### Configuration

**Server `.env`:**
MONGODB_URI=mongodb://localhost:27017/voxa
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
HUGGINGFACE_API_KEY=hf_your_token
PORT=5000
NODE_ENV=development

text

**Client `.env`:**
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

text

#### API Key Setup

1. **Supabase** (Required for auth)
   - Create free account at https://supabase.com
   - Create new project
   - Copy URL and anon key from Settings > API

2. **Hugging Face** (Required for summarization)
   - Create free account at https://huggingface.co
   - Go to Settings > Access Tokens
   - Create token with "Read" access

3. **Free Dictionary API** (No key needed) ✅
4. **MyMemory Translation** (No key needed) ✅

---

## 🎯 Current Development Status

### ✅ **Phase 1: Core Features** (COMPLETED)
- [x] Basic React app setup with Vite
- [x] Authentication with Supabase
- [x] Text-to-Speech implementation
- [x] Real-time Translation
- [x] Focus Mode
- [x] AI Summarization
- [x] Quiz Generation
- [x] Speed Reading Trainer

### ✅ **Phase 2: Advanced Features** (COMPLETED)
- [x] Bionic Reading Mode
- [x] Collections System
- [x] Reading Goals & Challenges
- [x] Eye Comfort Timer
- [x] Enhanced Dashboard with widgets
- [x] Professional Navbar with dropdown
- [x] Cross-feature integration

### 🚧 **Phase 3: Refinement & Polish** (IN PROGRESS)
- [x] Professional README documentation
- [ ] Complete backend API implementation
- [ ] Database schema optimization
- [ ] Error handling improvements
- [ ] Loading states refinement
- [ ] Mobile responsiveness testing
- [ ] Cross-browser compatibility testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] User testing & feedback

### 📋 **Phase 4: Production Ready** (UPCOMING)
- [ ] Complete unit test coverage
- [ ] E2E testing with Playwright
- [ ] CI/CD pipeline setup
- [ ] Docker containerization
- [ ] Production deployment (Vercel/Railway)
- [ ] Domain & SSL setup
- [ ] Analytics integration
- [ ] User documentation
- [ ] Video tutorials
- [ ] Public beta launch

---

## 🐛 Known Issues & Limitations

### Current Known Issues
- ⚠️ Summarization first-time load takes 20s (Hugging Face model wake-up)
- ⚠️ Some features need backend API completion
- ⚠️ Mobile navbar overflow on small screens (being fixed)
- ⚠️ Collections search needs fuzzy matching improvement
- ⚠️ Dashboard charts occasionally flicker on data update

### Browser Compatibility
- ✅ Chrome 90+ (fully supported)
- ✅ Firefox 88+ (fully supported)
- ✅ Safari 14+ (fully supported)
- ✅ Edge 90+ (fully supported)
- ⚠️ Safari iOS (voice selection limited by browser)

### Planned Improvements
- Better error messages for API failures
- Offline mode with Service Workers
- Progressive Web App (PWA) support
- Enhanced mobile touch gestures
- Keyboard shortcuts documentation

---

## 📊 Roadmap

### **v0.9.0-beta** (Current) - October 2025
- ✅ 11 major features implemented
- ✅ Cross-feature integration
- ✅ Professional UI with animations
- 🚧 Final bug fixes and polish

### **v1.0.0** (Planned) - December 2025
- [ ] Complete backend API
- [ ] Production deployment
- [ ] Comprehensive testing
- [ ] Public beta launch
- [ ] Documentation site

### **v1.1.0** (Q1 2026)
- [ ] OCR text extraction
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Voice commands

### **v2.0.0** (Q3 2026)
- [ ] Social features & leaderboards
- [ ] Teacher dashboard
- [ ] Advanced AI insights (GPT-4)
- [ ] E-book integration (EPUB, PDF)
- [ ] Multi-language UI

---

## 🤝 Contributing

We welcome contributions! However, please note:

> 🚧 **The project is still in active development.** Core architecture may change. Please coordinate with maintainers before starting major work.

### How to Contribute
1. Check [open issues](https://github.com/yourusername/voxa/issues)
2. Comment on issue you want to work on
3. Fork repository
4. Create feature branch (`git checkout -b feature/AmazingFeature`)
5. Commit changes (`git commit -m 'Add AmazingFeature'`)
6. Push to branch (`git push origin feature/AmazingFeature`)
7. Open Pull Request

### Development Guidelines
- Follow existing code style (Prettier + ESLint)
- Write meaningful commit messages
- Test on multiple browsers
- Update documentation for new features
- Keep accessibility in mind (WCAG 2.1)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- **OpenDyslexic & Lexend** - Accessible fonts
- **Hugging Face** - AI infrastructure
- **Free Dictionary API** - Word definitions
- **MyMemory** - Translation service
- **Supabase** - Backend infrastructure
- **Open Source Community** - Amazing tools

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/voxa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/voxa/discussions)

> ⚠️ **Note**: Email, Discord, and social media coming after v1.0 launch.

---

## 💡 Why VOXA?

**700 million people worldwide** struggle with dyslexia and reading difficulties. VOXA aims to:

✨ Make reading accessible with dyslexia-friendly design  
✨ Break language barriers with instant translation  
✨ Save time with AI-powered summarization  
✨ Improve comprehension with interactive quizzes  
✨ Protect eye health with 20-20-20 reminders  
✨ Gamify learning with goals and challenges  
✨ Remain free and open-source forever  

---

**Made with ❤️ for accessibility and inclusive learning.**

*VOXA - Empowering everyone to read, learn, and grow.*

---

**Last Updated**: October 8, 2025  
**Version**: 0.9.0-beta (In Development)  
**Status**: 🚧 Active Development  
**Target Release**: v1.0.0 - December 2025  

---

## ⚠️ Disclaimer

This project is currently in **beta development**. Features are subject to change. Not recommended for production use until v1.0 release. Use at your own risk. Always keep backups of important data.

---