// server/config/database.js
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('📡 MongoDB disconnected')
})

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error)
})