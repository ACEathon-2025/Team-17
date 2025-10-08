// client/src/components/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Heart, Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Text to Speech', href: '/text-to-speech' },
        { name: 'Translation', href: '/translation' },
        { name: 'Focus Mode', href: '/focus-mode' },
        { name: 'Dashboard', href: '/dashboard' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Accessibility Guide', href: '/accessibility' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Report Bug', href: '/report' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR Compliance', href: '/gdpr' },
      ]
    }
  ]

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/voxa' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/voxa' },
    { name: 'Email', icon: Mail, href: 'mailto:support@voxa.com' },
  ]

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold dyslexia-text text-[var(--text-primary)]">
                VOXA
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] dyslexia-text mb-4 leading-relaxed">
              Making reading inclusive, accessible, and empowering for everyone.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-primary-600 hover:bg-primary-100 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4 dyslexia-text">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors dyslexia-text"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center">
          <p className="text-[var(--text-secondary)] dyslexia-text">
            © {currentYear} VOXA. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-[var(--text-secondary)] dyslexia-text mr-2">
              Made with
            </span>
            <Heart className="h-4 w-4 text-red-500 mx-1" />
            <span className="text-[var(--text-secondary)] dyslexia-text ml-2">
              for accessibility
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer