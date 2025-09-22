import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '../services/api.js'

function parseVideoId(input) {
  try {
    const url = new URL(input)
    if (url.hostname.includes('youtu.be')) return url.pathname.replace(/^\//, '')
    if (url.hostname.includes('youtube.com')) return new URLSearchParams(url.search).get('v')
  } catch {
    // not a URL, maybe raw id
  }
  return input
}

export default function HomePage() {
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  const videoId = useMemo(() => parseVideoId(input || ''), [input])

  const collectMutation = useMutation({
    mutationFn: async ({ urlOrId }) => {
      const id = parseVideoId(urlOrId)
      return api.post('/collect/youtube', { url: urlOrId, videoId: id, max_results: 100 })
    },
  })

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    await collectMutation.mutateAsync({ urlOrId: input.trim() })
    navigate(`/analysis/${videoId}`)
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ marginTop: 0 }}>Analyze YouTube Course Reviews</h2>
      <p style={{ color: '#555' }}>Paste a YouTube video link to collect comments and run ABSA.</p>

      <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: 12 }}>
        <input
          type="text"
          placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: 12, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <button
          type="submit"
          disabled={collectMutation.isPending || !input.trim()}
          style={{ padding: '12px 16px', background: '#1e88e5', color: 'white', border: 'none', borderRadius: 6 }}
        >
          {collectMutation.isPending ? 'Collecting…' : 'Analyze'}
        </button>
      </form>

      {collectMutation.isError && (
        <div style={{ marginTop: 12, color: '#c62828' }}>
          {(collectMutation.error?.response?.data?.error) || 'Failed to collect comments.'}
        </div>
      )}

      {collectMutation.isSuccess && (
        <div style={{ marginTop: 12, color: '#2e7d32' }}>
          Comments collected. Redirecting to analysis…
        </div>
      )}
    </div>
  )
}


