# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from db_client import insert_review, get_reviews
from analyzer import ABSAService
from recommender import aggregate_aspect_scores, recommend_by_preference
from datetime import datetime

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
