# collector.py
from db_client import insert_review
from datetime import datetime

def insert_mock_reviews():
    samples = [
        {"source": "mock", "course_id": "course_1", "text": "Instructor explains clearly, content is great.", "created_at": datetime.utcnow()},
        {"source": "mock", "course_id": "course_1", "text": "Too fast, slides were not detailed.", "created_at": datetime.utcnow()},
        {"source": "mock", "course_id": "course_2", "text": "The projects were useful but videos are poor quality.", "created_at": datetime.utcnow()},
    ]
    for s in samples:
        print("Inserted:", insert_review("reviews", s))

if __name__ == "__main__":
    insert_mock_reviews()
