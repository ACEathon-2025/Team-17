import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookmarkPlus, Folder, Search, Trash2, Edit, MoreVertical, 
  Plus, X, Check, Calendar, FileText, TrendingUp, Bookmark,
  Volume2, Focus as FocusIcon, Zap, Eye, Smile
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { collectionsService } from '../services/collectionsService'

const Collections = () => {
  const navigate = useNavigate()
  const [collections, setCollections] = useState({ collections: [], items: [] })
  const [selectedCollection, setSelectedCollection] = useState('favorites')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionIcon, setNewCollectionIcon] = useState('📁')
  const [newCollectionColor, setNewCollectionColor] = useState('blue')
  
  // Add Item Modal State
  const [newItemText, setNewItemText] = useState('')
  const [newItemTitle, setNewItemTitle] = useState('')

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = () => {
    const data = collectionsService.getAllCollections()
    setCollections(data)
  }

  const handleAddItem = () => {
    setNewItemText('')
    setNewItemTitle('')
    setShowItemModal(true)
  }

  const handleSaveNewItem = () => {
    if (!newItemText.trim()) {
      alert('Please enter some text')
      return
    }

    const title = newItemTitle.trim() || newItemText.substring(0, 50) + '...'
    collectionsService.addItem(newItemText, selectedCollection, { title })
    loadCollections()
    setShowItemModal(false)
    setNewItemText('')
    setNewItemTitle('')
  }

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Delete this item?')) {
      collectionsService.deleteItem(itemId)
      loadCollections()
    }
  }

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      alert('Please enter a collection name')
      return
    }

    collectionsService.createCollection(newCollectionName, newCollectionIcon, newCollectionColor)
    loadCollections()
    setNewCollectionName('')
    setNewCollectionIcon('📁')
    setNewCollectionColor('blue')
    setShowNewCollection(false)
  }

  const handleOpenItem = (item) => {
    setSelectedItem(item)
  }

  const handleSendToFeature = (feature) => {
    if (!selectedItem) return
    
    const storageKey = {
      'tts': 'tts-text',
      'focus': 'focus-text',
      'summarize': 'summarize-text',
      'quiz': 'quiz-text'
    }[feature]
    
    localStorage.setItem(storageKey, selectedItem.text)
    navigate(`/${feature === 'tts' ? 'text-to-speech' : feature}`)
  }

  const collectionItems = searchQuery
    ? collectionsService.searchItems(searchQuery)
    : collectionsService.getCollectionItems(selectedCollection)

  const stats = collectionsService.getStats()

  const availableIcons = ['📁', '⭐', '📚', '📰', '💼', '🎯', '🎨', '🔥', '💡', '🚀', '📝', '🎓', '💪', '🌟']
  const availableColors = [
    { name: 'blue', class: 'bg-blue-100 text-blue-600 border-blue-300' },
    { name: 'green', class: 'bg-green-100 text-green-600 border-green-300' },
    { name: 'purple', class: 'bg-purple-100 text-purple-600 border-purple-300' },
    { name: 'pink', class: 'bg-pink-100 text-pink-600 border-pink-300' },
    { name: 'yellow', class: 'bg-yellow-100 text-yellow-600 border-yellow-300' },
    { name: 'red', class: 'bg-red-100 text-red-600 border-red-300' },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
                My Collections
              </h1>
              <p className="text-[var(--text-secondary)] dyslexia-text">
                Save and organize your favorite texts
              </p>
            </div>
            <button
              onClick={() => setShowNewCollection(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors dyslexia-text flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Collection</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
              <div className="text-2xl font-bold text-primary-600">{stats.totalItems}</div>
              <div className="text-sm text-[var(--text-secondary)] dyslexia-text">Saved Items</div>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
              <div className="text-2xl font-bold text-green-600">{stats.totalCollections}</div>
              <div className="text-sm text-[var(--text-secondary)] dyslexia-text">Collections</div>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
              <div className="text-2xl font-bold text-purple-600">{stats.totalWords.toLocaleString()}</div>
              <div className="text-sm text-[var(--text-secondary)] dyslexia-text">Total Words</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-color)]">
              <h3 className="font-semibold text-[var(--text-primary)] dyslexia-text mb-4">Collections</h3>
              <div className="space-y-2">
                {collections.collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => setSelectedCollection(collection.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCollection === collection.id
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{collection.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium dyslexia-text text-[var(--text-primary)]">{collection.name}</div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {collection.items.length} items
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved texts..."
                  className="w-full pl-10 pr-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                onClick={handleAddItem}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dyslexia-text flex items-center space-x-2"
              >
                <BookmarkPlus className="h-5 w-5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {collectionItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)] hover:border-primary-300 transition-colors cursor-pointer"
                    onClick={() => handleOpenItem(item)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-[var(--text-primary)] dyslexia-text line-clamp-1">
                        {item.metadata.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteItem(item.id)
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] dyslexia-text line-clamp-3 mb-3">
                      {item.preview}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{item.metadata.wordCount} words</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {collectionItems.length === 0 && (
              <div className="text-center py-12">
                <Bookmark className="h-16 w-16 text-[var(--text-secondary)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-2">
                  No items yet
                </h3>
                <p className="text-[var(--text-secondary)] dyslexia-text mb-4">
                  Save texts from any feature to access them here
                </p>
                <button
                  onClick={handleAddItem}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors dyslexia-text"
                >
                  Add Your First Item
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Collection Modal */}
      <AnimatePresence>
        {showNewCollection && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text">
                  Create New Collection
                </h3>
                <button onClick={() => setShowNewCollection(false)}>
                  <X className="h-6 w-6 text-[var(--text-secondary)]" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Collection Name */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g., Study Notes, Work Articles..."
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                    Choose Icon
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {availableIcons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewCollectionIcon(icon)}
                        className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
                          newCollectionIcon === icon
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                    Choose Color
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setNewCollectionColor(color.name)}
                        className={`h-10 rounded-lg border-2 transition-all ${color.class} ${
                          newCollectionColor === color.name
                            ? 'ring-2 ring-offset-2 ring-primary-500'
                            : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowNewCollection(false)}
                  className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors dyslexia-text"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors dyslexia-text"
                >
                  Create Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Item Modal */}
      <AnimatePresence>
        {showItemModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text">
                  Add New Item
                </h3>
                <button onClick={() => setShowItemModal(false)}>
                  <X className="h-6 w-6 text-[var(--text-secondary)]" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    placeholder="Give your text a title..."
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Text Content */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                    Text Content
                  </label>
                  <textarea
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="Paste or type your text here..."
                    className="w-full h-64 px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ lineHeight: '1.8', letterSpacing: '0.05em' }}
                  />
                  <div className="text-sm text-[var(--text-secondary)] mt-2">
                    {newItemText.split(/\s+/).filter(w => w.trim()).length} words
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors dyslexia-text"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewItem}
                  disabled={!newItemText.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dyslexia-text disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Item Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text">
                  {selectedItem.metadata.title}
                </h3>
                <button onClick={() => setSelectedItem(null)}>
                  <X className="h-6 w-6 text-[var(--text-secondary)]" />
                </button>
              </div>

              <div className="prose max-w-none text-[var(--text-primary)] dyslexia-text mb-6 p-4 bg-[var(--bg-secondary)] rounded-lg" style={{ lineHeight: '1.8', letterSpacing: '0.05em' }}>
                {selectedItem.text}
              </div>

              <div className="text-sm text-[var(--text-secondary)] mb-6">
                {selectedItem.metadata.wordCount} words • Saved {new Date(selectedItem.createdAt).toLocaleDateString()}
              </div>

              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => handleSendToFeature('tts')}
                  className="flex flex-col items-center p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Volume2 className="h-5 w-5 text-blue-600 mb-1" />
                  <span className="text-xs dyslexia-text text-blue-600">Listen</span>
                </button>
                <button
                  onClick={() => handleSendToFeature('focus')}
                  className="flex flex-col items-center p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <FocusIcon className="h-5 w-5 text-purple-600 mb-1" />
                  <span className="text-xs dyslexia-text text-purple-600">Focus</span>
                </button>
                <button
                  onClick={() => handleSendToFeature('summarize')}
                  className="flex flex-col items-center p-3 bg-pink-100 dark:bg-pink-900/20 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/30 transition-colors"
                >
                  <Zap className="h-5 w-5 text-pink-600 mb-1" />
                  <span className="text-xs dyslexia-text text-pink-600">Summarize</span>
                </button>
                <button
                  onClick={() => handleSendToFeature('quiz')}
                  className="flex flex-col items-center p-3 bg-green-100 dark:bg-green-900/20 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                >
                  <FileText className="h-5 w-5 text-green-600 mb-1" />
                  <span className="text-xs dyslexia-text text-green-600">Quiz</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Collections
