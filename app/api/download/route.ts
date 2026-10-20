import { NextResponse } from 'next/server'
import { ZipArchive } from 'archiver'
import { Readable } from 'node:stream'

export async function GET() {
  const archive = new ZipArchive({ zlib: { level: 9 } })
  const chunks: Buffer[] = []
  archive.on('data', (chunk) => chunks.push(Buffer.from(chunk)))

  // Keep the ZIP intentionally split at its root so it can be opened as two independent apps.
  archive.append(`import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport './styles.css'\n\nfunction App() {\n  return (\n    <main className=\"portfolio\">\n      <p className=\"eyebrow\">SOFTWARE DEVELOPER · MUMBAI, MAHARASHTRA, INDIA</p>\n      <h1>AMEY<br />MALI</h1>\n      <p className=\"intro\">Personable and technically fluent professional with hands-on experience building and explaining software products to diverse users.</p>\n      <a href=\"mailto:ameymali2@gmail.com\">Get in touch ↗</a>\n    </main>\n  )\n}\n\ncreateRoot(document.getElementById('root')).render(<App />)\n`, { name: 'frontend/src/App.jsx' })
  archive.append(`<div id=\"root\"></div><script type=\"module\" src=\"/src/App.jsx\"></script>\n`, { name: 'frontend/index.html' })
  archive.append(`{\n  \"name\": \"amey-mali-frontend\",\n  \"private\": true,\n  \"scripts\": { \"dev\": \"vite\", \"build\": \"vite build\", \"preview\": \"vite preview\" },\n  \"dependencies\": { \"@vitejs/plugin-react\": \"latest\", \"vite\": \"latest\", \"react\": \"latest\", \"react-dom\": \"latest\" },\n  \"devDependencies\": {}\n}\n`, { name: 'frontend/package.json' })
  archive.append(`:root { font-family: Arial, sans-serif; color: #171717; background: #f8f7f2; } body { margin: 0; } .portfolio { min-height: 100vh; padding: 7vw; background-image: linear-gradient(#deddd7 1px, transparent 1px), linear-gradient(90deg, #deddd7 1px, transparent 1px); background-size: 80px 80px; } h1 { font-size: clamp(5rem, 15vw, 12rem); line-height: .8; margin: 8vh 0 5vh; letter-spacing: -.08em; } .eyebrow { letter-spacing: .16em; color: #777; } .intro { max-width: 520px; font-size: 1.35rem; font-weight: 700; } a { color: inherit; }\n`, { name: 'frontend/src/styles.css' })
  archive.append(`{\n  \"name\": \"amey-mali-backend\",\n  \"private\": true,\n  \"scripts\": { \"start\": \"node server.js\", \"dev\": \"node --watch server.js\" },\n  \"dependencies\": { \"express\": \"latest\", \"mongodb\": \"latest\", \"cors\": \"latest\", \"dotenv\": \"latest\" }\n}\n`, { name: 'backend/package.json' })
  archive.append(`const express = require('express')\nconst cors = require('cors')\nconst { MongoClient } = require('mongodb')\nrequire('dotenv').config()\n\nconst app = express()\napp.use(cors())\napp.use(express.json({ limit: '20kb' }))\nconst client = new MongoClient(process.env.MONGODB_URI)\n\napp.post('/api/contact', async (req, res) => {\n  const { name, email, message } = req.body\n  if (!name || !email || !message || message.length < 10) return res.status(400).json({ error: 'Invalid contact details' })\n  await client.db(process.env.MONGODB_DB || 'amey_portfolio').collection('contact_messages').insertOne({ name, email, message, createdAt: new Date(), status: 'new' })\n  res.json({ ok: true })\n})\n\napp.get('/api/health', (_, res) => res.json({ ok: true }))\nclient.connect().then(() => app.listen(process.env.PORT || 4000, () => console.log('Backend running on port 4000')))\n`, { name: 'backend/server.js' })
  archive.append(`MONGODB_URI=your-mongodb-atlas-connection-string\nMONGODB_DB=amey_portfolio\nPORT=4000\n`, { name: 'backend/.env.example' })
  archive.append(`# Amey Mali Portfolio\n\nThis download contains two separate top-level applications:\n\n- frontend/ — Vite + React portfolio UI\n- backend/ — Express API with MongoDB Atlas contact message storage\n\nKeep MongoDB credentials in backend/.env only. Start the backend before submitting the contact form.\n`, { name: 'frontend/README.md' })
  archive.append(`# Backend API\n\nCopy .env.example to .env, add your MongoDB Atlas URI, then run npm install and npm start.\n`, { name: 'backend/README.md' })
  await archive.finalize()
  const body = Buffer.concat(chunks)
  return new NextResponse(Readable.toWeb(Readable.from(body)) as ReadableStream, { headers: { 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename="amey-mali-portfolio.zip"' } })
}
