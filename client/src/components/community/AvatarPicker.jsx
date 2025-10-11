import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const AvatarPicker = ({ currentAvatar, onSelect }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)

  const avatars = [
    // People
    '😊', '😎', '🤓', '🥳', '🤩', '🥰', '😇', '🤗', '🤠', '🥸',
    '😴', '🤯', '🥺', '😈', '👻', '🤖', '👽', '🎃', '🎅', '🧙',
    // Animals
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦄', '🐝',
    // Fantasy
    '🌟', '✨', '💫', '🔥', '💧', '🌈', '☀️', '🌙', '⭐', '🪐',
    '🚀', '🛸', '👑', '💎', '🎨', '🎭', '🎪', '🎬', '🎮', '🎲'
  ]

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar)
    onSelect(avatar)
  }

  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
      {avatars.map((avatar, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelect(avatar)}
          className={`relative aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all ${
            selectedAvatar === avatar
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg ring-4 ring-purple-300'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {avatar}
          {selectedAvatar === avatar && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Check className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  )
}

export default AvatarPicker
