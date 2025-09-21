# test_absa.py
from db_client import get_reviews
from analyzer import ABSAService

absa = ABSAService()

# Fetch mock reviews
reviews = get_reviews("reviews")
for r in reviews:
    print("Text:", r["text"])
    analysis = absa.analyze_text(r["text"])
    print("Analysis:", analysis)
    print("------")
