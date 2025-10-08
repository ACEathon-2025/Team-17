import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Check, Folder } from 'lucide-react'
import { collectionsService } from '../services/collectionsService'

const SaveToCollection = ({ text, title, source = 'manual', className = '' }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(null)

  const handleSave = (collectionId) => {
    const collections = collectionsService.getAllCollections()
    const collection = collections.collections.find(c => c.id === collectionId)
    
    collectionsService.addItem(text, collectionId, { title, source })
    setSelectedCollection(collection)
    setSaved(true)
    setShowMenu(false)
    
    setTimeout(() => {
      setSaved(false)
      setSelectedCollection(null)
    }, 3000)
  }

  const collections = collectionsService.getAllCollections().collections

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={saved}
        className={`p-2 rounded-lg transition-all ${
          saved
            ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800'
        }`}
        title={saved ? 'Saved!' : 'Save to collection'}
      >
        {saved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 dyslexia-text">
                  Save to Collection
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleSave(collection.id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                  >
                    <span className="text-2xl">{collection.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100 dyslexia-text">
                        {collection.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {collection.items.length} items
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {saved && selectedCollection && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute right-0 mt-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-300 dyslexia-text whitespace-nowrap z-20"
        >
          Saved to {selectedCollection.name} ✓
        </motion.div>
      )}
    </div>
  )
}

export default SaveToCollection
