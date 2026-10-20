import { MongoClient } from 'mongodb'

const globalForMongo = globalThis as unknown as { mongo?: MongoClient }

export async function getDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not configured')
  const mongo = globalForMongo.mongo ?? new MongoClient(uri)
  if (process.env.NODE_ENV !== 'production') globalForMongo.mongo = mongo
  await mongo.connect()
  return mongo.db(process.env.MONGODB_DB ?? 'amey_portfolio')
}
