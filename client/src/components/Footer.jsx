// client/src/components/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Brain, Heart, Github, Twitter, Mail, BookOpen,
  Sparkles, Shield, Globe, ArrowRight
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Core Features',
      links: [
        { name: 'AI Handwriting Analysis', href: '/handwriting-analysis', featured: true },
        { name: 'Text to Speech', href: '/text-to-speech' },
        { name: 'Translation', href: '/translation' },
        { name: 'Focus Mode', href: '/focus-mode' },
        { name: 'Summarization', href: '/summarization' },
        { name: 'Dashboard', href: '/dashboard' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Accessibility Guide', href: '/accessibility' },
        { name: 'Help Center', href: '/help' },
        { name: 'Community', href: '/community' },
        { name: 'Blog', href: '/blog' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'GDPR Compliance', href: '/gdpr' },
      ]
    }
  ]

  const socialLinks = [
    { 
      name: 'GitHub', 
      icon: Github, 
      href: 'https://github.com/voxa',
      color: 'hover:text-gray-900 dark:hover:text-white'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      href: 'https://twitter.com/voxa',
      color: 'hover:text-blue-500'
    },
    { 
      name: 'Email', 
      icon: Mail, 
      href: 'mailto:support@voxa.com',
      color: 'hover:text-purple-500'
    },
  ]

  const features = [
    { icon: Brain, text: '95-99% Accurate AI' },
    { icon: Shield, text: 'GDPR Compliant' },
    { icon: Globe, text: '50+ Languages' },
    { icon: Heart, text: '100% Free' }
  ]

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <div className="p-2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 dark:text-white">
                VOXA
              </span>
            </Link>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              AI-powered dyslexia detection and accessible reading platform. 
              Making education inclusive for everyone.
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={i}
                    className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400"
                  >
                    <Icon className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">{feature.text}</span>
                  </div>
                )
              })}
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ${social.color} transition-all hover:scale-110`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={`group inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${
                        link.featured ? 'font-bold' : ''
                      }`}
                    >
                      {link.featured && (
                        <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
                      )}
                      {link.name}
                      <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="py-8 border-t border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-purple-500" />
                Try AI Handwriting Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Detect dyslexia indicators with 95-99% accuracy. Free forever.
              </p>
            </div>
            <Link
              to="/handwriting-analysis"
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              Start Analysis
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} VOXA. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Privacy
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Terms
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link to="/gdpr" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                GDPR
              </Link>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 mx-1.5 animate-pulse" />
            <span>for accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
