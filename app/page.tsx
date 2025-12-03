'use client'

import { useState, useEffect } from 'react'
import PollForm from './components/PollForm'
import ResultsView from './components/ResultsView'

export default function Home() {
  const [showResults, setShowResults] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Check if user has already voted
    const hasVoted = localStorage.getItem('mammothPollVoted')
    if (hasVoted) {
      setSubmitted(true)
    }
  }, [])

  const handleSubmit = () => {
    setSubmitted(true)
    localStorage.setItem('mammothPollVoted', 'true')
    // Automatically switch to results view after voting
    setTimeout(() => {
      setShowResults(true)
    }, 1000)
  }

  return (
    <main style={{
      minHeight: '100vh',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 255, 136, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px' }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '2rem 0',
          borderBottom: '1px solid rgba(0, 212, 255, 0.2)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            MAMMOTH POLL
          </h1>
          <p style={{
            color: '#a0a0b0',
            fontSize: '1.1rem',
            fontFamily: 'monospace'
          }}>
            &gt; Select your preferred weekend &lt;
          </p>
        </header>

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setShowResults(false)}
            style={{
              padding: '0.75rem 1.5rem',
              background: !showResults ? 'rgba(0, 212, 255, 0.2)' : 'transparent',
              border: '1px solid',
              borderColor: !showResults ? '#00d4ff' : '#2a2a3a',
              color: '#00d4ff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!showResults) return
              e.currentTarget.style.borderColor = '#00d4ff'
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)'
            }}
            onMouseLeave={(e) => {
              if (!showResults) return
              e.currentTarget.style.borderColor = '#2a2a3a'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            VOTE
          </button>
          <button
            onClick={() => setShowResults(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: showResults ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
              border: '1px solid',
              borderColor: showResults ? '#00ff88' : '#2a2a3a',
              color: '#00ff88',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!showResults) return
              e.currentTarget.style.borderColor = '#00ff88'
              e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)'
            }}
            onMouseLeave={(e) => {
              if (!showResults) return
              e.currentTarget.style.borderColor = '#2a2a3a'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            RESULTS
          </button>
        </div>

        {showResults ? (
          <ResultsView />
        ) : (
          <PollForm onSubmit={handleSubmit} submitted={submitted} />
        )}
      </div>
    </main>
  )
}

