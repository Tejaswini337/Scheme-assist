from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")

# Database
db = client["scheme_assist"]

@app.route("/")
def home():
    return "Scheme Assist Backend is Running!"

@app.route("/test-db")
def test_db():
    try:
        # MongoDB connection test
        client.admin.command("ping")

        return jsonify({
            "success": True,
            "message": "MongoDB connected successfully!",
            "database": "scheme_assist"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        # Basic validation
        if not name or not email or not password:
            return jsonify({
                "success": False,
                "message": "Name, email and password are required."
            }), 400

        # Check whether user already exists
        existing_user = db.users.find_one({
            "email": email
        })

        if existing_user:
            return jsonify({
                "success": False,
                "message": "User already registered."
            }), 409

        # Store user
        user = {
            "name": name,
            "email": email,
            "password": password
        }

        db.users.insert_one(user)

        return jsonify({
            "success": True,
            "message": "Registration successful!"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        # Basic validation
        if not name or not email or not password:
            return jsonify({
                "success": False,
                "message": "Name, email and password are required."
            }), 400

        # Check whether user already exists
        existing_user = db.users.find_one({
            "email": email
        })

        if existing_user:
            return jsonify({
                "success": False,
                "message": "User already registered."
            }), 409

        # Store user
        user = {
            "name": name,
            "email": email,
            "password": password
        }

        db.users.insert_one(user)

        return jsonify({
            "success": True,
            "message": "Registration successful!"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)