import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name ?? '').trim().slice(0, 120)
    const email = String(body.email ?? '').trim().toLowerCase().slice(0, 180)
    const message = String(body.message ?? '').trim().slice(0, 4000)

    if (!name || !emailPattern.test(email) || message.length < 10) {
      return NextResponse.json({ error: 'Please provide a name, valid email, and message of at least 10 characters.' }, { status: 400 })
    }

    const database = await getDatabase()
    await database.collection('contact_messages').insertOne({ name, email, message, createdAt: new Date(), status: 'new' })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unable to send your message right now.' }, { status: 500 })
  }
}
