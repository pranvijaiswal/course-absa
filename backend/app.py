# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from db_client import insert_review, get_reviews
from analyzer import ABSAService
from recommender import aggregate_aspect_scores, recommend_by_preference
from datetime import datetime
from youtube_collector import fetch_comments_for_video

app = Flask(__name__)
CORS(app)

absa = ABSAService()

@app.route("/ingest", methods=["POST"])
def ingest():
    data = request.json
    req = {
        "source": data.get("source", "manual"),
        "course_id": data.get("course_id", "unknown"),
        "text": data.get("text"),
        "created_at": datetime.utcnow()
    }
    inserted_id = insert_review("reviews", req)
    return jsonify({"status": "ok", "id": str(inserted_id)}), 201

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text")
    if not text:
        return jsonify({"error": "no text provided"}), 400
    res = absa.analyze_text(text)
    return jsonify({"analysis": res})

@app.route("/collect/youtube", methods=["POST"])
def collect_youtube_comments():
    data = request.json or {}
    url = data.get("url")
    video_id = data.get("videoId")
    max_results = int(data.get("max_results", 50))

    def _parse_video_id_from_url(candidate_url: str):
        if not candidate_url:
            return None
        # Support formats: https://www.youtube.com/watch?v=VIDEOID, https://youtu.be/VIDEOID
        try:
            from urllib.parse import urlparse, parse_qs
            parsed = urlparse(candidate_url)
            if parsed.netloc.endswith("youtu.be"):
                vid = parsed.path.lstrip("/")
                return vid or None
            if parsed.netloc.endswith("youtube.com"):
                qs = parse_qs(parsed.query)
                return (qs.get("v", [None])[0])
        except Exception:
            return None
        return None

    if not video_id and url:
        video_id = _parse_video_id_from_url(url)

    if not video_id:
        return jsonify({"error": "videoId or url is required"}), 400

    fetch_comments_for_video(video_id, max_results=max_results)
    return jsonify({"status": "ok", "video_id": video_id, "max_results": max_results}), 200

@app.route("/course/<course_id>/analysis", methods=["GET"])
def course_analysis(course_id):
    reviews = get_reviews("reviews", {"course_id": course_id}, limit=500)
    raw_texts = [r["text"] for r in reviews]
    all_analysis = []
    for t in raw_texts:
        out = absa.analyze_text(t)
        for o in out:
            o["_source_text"] = t
            all_analysis.append(o)
    agg = aggregate_aspect_scores(all_analysis)
    return jsonify({"course_id": course_id, "aggregated": agg, "raw_count": len(raw_texts), "detailed": all_analysis})

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    user_pref = data.get("preference_aspect", "content")
    reviews = get_reviews("reviews", {}, limit=1000)
    course_map = {}
    for r in reviews:
        cid = r.get("course_id", "unknown")
        course_map.setdefault(cid, []).append(r["text"])
    course_analyzed = {}
    for cid, texts in course_map.items():
        analyses = []
        for t in texts:
            analyses.extend(absa.analyze_text(t))
        course_analyzed[cid] = analyses
    recommendations = recommend_by_preference(course_analyzed, user_pref)
    return jsonify({"preference": user_pref, "recommendations": recommendations[:5]})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
