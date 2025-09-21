# db_client.py
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def insert_review(collection_name, doc):
    return db[collection_name].insert_one(doc).inserted_id

def get_reviews(collection_name, filter_query={}, limit=100):
    return list(db[collection_name].find(filter_query).limit(limit))
