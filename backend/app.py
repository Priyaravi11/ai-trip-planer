from flask import Flask
from flask_cors import CORS
from routes import routes_bp
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("SECRET_KEY")

app.register_blueprint(routes_bp)

if __name__ == '__main__':
    app.run(debug=True)
