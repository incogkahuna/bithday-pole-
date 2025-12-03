import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'votes.json')

interface Vote {
  name: string
  selectedWeekends: string[]
  canDrive: boolean | null
  hasIkonPass: boolean | null
  willingToPitchJet: boolean | null
}

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

async function readVotes(): Promise<Vote[]> {
  const kv = await getKV()
  
  if (kv) {
    // Use Vercel KV
    try {
      const data = await kv.get('mammoth-votes')
      return (data as Vote[]) || []
    } catch (error) {
      console.error('Error reading from KV:', error)
      return []
    }
  } else {
    // Use file storage (local development)
    const dataDir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
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

export async function GET() {
  try {
    const votes: Vote[] = await readVotes()

    // Calculate weekend statistics
    const weekendStats: Record<string, { count: number; voters: string[]; percentage: number }> = {}
    const totalVotes = votes.length

    votes.forEach((vote) => {
      vote.selectedWeekends.forEach((weekend) => {
        if (!weekendStats[weekend]) {
          weekendStats[weekend] = { count: 0, voters: [], percentage: 0 }
        }
        weekendStats[weekend].count++
        if (!weekendStats[weekend].voters.includes(vote.name)) {
          weekendStats[weekend].voters.push(vote.name)
        }
      })
    })

    // Calculate percentages
    Object.keys(weekendStats).forEach((weekend) => {
      weekendStats[weekend].percentage = totalVotes > 0
        ? Math.round((weekendStats[weekend].count / totalVotes) * 100)
        : 0
    })

    // Calculate supplemental stats
    const driveStats = {
      yes: votes.filter(v => v.canDrive === true).length,
      no: votes.filter(v => v.canDrive === false).length,
      total: votes.filter(v => v.canDrive !== null).length
    }

    const ikonStats = {
      yes: votes.filter(v => v.hasIkonPass === true).length,
      no: votes.filter(v => v.hasIkonPass === false).length,
      total: votes.filter(v => v.hasIkonPass !== null).length
    }

    const jetStats = {
      yes: votes.filter(v => v.willingToPitchJet === true).length,
      no: votes.filter(v => v.willingToPitchJet === false).length,
      total: votes.filter(v => v.willingToPitchJet !== null).length
    }

    return NextResponse.json({
      votes,
      weekendStats,
      driveStats,
      ikonStats,
      jetStats
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
}

