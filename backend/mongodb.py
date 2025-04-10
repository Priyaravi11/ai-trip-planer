from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://username:password@cluster.mongodb.net/ai_travel")
client = MongoClient(MONGO_URI)
db = client["ai_travel_planner"]
users_collection = db["users"]
plans_collection = db["plans"]
history_collection = db["history"]

def connect_db():
    return db

def get_user_by_email(email):
    return users_collection.find_one({"email": email})

def save_user(name, email):
    users_collection.insert_one({"name": name, "email": email})

def save_plan(email, plan):
    plans_collection.insert_one({"email": email, "plan": plan})

def get_plans_by_user(email):
    plans = plans_collection.find({"email": email})
    return [p["plan"] for p in plans]

def save_history(email, data):
    history_collection.insert_one({"email": email, "query": data})

def get_history_by_user(email):
    history = history_collection.find({"email": email})
    return [h["query"] for h in history]