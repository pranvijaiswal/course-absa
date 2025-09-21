# recommender.py
from collections import defaultdict

def aggregate_aspect_scores(analyzed_items):
    score_map = defaultdict(int)
    for it in analyzed_items:
        aspect = it.get('aspect') or "general"
        sentiment = it.get('sentiment', '').lower()
        if 'pos' in sentiment or 'positive' in sentiment:
            score_map[aspect] += 1
        elif 'neg' in sentiment or 'negative' in sentiment:
            score_map[aspect] -= 1
    return dict(score_map)

def recommend_by_preference(course_id_to_analyses, user_pref_aspect):
    scores = []
    for course_id, analyses in course_id_to_analyses.items():
        agg = aggregate_aspect_scores(analyses)
        score = agg.get(user_pref_aspect, 0)
        scores.append((course_id, score, agg))
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores
