# youtube_collector.py
from googleapiclient.discovery import build
from db_client import insert_review
from config import YOUTUBE_API_KEY
from datetime import datetime

def fetch_comments_for_video(video_id, max_results=50):
    youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
    request = youtube.commentThreads().list(part="snippet", videoId=video_id, maxResults=max_results)
    response = request.execute()
    for item in response.get("items", []):
        comment = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
        doc = {"source": "youtube", "course_id": video_id, "text": comment, "created_at": datetime.utcnow()}
        insert_review("reviews", doc)

if __name__ == "__main__":
    # Example: fetch_comments_for_video("VIDEO_ID")
    pass
