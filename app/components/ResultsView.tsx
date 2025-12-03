'use client'

import { useState, useEffect } from 'react'

interface Vote {
  name: string
  selectedWeekends: string[]
  canDrive: boolean | null
  hasIkonPass: boolean | null
  willingToPitchJet: boolean | null
}

interface Results {
  votes: Vote[]
  weekendStats: Record<string, { count: number; voters: string[]; percentage: number }>
  driveStats: { yes: number; no: number; total: number }
  ikonStats: { yes: number; no: number; total: number }
  jetStats: { yes: number; no: number; total: number }
}

export default function ResultsView() {
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
    const interval = setInterval(fetchResults, 3000) // Refresh every 3 seconds
    return () => clearInterval(interval)
  }, [])

  // Also refresh when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchResults()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results')
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        background: 'rgba(21, 21, 32, 0.6)',
        border: '1px solid #2a2a3a',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <div style={{ color: '#00d4ff', fontFamily: 'monospace' }}>LOADING RESULTS...</div>
      </div>
    )
  }

  if (!results || results.votes.length === 0) {
    return (
      <div style={{
        background: 'rgba(21, 21, 32, 0.6)',
        border: '1px solid #2a2a3a',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <div style={{ color: '#a0a0b0', fontFamily: 'monospace' }}>NO VOTES YET</div>
      </div>
    )
  }

  const sortedWeekends = Object.entries(results.weekendStats)
    .sort((a, b) => b[1].count - a[1].count)

  return (
    <div style={{
      background: 'rgba(21, 21, 32, 0.6)',
      border: '1px solid #2a2a3a',
      borderRadius: '16px',
      padding: '2.5rem',
      backdropFilter: 'blur(10px)'
    }}>
      <h2 style={{
        color: '#00ff88',
        marginBottom: '2rem',
        fontFamily: 'monospace',
        fontSize: '1.5rem',
        borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
        paddingBottom: '1rem'
      }}>
        WEEKEND RESULTS
      </h2>

      <div style={{ marginBottom: '3rem' }}>
        {sortedWeekends.map(([weekend, stats]) => (
          <div
            key={weekend}
            style={{
              marginBottom: '1.5rem',
              padding: '1.5rem',
              background: 'rgba(10, 10, 15, 0.6)',
              border: '1px solid #2a2a3a',
              borderRadius: '12px'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{
                color: '#00d4ff',
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                fontWeight: 600
              }}>
                {weekend}
              </div>
              <div style={{
                color: '#00ff88',
                fontFamily: 'monospace',
                fontSize: '1.5rem',
                fontWeight: 700
              }}>
                {stats.percentage}%
              </div>
            </div>
            
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(42, 42, 58, 0.8)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                width: `${stats.percentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #00d4ff 0%, #00ff88 100%)',
                transition: 'width 0.5s ease'
              }} />
            </div>

            <div style={{
              color: '#a0a0b0',
              fontSize: '0.9rem',
              fontFamily: 'monospace'
            }}>
              {stats.count} vote{stats.count !== 1 ? 's' : ''} • {stats.voters.join(', ')}
            </div>
          </div>
        ))}
      </div>

      <h2 style={{
        color: '#00ff88',
        marginBottom: '1.5rem',
        marginTop: '2rem',
        fontFamily: 'monospace',
        fontSize: '1.5rem',
        borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
        paddingBottom: '1rem'
      }}>
        SUPPLEMENTAL STATS
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1.5rem',
          background: 'rgba(10, 10, 15, 0.6)',
          border: '1px solid #2a2a3a',
          borderRadius: '12px'
        }}>
          <div style={{
            color: '#00d4ff',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            marginBottom: '0.75rem'
          }}>
            CAN DRIVE UP
          </div>
          <div style={{
            color: '#00ff88',
            fontFamily: 'monospace',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            {results.driveStats.yes} / {results.driveStats.total}
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(42, 42, 58, 0.8)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(results.driveStats.yes / results.driveStats.total) * 100}%`,
              height: '100%',
              background: '#00d4ff'
            }} />
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'rgba(10, 10, 15, 0.6)',
          border: '1px solid #2a2a3a',
          borderRadius: '12px'
        }}>
          <div style={{
            color: '#00d4ff',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            marginBottom: '0.75rem'
          }}>
            HAS IKON PASS
          </div>
          <div style={{
            color: '#00ff88',
            fontFamily: 'monospace',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            {results.ikonStats.yes} / {results.ikonStats.total}
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(42, 42, 58, 0.8)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(results.ikonStats.yes / results.ikonStats.total) * 100}%`,
              height: '100%',
              background: '#00d4ff'
            }} />
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'rgba(10, 10, 15, 0.6)',
          border: '1px solid #2a2a3a',
          borderRadius: '12px'
        }}>
          <div style={{
            color: '#00d4ff',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            marginBottom: '0.75rem'
          }}>
            WILLING TO PITCH IN ON JET
          </div>
          <div style={{
            color: '#00ff88',
            fontFamily: 'monospace',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            {results.jetStats.yes} / {results.jetStats.total}
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(42, 42, 58, 0.8)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(results.jetStats.yes / results.jetStats.total) * 100}%`,
              height: '100%',
              background: '#00ff88'
            }} />
          </div>
        </div>
      </div>

      <h2 style={{
        color: '#00ff88',
        marginBottom: '1.5rem',
        marginTop: '2rem',
        fontFamily: 'monospace',
        fontSize: '1.5rem',
        borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
        paddingBottom: '1rem'
      }}>
        ALL VOTERS
      </h2>

      <div style={{
        display: 'grid',
        gap: '1rem'
      }}>
        {results.votes.map((vote, index) => (
          <div
            key={index}
            style={{
              padding: '1.25rem',
              background: 'rgba(10, 10, 15, 0.6)',
              border: '1px solid #2a2a3a',
              borderRadius: '12px'
            }}
          >
            <div style={{
              color: '#00d4ff',
              fontFamily: 'monospace',
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.75rem'
            }}>
              {vote.name}
            </div>
            <div style={{
              color: '#a0a0b0',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
              fontFamily: 'monospace'
            }}>
              Weekends: {vote.selectedWeekends.join(', ') || 'None'}
            </div>
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              fontSize: '0.85rem',
              color: '#a0a0b0',
              fontFamily: 'monospace'
            }}>
              <span>Drive: {vote.canDrive === true ? '✓' : vote.canDrive === false ? '✗' : '—'}</span>
              <span>Ikon: {vote.hasIkonPass === true ? '✓' : vote.hasIkonPass === false ? '✗' : '—'}</span>
              <span>Jet: {vote.willingToPitchJet === true ? '✓' : vote.willingToPitchJet === false ? '✗' : '—'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

