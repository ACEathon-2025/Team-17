/**
 * Collections Service - Manage saved texts and collections
 */

const STORAGE_KEY = 'voxa-collections'

export const collectionsService = {
  /**
   * Get all collections
   */
  getAllCollections() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : this.getDefaultCollections()
    } catch (error) {
      console.error('Error loading collections:', error)
      return this.getDefaultCollections()
    }
  },

  /**
   * Get default collections structure
   */
  getDefaultCollections() {
    return {
      collections: [
        {
          id: 'favorites',
          name: 'Favorites',
          icon: '⭐',
          color: 'yellow',
          items: [],
          createdAt: Date.now()
        },
        {
          id: 'study',
          name: 'Study Materials',
          icon: '📚',
          color: 'blue',
          items: [],
          createdAt: Date.now()
        },
        {
          id: 'articles',
          name: 'Articles',
          icon: '📰',
          color: 'green',
          items: [],
          createdAt: Date.now()
        }
      ],
      items: []
    }
  },

  /**
   * Save collections to storage
   */
  saveCollections(collections) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collections))
      return true
    } catch (error) {
      console.error('Error saving collections:', error)
      return false
    }
  },

  /**
   * Add a new text item
   */
  addItem(text, collectionId = 'favorites', metadata = {}) {
    const collections = this.getAllCollections()
    
    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: text.substring(0, 5000), // Limit text length
      preview: text.substring(0, 200),
      collectionId,
      metadata: {
        source: metadata.source || 'manual',
        title: metadata.title || this.generateTitle(text),
        wordCount: text.split(/\s+/).length,
        ...metadata
      },
      createdAt: Date.now(),
      lastAccessed: Date.now()
    }

    collections.items.push(newItem)
    
    // Add to collection
    const collection = collections.collections.find(c => c.id === collectionId)
    if (collection) {
      collection.items.push(newItem.id)
    }

    this.saveCollections(collections)
    return newItem
  },

  /**
   * Generate title from text
   */
  generateTitle(text) {
    const firstLine = text.split('\n')[0].trim()
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine || 'Untitled'
  },

  /**
   * Get items in a collection
   */
  getCollectionItems(collectionId) {
    const collections = this.getAllCollections()
    const collection = collections.collections.find(c => c.id === collectionId)
    
    if (!collection) return []
    
    return collection.items.map(itemId => 
      collections.items.find(item => item.id === itemId)
    ).filter(Boolean)
  },

  /**
   * Get a single item
   */
  getItem(itemId) {
    const collections = this.getAllCollections()
    return collections.items.find(item => item.id === itemId)
  },

  /**
   * Update an item
   */
  updateItem(itemId, updates) {
    const collections = this.getAllCollections()
    const itemIndex = collections.items.findIndex(item => item.id === itemId)
    
    if (itemIndex === -1) return false
    
    collections.items[itemIndex] = {
      ...collections.items[itemIndex],
      ...updates,
      lastAccessed: Date.now()
    }
    
    this.saveCollections(collections)
    return true
  },

  /**
   * Delete an item
   */
  deleteItem(itemId) {
    const collections = this.getAllCollections()
    
    // Remove from items array
    collections.items = collections.items.filter(item => item.id !== itemId)
    
    // Remove from all collections
    collections.collections.forEach(collection => {
      collection.items = collection.items.filter(id => id !== itemId)
    })
    
    this.saveCollections(collections)
    return true
  },

  /**
   * Create a new collection
   */
  createCollection(name, icon = '📁', color = 'gray') {
    const collections = this.getAllCollections()
    
    const newCollection = {
      id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      icon,
      color,
      items: [],
      createdAt: Date.now()
    }
    
    collections.collections.push(newCollection)
    this.saveCollections(collections)
    return newCollection
  },

  /**
   * Delete a collection (and optionally its items)
   */
  deleteCollection(collectionId, deleteItems = false) {
    const collections = this.getAllCollections()
    const collection = collections.collections.find(c => c.id === collectionId)
    
    if (!collection) return false
    
    // Don't allow deleting default collections
    if (['favorites', 'study', 'articles'].includes(collectionId)) {
      return false
    }
    
    if (deleteItems) {
      // Delete all items in collection
      collection.items.forEach(itemId => {
        collections.items = collections.items.filter(item => item.id !== itemId)
      })
    }
    
    // Remove collection
    collections.collections = collections.collections.filter(c => c.id !== collectionId)
    
    this.saveCollections(collections)
    return true
  },

  /**
   * Search items
   */
  searchItems(query) {
    const collections = this.getAllCollections()
    const lowerQuery = query.toLowerCase()
    
    return collections.items.filter(item => 
      item.text.toLowerCase().includes(lowerQuery) ||
      item.metadata.title.toLowerCase().includes(lowerQuery)
    )
  },

  /**
   * Get statistics
   */
  getStats() {
    const collections = this.getAllCollections()
    
    return {
      totalCollections: collections.collections.length,
      totalItems: collections.items.length,
      totalWords: collections.items.reduce((sum, item) => sum + item.metadata.wordCount, 0),
      recentItems: collections.items
        .sort((a, b) => b.lastAccessed - a.lastAccessed)
        .slice(0, 5)
    }
  },

  /**
   * Move item to different collection
   */
  moveItem(itemId, fromCollectionId, toCollectionId) {
    const collections = this.getAllCollections()
    
    const fromCollection = collections.collections.find(c => c.id === fromCollectionId)
    const toCollection = collections.collections.find(c => c.id === toCollectionId)
    
    if (!fromCollection || !toCollection) return false
    
    // Remove from old collection
    fromCollection.items = fromCollection.items.filter(id => id !== itemId)
    
    // Add to new collection
    if (!toCollection.items.includes(itemId)) {
      toCollection.items.push(itemId)
    }
    
    // Update item's collectionId
    const item = collections.items.find(i => i.id === itemId)
    if (item) {
      item.collectionId = toCollectionId
    }
    
    this.saveCollections(collections)
    return true
  }
}
