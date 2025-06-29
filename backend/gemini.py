import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_itinerary(data):
    prompt = f"Generate a travel itinerary for a user visiting {data['destination']} for {data['days']} days with interests in {data['interests']}."

    try:
        model = genai.GenerativeModel("models/gemini-1.5-flash")  # or "models/gemini-1.5-pro"
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print("Error:", e)
        return "Failed to generate itinerary. Please try again."

if __name__ == "__main__":
    test_data = {
        "destination": "chennai",
        "days": 3,
        "interests": ",history,temples, cinema"
    }

    print("\nGenerated Itinerary:\n")
    print(generate_itinerary(test_data))
    
