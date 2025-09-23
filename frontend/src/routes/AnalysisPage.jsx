import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

function AnalysisPage() {
  const [course, setCourse] = useState("");
  const [results, setResults] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const mutation = useMutation({
    mutationFn: async (courseName) => {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course: courseName }),
      });
      if (!res.ok) throw new Error("Fetch failed");
      return res.json();
    },
    onSuccess: (data) => {
      setResults(data);
      setStatusMessage(null);
    },
    onError: () => {
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (course.trim()) {
      setResults(null);
      mutation.mutate(course);

      setStatusMessage("Fetching comments...");
      setTimeout(() => {
        setStatusMessage("Analyzing comments...");
      }, 5000);
      setTimeout(() => {
        setStatusMessage("Failed to generate a review.");
      }, 10000);
    }
  };

  return (
    <div className="page">
      <h1>Course Analysis</h1>
      <p className="text-muted">
        Enter a course name to analyze feedback and recommendations.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="e.g. Data Structures and Algorithms"
          />
          <button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? (
              <>
                <span className="spinner" /> Analyzing...
              </>
            ) : (
              "Analyze Course"
            )}
          </button>
        </form>
      </div>

      {statusMessage && (
        <div className="status-message">
          <p>{statusMessage}</p>
        </div>
      )}

      {results && (
        <div className="results">
          <div className="card">
            <h2>Aspect Sentiments</h2>
            {results.aspects?.map((aspect, idx) => (
              <div key={idx} className="aspect">
                <strong>{aspect.name}:</strong> {aspect.sentiment}
              </div>
            ))}
          </div>

          <div className="card">
            <h2>Recommendations</h2>
            <ul>
              {results.recommendations?.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #ccc;
          border-top: 2px solid #333;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .status-message {
          margin-top: 20px;
          font-style: italic;
          color: #555;
        }
      `}</style>
    </div>
  );
}

export default AnalysisPage;
