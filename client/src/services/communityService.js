// Community Service - Manages all social features
class CommunityService {
  constructor() {
    this.storageKey = 'voxa-community'
    this.init()
  }

  init() {
    const data = this.getData()
    if (!data.channels) {
      // Initialize default channels
      const defaultData = {
        channels: [
          {
            id: 'general',
            name: 'General Discussion',
            description: 'Talk about anything reading-related',
            icon: '💬',
            color: 'blue',
            posts: [],
            members: 0
          },
          {
            id: 'book-recommendations',
            name: 'Book Recommendations',
            description: 'Share and discover great books',
            icon: '📚',
            color: 'purple',
            posts: [],
            members: 0
          },
          {
            id: 'reading-tips',
            name: 'Reading Tips & Tricks',
            description: 'Share techniques to improve reading',
            icon: '💡',
            color: 'yellow',
            posts: [],
            members: 0
          },
          {
            id: 'help-support',
            name: 'Help & Support',
            description: 'Get help with VOXA features',
            icon: '🆘',
            color: 'red',
            posts: [],
            members: 0
          },
          {
            id: 'success-stories',
            name: 'Success Stories',
            description: 'Share your reading journey',
            icon: '🎉',
            color: 'green',
            posts: [],
            members: 0
          }
        ],
        users: {},
        notifications: [],
        lastActivity: new Date().toISOString()
      }
      this.saveData(defaultData)
    }
  }

  getData() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || {}
    } catch {
      return {}
    }
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  // Get current user info
  getCurrentUser(email) {
    const data = this.getData()
    if (!data.users[email]) {
      // Create new user profile
      data.users[email] = {
        id: email,
        name: email.split('@')[0],
        email: email,
        avatar: this.getRandomAvatar(),
        joinedAt: new Date().toISOString(),
        reputation: 0,
        badges: [],
        posts: 0,
        comments: 0,
        likes: 0
      }
      this.saveData(data)
    }
    return data.users[email]
  }

  getRandomAvatar() {
    const avatars = ['🧑', '👨', '👩', '🧔', '👱', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱', '👨‍🦳', '👩‍🦳']
    return avatars[Math.floor(Math.random() * avatars.length)]
  }

  // Get all channels
  getChannels() {
    const data = this.getData()
    return data.channels || []
  }

  // Get channel by ID
  getChannel(channelId) {
    const data = this.getData()
    return data.channels?.find(c => c.id === channelId)
  }

  // Create new post
  createPost(channelId, postData, userEmail) {
    const data = this.getData()
    const user = this.getCurrentUser(userEmail)
    const channel = data.channels.find(c => c.id === channelId)
    
    if (!channel) return null

    const post = {
      id: Date.now().toString(),
      channelId,
      author: user,
      title: postData.title,
      content: postData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: [],
      comments: [],
      views: 0,
      isPinned: false,
      tags: postData.tags || []
    }

    channel.posts.unshift(post)
    user.posts++
    user.reputation += 5

    this.saveData(data)
    return post
  }

  // Get posts from channel
  getPosts(channelId, sortBy = 'recent') {
    const channel = this.getChannel(channelId)
    if (!channel) return []

    let posts = [...channel.posts]

    switch (sortBy) {
      case 'popular':
        posts.sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length))
        break
      case 'oldest':
        posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'mostLiked':
        posts.sort((a, b) => b.likes.length - a.likes.length)
        break
      default: // recent
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return posts
  }

  // Add comment to post
  addComment(channelId, postId, commentData, userEmail) {
    const data = this.getData()
    const user = this.getCurrentUser(userEmail)
    const channel = data.channels.find(c => c.id === channelId)
    const post = channel?.posts.find(p => p.id === postId)

    if (!post) return null

    const comment = {
      id: Date.now().toString(),
      author: user,
      content: commentData.content,
      createdAt: new Date().toISOString(),
      likes: [],
      replies: []
    }

    post.comments.push(comment)
    user.comments++
    user.reputation += 2

    this.saveData(data)
    return comment
  }

  // Add reply to comment
  addReply(channelId, postId, commentId, replyData, userEmail) {
    const data = this.getData()
    const user = this.getCurrentUser(userEmail)
    const channel = data.channels.find(c => c.id === channelId)
    const post = channel?.posts.find(p => p.id === postId)
    const comment = post?.comments.find(c => c.id === commentId)

    if (!comment) return null

    const reply = {
      id: Date.now().toString(),
      author: user,
      content: replyData.content,
      createdAt: new Date().toISOString(),
      likes: []
    }

    comment.replies.push(reply)
    user.comments++
    user.reputation += 2

    this.saveData(data)
    return reply
  }

  // Toggle like on post
  toggleLike(channelId, postId, userEmail, type = 'post') {
    const data = this.getData()
    const channel = data.channels.find(c => c.id === channelId)
    const post = channel?.posts.find(p => p.id === postId)

    if (!post) return false

    const hasLiked = post.likes.includes(userEmail)

    if (hasLiked) {
      post.likes = post.likes.filter(email => email !== userEmail)
    } else {
      post.likes.push(userEmail)
      // Give reputation to post author
      if (data.users[post.author.email]) {
        data.users[post.author.email].reputation += 1
        data.users[post.author.email].likes++
      }
    }

    this.saveData(data)
    return !hasLiked
  }

  // Toggle like on comment
  toggleCommentLike(channelId, postId, commentId, userEmail) {
    const data = this.getData()
    const channel = data.channels.find(c => c.id === channelId)
    const post = channel?.posts.find(p => p.id === postId)
    const comment = post?.comments.find(c => c.id === commentId)

    if (!comment) return false

    const hasLiked = comment.likes.includes(userEmail)

    if (hasLiked) {
      comment.likes = comment.likes.filter(email => email !== userEmail)
    } else {
      comment.likes.push(userEmail)
      if (data.users[comment.author.email]) {
        data.users[comment.author.email].reputation += 1
      }
    }

    this.saveData(data)
    return !hasLiked
  }

  // Get top users (leaderboard)
  getLeaderboard(limit = 10) {
    const data = this.getData()
    const users = Object.values(data.users)
    return users
      .sort((a, b) => b.reputation - a.reputation)
      .slice(0, limit)
  }

  // Search posts
  searchPosts(query) {
    const data = this.getData()
    const allPosts = []

    data.channels?.forEach(channel => {
      channel.posts.forEach(post => {
        if (
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase())
        ) {
          allPosts.push({ ...post, channelName: channel.name, channelId: channel.id })
        }
      })
    })

    return allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // Get user stats
  getUserStats(email) {
    const user = this.getCurrentUser(email)
    const data = this.getData()

    let totalLikesReceived = 0
    let totalViews = 0

    data.channels?.forEach(channel => {
      channel.posts.forEach(post => {
        if (post.author.email === email) {
          totalLikesReceived += post.likes.length
          totalViews += post.views
        }
      })
    })

    return {
      ...user,
      totalLikesReceived,
      totalViews
    }
  }
}

export const communityService = new CommunityService()
