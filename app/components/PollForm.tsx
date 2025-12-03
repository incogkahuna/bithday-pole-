'use client'

import { useState } from 'react'

interface PollFormProps {
  onSubmit: () => void
  submitted: boolean
}

interface FormData {
  name: string
  selectedWeekends: string[]
  canDrive: boolean | null
  hasIkonPass: boolean | null
  willingToPitchJet: boolean | null
}

export default function PollForm({ onSubmit, submitted }: PollFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    selectedWeekends: [],
    canDrive: null,
    hasIkonPass: null,
    willingToPitchJet: null
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // The two weekend options
  const weekends = [
    'Jan 18 - Jan 21',
    'Jan 25 - Jan 28'
  ]

  const handleWeekendToggle = (weekend: string) => {
    setFormData(prev => ({
      ...prev,
      selectedWeekends: prev.selectedWeekends.includes(weekend)
        ? prev.selectedWeekends.filter(w => w !== weekend)
        : [...prev.selectedWeekends, weekend]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }

    if (formData.selectedWeekends.length === 0) {
      setError('Please select at least one weekend')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        onSubmit()
      } else {
        setError(data.error || 'Failed to submit vote. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
      setError('Failed to submit vote. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={{
        background: 'rgba(0, 255, 136, 0.1)',
        border: '1px solid #00ff88',
        borderRadius: '12px',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>✓</div>
        <h2 style={{
          color: '#00ff88',
          marginBottom: '0.5rem',
          fontFamily: 'monospace'
        }}>VOTE SUBMITTED</h2>
        <p style={{ color: '#a0a0b0' }}>
          Your response has been recorded. Check the RESULTS tab to see the current standings.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'rgba(21, 21, 32, 0.6)',
      border: '1px solid #2a2a3a',
      borderRadius: '16px',
      padding: '2.5rem',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.75rem',
          color: '#00d4ff',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          YOUR NAME
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          style={{
            width: '100%',
            padding: '0.875rem',
            background: 'rgba(10, 10, 15, 0.8)',
            border: '1px solid #2a2a3a',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '1rem',
            fontFamily: 'inherit',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#00d4ff'
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#2a2a3a'
            e.currentTarget.style.background = 'rgba(10, 10, 15, 0.8)'
          }}
          placeholder="Enter your name"
          required
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '1rem',
          color: '#00d4ff',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          SELECT WEEKENDS YOU CAN ATTEND
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.75rem'
        }}>
          {weekends.map((weekend) => (
            <button
              key={weekend}
              type="button"
              onClick={() => handleWeekendToggle(weekend)}
              style={{
                padding: '1rem',
                background: formData.selectedWeekends.includes(weekend)
                  ? 'rgba(0, 212, 255, 0.2)'
                  : 'rgba(10, 10, 15, 0.8)',
                border: '1px solid',
                borderColor: formData.selectedWeekends.includes(weekend)
                  ? '#00d4ff'
                  : '#2a2a3a',
                borderRadius: '8px',
                color: formData.selectedWeekends.includes(weekend)
                  ? '#00d4ff'
                  : '#a0a0b0',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                if (!formData.selectedWeekends.includes(weekend)) {
                  e.currentTarget.style.borderColor = '#00d4ff'
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (!formData.selectedWeekends.includes(weekend)) {
                  e.currentTarget.style.borderColor = '#2a2a3a'
                  e.currentTarget.style.background = 'rgba(10, 10, 15, 0.8)'
                }
              }}
            >
              {weekend}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.75rem',
          color: '#00d4ff',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          CAN YOU DRIVE UP?
        </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[true, false].map((value) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, canDrive: value }))}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: formData.canDrive === value
                  ? 'rgba(0, 212, 255, 0.2)'
                  : 'rgba(10, 10, 15, 0.8)',
                border: '1px solid',
                borderColor: formData.canDrive === value
                  ? '#00d4ff'
                  : '#2a2a3a',
                borderRadius: '8px',
                color: formData.canDrive === value
                  ? '#00d4ff'
                  : '#a0a0b0',
                cursor: 'pointer',
                fontFamily: 'monospace',
                transition: 'all 0.3s ease'
              }}
            >
              {value ? 'YES' : 'NO'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.75rem',
          color: '#00d4ff',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          DO YOU HAVE AN IKON PASS?
        </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[true, false].map((value) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, hasIkonPass: value }))}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: formData.hasIkonPass === value
                  ? 'rgba(0, 212, 255, 0.2)'
                  : 'rgba(10, 10, 15, 0.8)',
                border: '1px solid',
                borderColor: formData.hasIkonPass === value
                  ? '#00d4ff'
                  : '#2a2a3a',
                borderRadius: '8px',
                color: formData.hasIkonPass === value
                  ? '#00d4ff'
                  : '#a0a0b0',
                cursor: 'pointer',
                fontFamily: 'monospace',
                transition: 'all 0.3s ease'
              }}
            >
              {value ? 'YES' : 'NO'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.75rem',
          color: '#00d4ff',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          WOULD YOU BE WILLING TO PITCH IN ON A PRIVATE JET FLIGHT?
        </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[true, false].map((value) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, willingToPitchJet: value }))}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: formData.willingToPitchJet === value
                  ? 'rgba(0, 255, 136, 0.2)'
                  : 'rgba(10, 10, 15, 0.8)',
                border: '1px solid',
                borderColor: formData.willingToPitchJet === value
                  ? '#00ff88'
                  : '#2a2a3a',
                borderRadius: '8px',
                color: formData.willingToPitchJet === value
                  ? '#00ff88'
                  : '#a0a0b0',
                cursor: 'pointer',
                fontFamily: 'monospace',
                transition: 'all 0.3s ease'
              }}
            >
              {value ? 'YES' : 'NO'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid #ff4444',
          borderRadius: '8px',
          color: '#ff6666',
          fontFamily: 'monospace',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '1rem',
          background: isSubmitting 
            ? 'rgba(0, 212, 255, 0.5)' 
            : 'linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)',
          border: 'none',
          borderRadius: '8px',
          color: '#0a0a0f',
          fontSize: '1rem',
          fontWeight: 700,
          fontFamily: 'monospace',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: isSubmitting ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 212, 255, 0.4)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT VOTE'}
      </button>
    </form>
  )
}

