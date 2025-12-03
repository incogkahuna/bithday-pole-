import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'votes.json')

// Try to use Vercel KV if available, otherwise use file storage
async function getKV() {
  // Only use KV if we have the required environment variables
  // This prevents the import from trying to initialize without proper config
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null
  }
  
  try {
    const { kv } = await import('@vercel/kv')
    return kv
  } catch (error: any) {
    // If KV import fails, fall back to file storage
    console.log('KV not available, using file storage:', error?.message || 'Unknown error')
    return null
  }
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read votes from storage (KV or file)
async function readVotes() {
  const kv = await getKV()
  
  if (kv) {
    // Use Vercel KV
    try {
      const data = await kv.get('mammoth-votes')
      return data || []
    } catch (error) {
      console.error('Error reading from KV:', error)
      return []
    }
  } else {
    // Use file storage (local development)
    ensureDataDir()
    if (!fs.existsSync(DATA_FILE)) {
      return []
    }
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading votes:', error)
      return []
    }
  }
}

// Write votes to storage (KV or file)
async function writeVotes(votes: any[]) {
  const kv = await getKV()
  
  if (kv) {
    // Use Vercel KV
    try {
      await kv.set('mammoth-votes', votes)
    } catch (error) {
      console.error('Error writing to KV:', error)
      throw error
    }
  } else {
    // Use file storage (local development)
    ensureDataDir()
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(votes, null, 2))
    } catch (error) {
      console.error('Error writing votes:', error)
      throw error
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const voteData = await request.json()
    
    // Validate vote data
    if (!voteData.name || !voteData.selectedWeekends || voteData.selectedWeekends.length === 0) {
      return NextResponse.json(
        { error: 'Invalid vote data: name and at least one weekend selection required' },
        { status: 400 }
      )
    }

    const votes = await readVotes()
    
    // Check if this name has already voted (optional - remove if you want to allow multiple votes)
    const existingIndex = votes.findIndex((v: any) => v.name.toLowerCase() === voteData.name.toLowerCase())
    
    if (existingIndex >= 0) {
      // Update existing vote
      votes[existingIndex] = voteData
    } else {
      // Add new vote
      votes.push(voteData)
    }

    await writeVotes(votes)

    return NextResponse.json({ 
      success: true,
      message: 'Vote recorded successfully',
      totalVotes: votes.length
    })
  } catch (error: any) {
    console.error('Error processing vote:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process vote',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

