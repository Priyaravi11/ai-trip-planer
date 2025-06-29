from flask import Blueprint, request, jsonify
from gemini import generate_itinerary
from mongodb import connect_db, get_user_by_email, save_user, save_plan, get_plans_by_user, save_history, get_history_by_user
from utils.helpers import validate_login

routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    name = data.get('name')

    user = get_user_by_email(email)
    if not user:
        save_user(name, email)

    return jsonify({"message": "Login successful", "email": email})


@routes_bp.route('/api/generate-plan', methods=['POST'])
def generate_plan():
    data = request.json
    itinerary = generate_itinerary(data)

    # Save history of generated request
    email = data.get('email')
    save_history(email, data)

    return jsonify({"itinerary": itinerary})


@routes_bp.route('/api/save-plan', methods=['POST'])
def save_itinerary():
    data = request.json
    email = data.get("email")
    plan = data.get("plan")

    save_plan(email, plan)
    return jsonify({"message": "Plan saved successfully."})


@routes_bp.route('/api/get-plans', methods=['GET'])
def get_user_plans():
    email = request.args.get('email')
    plans = get_plans_by_user(email)
    return jsonify({"plans": plans})


@routes_bp.route('/api/get-history', methods=['GET'])
def get_user_history():
    email = request.args.get('email')
    history = get_history_by_user(email)
    return jsonify({"history": history})
@routes_bp.route('/', methods=['GET'])
def index():
    return 'Welcome to the Travel Planner API!'
