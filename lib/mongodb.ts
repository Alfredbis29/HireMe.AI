import { MongoClient, Db } from 'mongodb'

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hireme-ai'
  
  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db('hireme-ai')
    
    console.log('✅ Connected to MongoDB')
    return { client, db }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

export async function getDatabase() {
  if (!db) {
    await connectToDatabase()
  }
  return db
}
