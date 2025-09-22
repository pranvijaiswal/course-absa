import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api.js'

export default function AnalysisPage() {
  const { courseId } = useParams()

  const query = useQuery({
    queryKey: ['course-analysis', courseId],
    queryFn: async () => {
      const res = await api.get(`/course/${courseId}/analysis`)
      return res
    },
    enabled: !!courseId,
    staleTime: 0,
  })

  const data = query.data
  const aggregated = data?.aggregated || {}
  const rawCount = data?.raw_count || 0

  return (
    <div style={{ maxWidth: 960 }}>
      <h2 style={{ marginTop: 0 }}>Analysis: {courseId}</h2>
      {query.isLoading && <p>Loading analysis…</p>}
      {query.isError && (
        <p style={{ color: '#c62828' }}>Failed to load analysis.</p>
      )}

      {query.isSuccess && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h3>Aggregated Aspect Scores</h3>
            <ul>
              {Object.entries(aggregated).map(([aspect, score]) => (
                <li key={aspect} style={{ marginBottom: 6 }}>
                  <strong>{aspect}:</strong> {score}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Metadata</h3>
            <p><strong>Raw comments analyzed:</strong> {rawCount}</p>
          </div>
        </div>
      )}
    </div>
  )
}


