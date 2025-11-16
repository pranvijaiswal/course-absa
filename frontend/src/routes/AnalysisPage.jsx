import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AnalysisPage() {
  const { courseId } = useParams(); // same as videoId earlier
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const API_KEY = "AIzaSyCEfwla2I6o0I2R3dpWymyClDW8UtyRepY";

  async function handleGetReview(courseId) {
    const res = await fetch(
      `http://127.0.0.1:5000/course/${courseId}/analysis`
    );
    const data = await res.json();
    console.log("Analysis result:", data);
  }

  useEffect(() => {
    if (!courseId || courseId === "nothing" || courseId.trim() === "") {
      setError(
        "No video to show. Please go back and enter a valid YouTube URL."
      );
      return;
    }

    async function fetchVideoInfo() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${courseId}&key=${API_KEY}`
        );
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
          setError("No video found for this ID.");
          return;
        }

        const vid = data.items[0];
        setVideoData({
          title: vid.snippet.title,
          channel: vid.snippet.channelTitle,
          thumbnail: vid.snippet.thumbnails.high.url,
          likes: vid.statistics.likeCount || "N/A",
          views: vid.statistics.viewCount || "N/A",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch video info.");
      } finally {
        setLoading(false);
      }
    }

    fetchVideoInfo();
  }, [courseId]);

  if (!courseId || courseId === "nothing" || error) {
    return (
      <div className="card">
        <h2>No video to show</h2>
        <p>{error || "Please go back and enter a valid YouTube link."}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <p>Loading video details...</p>
      </div>
    );
  }

  return (
    <div className="card">
      {videoData && (
        <>
          <h2>{videoData.title}</h2>
          <img
            src={videoData.thumbnail}
            alt="thumbnail"
            style={{ width: "400px", borderRadius: "8px" }}
          />
          <p>
            <strong>Channel:</strong> {videoData.channel}
          </p>
          <p>
            <strong>Views:</strong> {videoData.views} | <strong>Likes:</strong>{" "}
            {videoData.likes}
          </p>

          <button onClick={() => handleGetReview(courseId)}>Get Review</button>
        </>
      )}
    </div>
  );
}
