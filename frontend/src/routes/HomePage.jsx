import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const [url, setUrl] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url) return

    // extract video ID from YouTube URL
    const match = url.match(/(?:v=|\.be\/)([^&\n?#]+)/)
    if (match) {
      const videoId = match[1]
      navigate(`/analysis/${videoId}`)
    } else {
      alert("Invalid YouTube link")
    }
  }

  return (
    <div className="card">
      <h2>Analyze YouTube Course Reviews</h2>
      <p>Paste a YouTube video link to collect comments and run ABSA.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Analyze</button>
      </form>
    </div>
  )
}
