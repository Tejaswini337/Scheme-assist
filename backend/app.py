from flask import Flask, jsonify, request, redirect
from pymongo import MongoClient
from flask_cors import CORS
from services.eligibility_engine import check_scheme_eligibility
from google import genai
import os
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
load_dotenv()
mongo_uri = os.environ.get("MONGO_ATLAS_URI")
app = Flask(__name__)
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.environ.get("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD")

mail = Mail(app)

serializer = URLSafeTimedSerializer(
    os.environ.get("SECRET_KEY")
)

gemini_client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY")
)
CORS(app)
# MongoDB connection
mongo_uri = os.environ.get("MONGO_ATLAS_URI")
client = MongoClient(mongo_uri)
# Database
db = client["scheme_assist"]
try:
    client.admin.command("ping")
    print("✅ MongoDB Atlas connected successfully!")
except Exception as e:
    print("❌ MongoDB Atlas connection failed:", e)

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
# 
from werkzeug.security import generate_password_hash, check_password_hash


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

        # Check existing user
        existing_user = db.users.find_one({
            "email": email
        })

        if existing_user:
            return jsonify({
                "success": False,
                "message": "User already registered."
            }), 409

        # Hash password
        password_hash = generate_password_hash(password)

        # Generate 6-digit OTP
        import random
        otp = str(random.randint(100000, 999999))

        # Create user
        user = {
            "name": name,
            "email": email,
            "password": password_hash,
            "email_verified": False,
            "email_otp": otp,
            "otp_expiry": __import__("datetime").datetime.utcnow()
            + __import__("datetime").timedelta(minutes=10)
        }

        # Save user
        db.users.insert_one(user)

        # Send OTP email
        msg = Message(
            subject="Scheme Assist - Email Verification OTP",
            sender=os.environ.get("MAIL_USERNAME"),
            recipients=[email]
        )

        msg.body = f"""
Hello {name},

Your Scheme Assist email verification OTP is:

{otp}

This OTP is valid for 10 minutes.

Please do not share this OTP with anyone.

Regards,
Scheme Assist Team
"""

        mail.send(msg)

        return jsonify({
            "success": True,
            "message": "OTP sent successfully to your email."
        }), 201

    except Exception as e:
        print("Registration error:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
@app.route("/api/verify-email-otp", methods=["POST"])
def verify_email_otp():
    try:
        data = request.get_json()

        email = data.get("email")
        otp = data.get("otp")

        if not email or not otp:
            return jsonify({
                "success": False,
                "message": "Email and OTP are required."
            }), 400

        user = db.users.find_one({
            "email": email
        })

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404

        if user.get("email_verified", False):
            return jsonify({
                "success": True,
                "message": "Email is already verified."
            }), 200

        # Check OTP expiry
        from datetime import datetime

        if datetime.utcnow() > user.get("otp_expiry"):
            return jsonify({
                "success": False,
                "message": "OTP has expired. Please register again."
            }), 400

        # Check OTP
        if otp != user.get("email_otp"):
            return jsonify({
                "success": False,
                "message": "Invalid OTP."
            }), 400

        # Mark email verified
        db.users.update_one(
            {"email": email},
            {
                "$set": {
                    "email_verified": True
                },
                "$unset": {
                    "email_otp": "",
                    "otp_expiry": ""
                }
            }
        )

        return jsonify({
            "success": True,
            "message": "Email verified successfully!"
        }), 200

    except Exception as e:
        print("OTP verification error:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route("/api/verify-email", methods=["GET"])
def verify_email():
    try:
        token = request.args.get("token")

        if not token:
            return jsonify({
                "success": False,
                "message": "Verification token is missing."
            }), 400

        # Decode token
        email = serializer.loads(
            token,
            salt="email-verification",
            max_age=3600
        )

        # Find user
        user = db.users.find_one({
            "email": email
        })

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404

        # Already verified
        if user.get("email_verified", False):
            return redirect(
                "https://scheme-assist-frontend.onrender.com/?verified=already"
            )

        # Mark email as verified
        db.users.update_one(
            {"email": email},
            {
                "$set": {
                    "email_verified": True
                }
            }
        )

        return redirect(
            "https://scheme-assist-frontend.onrender.com/?verified=true"
        )

    except Exception as e:
        print("Email verification error:", e)

        return redirect(
            "https://scheme-assist-frontend.onrender.com/?verified=false"
        )

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")
        password_hash = generate_password_hash(password)

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required."
            }), 400

        user = db.users.find_one({
            "email": email
        })

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 401

        # Verify hashed password
        if not check_password_hash(user["password"], password):
            return jsonify({
                "success": False,
                "message": "Incorrect password."
            }), 401
        if not user.get("email_verified", False):
            return jsonify({
        "success": False,
        "message": "Please verify your email before logging in."
    }), 403

        return jsonify({
            "success": True,
            "message": "Login successful!",
            "user": {
                "name": user["name"],
                "email": user["email"],
                "profile": user.get("profile")
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
@app.route("/api/profile", methods=["POST"])
def save_profile():
    try:
        data = request.get_json()

        email = data.get("email")
        profile = data.get("profile")

        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required."
            }), 400

        if not profile:
            return jsonify({
                "success": False,
                "message": "Profile data is required."
            }), 400

        result = db.users.update_one(
            {"email": email},
            {
                "$set": {
                    "profile": profile
                }
            }
        )

        if result.matched_count == 0:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404

        return jsonify({
            "success": True,
            "message": "Profile saved successfully.",
            "profile": profile
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
@app.route("/api/schemes", methods=["GET"])
def get_schemes():
    try:
        schemes = list(db.schemes.find({}, {"_id": 0}))

        return jsonify({
            "success": True,
            "count": len(schemes),
            "schemes": schemes
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
def check_scheme_eligibility(profile, scheme):
    rules = scheme.get("eligibility", {})
    reasons = []

    # Age
    try:
        user_age = int(profile.get("age", 0))

        if "minAge" in rules and user_age < rules["minAge"]:
            reasons.append(
                f"Age should be {rules['minAge']} or above."
            )

        if "maxAge" in rules and user_age > rules["maxAge"]:
            reasons.append(
                f"Age should be {rules['maxAge']} or below."
            )

    except (ValueError, TypeError):
        pass

    # Income
    if "maxIncome" in rules:
        try:
            user_income = float(profile.get("income", 0))

            if user_income > rules["maxIncome"]:
                reasons.append(
                    f"Annual income should not exceed ₹{rules['maxIncome']}."
                )

        except (ValueError, TypeError):
            pass

    # Occupation
    if rules.get("occupation"):
        user_occupation = profile.get("occupation", "")

        if user_occupation not in rules["occupation"]:
            reasons.append(
                "Occupation does not match the scheme requirements."
            )

    # Category
    if rules.get("categories"):
        user_category = profile.get("category", "")

        if user_category not in rules["categories"]:
            reasons.append(
                "Category does not match the scheme requirements."
            )

    # Gender
    if rules.get("gender"):
        user_gender = profile.get("gender", "")

        if user_gender not in rules["gender"]:
            reasons.append(
                "Gender does not match the scheme requirements."
            )

    # Rural / Urban
    if rules.get("ruralUrban"):
        user_location = profile.get("ruralUrban", "")

        if user_location not in rules["ruralUrban"]:
            reasons.append(
                "Rural/Urban location does not match the scheme requirements."
            )
        # BPL check
    if rules.get("bpl"):
        user_bpl = profile.get("bpl", "")

        if user_bpl not in rules["bpl"]:
            reasons.append(
                "BPL status does not match the scheme requirements."
            )

    # Student status check
    if rules.get("student"):
        user_student = profile.get("student", "")

        if user_student not in rules["student"]:
            reasons.append(
                "Student status does not match the scheme requirements."
            )

    # Disability check
    if rules.get("disability"):
        user_disability = profile.get("disability", "")

        if user_disability not in rules["disability"]:
            reasons.append(
                "Disability status does not match the scheme requirements."
            )

    # House ownership check
    if rules.get("houseOwnership"):
        user_house = profile.get("houseOwnership", "")

        if user_house not in rules["houseOwnership"]:
            reasons.append(
                "House ownership does not match the scheme requirements."
            )

    # Senior citizen check
    if rules.get("seniorCitizen"):
        user_senior = profile.get("seniorCitizen", "")

        if user_senior not in rules["seniorCitizen"]:
            reasons.append(
                "Senior citizen status does not match the scheme requirements."
            )
    return {
        "eligible": len(reasons) == 0,
        "reasons": reasons
    }
@app.route("/api/eligibility/check", methods=["POST"])
def check_eligibility():
    try:
        incoming_profile = request.get_json()

        if not incoming_profile:
            return jsonify({
                "success": False,
                "message": "Profile data is required."
            }), 400

        # Convert frontend field names
        # into eligibility-engine field names
        profile = {
            "age": incoming_profile.get("age"),
            "income": incoming_profile.get("annualIncome"),
            "occupation": incoming_profile.get("occupation"),
            "category": incoming_profile.get("category"),

            "gender": incoming_profile.get("gender"),
            "state": incoming_profile.get("state"),
            "district": incoming_profile.get("district"),
            "maritalStatus": incoming_profile.get("maritalStatus"),

            "disability": incoming_profile.get("disability"),
            "bpl": incoming_profile.get("bplStatus"),
            "student": incoming_profile.get("studentStatus"),

            "houseOwnership": incoming_profile.get("houseOwnership"),
            "ruralUrban": incoming_profile.get("ruralUrban"),

            "seniorCitizen": incoming_profile.get("seniorCitizen"),
            "widowSingleParent": incoming_profile.get("widowSingleParent"),

            "familySize": incoming_profile.get("familySize"),
            "employmentStatus": incoming_profile.get("employmentStatus"),

            "landOwnership": incoming_profile.get("landOwnership")
        }

        # Get schemes from MongoDB
        schemes = list(
            db.schemes.find({}, {"_id": 0})
        )

        eligible_schemes = []
        not_eligible_schemes = []
        verification_schemes = []
        potential_missed_benefits = []

        # Check every scheme
        for scheme in schemes:

            rules = scheme.get("eligibility", {})

            # -----------------------------------------
            # If scheme has no machine-readable rules
            # -----------------------------------------
            if not rules:

                verification_schemes.append({
                    "name": scheme.get("name", ""),
                    "category": scheme.get("category", ""),
                    "description": scheme.get("description", ""),
                    "benefit": scheme.get("benefit", ""),
                    "documents": scheme.get("documents", []),
                    "applicationMethod": scheme.get(
                        "applicationMethod", ""
                    ),
                    "officialWebsite": scheme.get(
                        "officialWebsite", ""
                    ),
                    "reason": (
                        "This scheme requires verification using "
                        "official government beneficiary records "
                        "or additional eligibility information."
                    )
                })

                continue

            # -----------------------------------------
            # Run eligibility engine
            # -----------------------------------------
            result = check_scheme_eligibility(
                profile,
                scheme
            )

            # -----------------------------------------
            # Eligible
            # -----------------------------------------
            if result["eligible"]:

                eligible_schemes.append({
                    "name": scheme.get("name", ""),
                    "category": scheme.get("category", ""),
                    "description": scheme.get("description", ""),
                    "benefit": scheme.get("benefit", ""),
                    "documents": scheme.get("documents", []),
                    "applicationMethod": scheme.get(
                        "applicationMethod", ""
                    ),
                    "officialWebsite": scheme.get(
                        "officialWebsite", ""
                    )
                })
                potential_missed_benefits.append({
    "name": scheme.get("name", ""),
    "category": scheme.get("category", ""),
    "benefit": scheme.get("benefit", ""),
    "reason": (
        "Your available profile information matches the "
        "stored eligibility conditions. Check whether you "
        "have already applied for or received this benefit."
    ),
    "documents": scheme.get("documents", []),
    "applicationMethod": scheme.get(
        "applicationMethod", ""
    ),
    "officialWebsite": scheme.get(
        "officialWebsite", ""
    )
})

            # -----------------------------------------
            # Not eligible
            # -----------------------------------------
            else:

                not_eligible_schemes.append({
                    "name": scheme.get("name", ""),
                    "category": scheme.get("category", ""),
                    "reasons": result["reasons"]
                })
            potential_missed_benefits = []

            for scheme in eligible_schemes:
             potential_missed_benefits.append({
            "name": scheme["name"],
            "category": scheme.get("category", ""),
            "description": scheme.get("description", ""),
            "benefit": scheme.get("benefit", ""),
            "reason": (
                "Your profile appears to match the available "
                "eligibility conditions, but no application has "
                "been recorded for this scheme."
            ),
            "missedReason": (
                "You may be missing this benefit because your "
                "profile matches the available eligibility "
                "conditions and no application is currently recorded."
            ),
            "documents": scheme.get("documents", [])
        })
        # ---------------------------------------------
        # Final response
        # ---------------------------------------------
        return jsonify({
            "success": True,

            "totalSchemesChecked": len(schemes),

            "eligibleCount": len(eligible_schemes),
            "verificationCount": len(verification_schemes),
            "notEligibleCount": len(not_eligible_schemes),

            "eligibleSchemes": eligible_schemes,

            "verificationSchemes": verification_schemes,

            "notEligibleSchemes": not_eligible_schemes,
            "potentialMissedBenefits": potential_missed_benefits
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
@app.route("/api/applications", methods=["POST"])
def create_application():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Application data is required."
            }), 400

        user_email = data.get("userEmail")
        scheme_name = data.get("schemeName")

        if not user_email or not scheme_name:
            return jsonify({
                "success": False,
                "message": "User email and scheme name are required."
            }), 400

        existing = db.applications.find_one({
            "userEmail": user_email,
            "schemeName": scheme_name
        })

        if existing:
            return jsonify({
                "success": False,
                "message": "Application already exists."
            }), 409

        application = {
            "userEmail": user_email,
            "schemeName": scheme_name,
            "status": "Applied"
        }

        result = db.applications.insert_one(application)

        return jsonify({
            "success": True,
            "message": "Application saved successfully.",
            "applicationId": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
@app.route("/api/applications/<user_email>", methods=["GET"])
def get_user_applications(user_email):
    try:
        applications = list(
            db.applications.find(
                {"userEmail": user_email},
                {"_id": 0}
            )
        )

        return jsonify({
            "success": True,
            "applications": applications
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
@app.route("/api/ai/chat", methods=["POST"])
def ai_chat():
    try:
        data = request.get_json() or {}

        message = data.get("message", "").strip()
        email = data.get("email", "")

        if not message:
            return jsonify({
                "success": False,
                "message": "Please enter a question."
            }), 400

        user_profile = {}

        if email:
            user = db.users.find_one(
                {"email": email},
                {"_id": 0, "profile": 1}
            )

            if user:
                user_profile = user.get("profile", {})

        prompt = f"""
You are Scheme Assist AI, an assistant for Indian government schemes.

User question:
{message}

User's saved profile:
{user_profile}

Instructions:
- Answer clearly and simply.
- Help with Indian government schemes, eligibility, benefits,
  required documents and application guidance.
- Use the user's profile when the question is about their eligibility.
- Do not invent government scheme names, benefits, links or eligibility rules.
- If exact information is unavailable, clearly say so.
- Final eligibility is decided by the concerned government department.
- For application links, recommend the official government portal.
- If the question is unrelated to government schemes, answer briefly and helpfully.
"""

        response = gemini_client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return jsonify({
            "success": True,
            "reply": response.text
        }), 200

    except Exception as e:
        print("AI error:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
if __name__ == "__main__":
    app.run(debug=True)