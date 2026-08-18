import os
import json

from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from google import genai

load_dotenv()

# =========================================================
# CONFIGURATION
# =========================================================

app = Flask(__name__)
CORS(app)

MONGODB_URI = os.getenv("MONGODB_URI")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not MONGODB_URI:
    print("⚠️ MONGODB_URI is missing in .env")

if not GEMINI_API_KEY:
    print("⚠️ GEMINI_API_KEY is missing in .env")

# =========================================================
# GEMINI AI CLIENT
# =========================================================

gemini_client = None

if GEMINI_API_KEY:
    try:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        print("✅ Gemini AI client initialized!")
    except Exception as e:
        print("❌ Gemini initialization failed:", e)

# =========================================================
# MONGODB
# =========================================================

try:
    client = MongoClient(MONGODB_URI)
    db = client["scheme_assist"]

    client.admin.command("ping")
    print("✅ MongoDB Atlas connected successfully!")

except Exception as e:
    print("❌ MongoDB Atlas connection failed:", e)
    client = None
    db = None


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():
    return "Scheme Assist Backend is Running!"


# =========================================================
# TEST DATABASE
# =========================================================

@app.route("/test-db")
def test_db():

    try:
        client.admin.command("ping")

        return jsonify({
            "success": True,
            "message": "MongoDB connected successfully!",
            "database": "scheme_assist"
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =========================================================
# REGISTER
# =========================================================

@app.route("/api/register", methods=["POST"])
def register():

    try:

        data = request.get_json() or {}

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:

            return jsonify({
                "success": False,
                "message": "Name, email and password are required."
            }), 400

        existing_user = db.users.find_one({
            "email": email
        })

        if existing_user:

            return jsonify({
                "success": False,
                "message": "User already registered."
            }), 409

        password_hash = generate_password_hash(password)

        user = {
            "name": name,
            "email": email,
            "password": password_hash
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


# =========================================================
# LOGIN
# =========================================================

@app.route("/api/login", methods=["POST"])
def login():

    try:

        data = request.get_json() or {}

        email = data.get("email")
        password = data.get("password")

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

        if not check_password_hash(
            user["password"],
            password
        ):

            return jsonify({
                "success": False,
                "message": "Incorrect password."
            }), 401

        return jsonify({
            "success": True,
            "message": "Login successful!",
            "user": {
                "name": user["name"],
                "email": user["email"],
                "profile": user.get("profile", {})
            }
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================================
# SAVE PROFILE
# =========================================================

@app.route("/api/profile", methods=["POST"])
def save_profile():

    try:

        data = request.get_json() or {}

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


# =========================================================
# GET ALL SCHEMES
# =========================================================

@app.route("/api/schemes", methods=["GET"])
def get_schemes():

    try:

        schemes = list(
            db.schemes.find(
                {},
                {"_id": 0}
            )
        )

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


# =========================================================
# NORMALIZE VALUES
# =========================================================

def normalize(value):

    if value is None:
        return ""

    if isinstance(value, bool):
        return str(value).lower()

    return str(value).strip().lower()


# =========================================================
# CHECK ONE SCHEME
# =========================================================

def check_scheme_eligibility(profile, scheme):

    rules = scheme.get("eligibility", {})

    reasons = []

    # -----------------------------------------------------
    # AGE
    # -----------------------------------------------------

    try:

        user_age = int(profile.get("age", 0))

        if "minAge" in rules:

            if user_age < int(rules["minAge"]):

                reasons.append(
                    f"Age should be {rules['minAge']} or above."
                )

        if "maxAge" in rules:

            if user_age > int(rules["maxAge"]):

                reasons.append(
                    f"Age should be {rules['maxAge']} or below."
                )

    except (ValueError, TypeError):

        pass

    # -----------------------------------------------------
    # INCOME
    # -----------------------------------------------------

    if "maxIncome" in rules:

        try:

            user_income = float(
                profile.get("income", 0)
            )

            if user_income > float(
                rules["maxIncome"]
            ):

                reasons.append(
                    f"Annual income should not exceed ₹{rules['maxIncome']}."
                )

        except (ValueError, TypeError):

            pass

    # -----------------------------------------------------
    # GENERIC LIST MATCH FUNCTION
    # -----------------------------------------------------

    def check_list_rule(
        rule_key,
        profile_key,
        message
    ):

        if not rules.get(rule_key):
            return

        allowed_values = rules.get(rule_key)

        if not isinstance(allowed_values, list):
            allowed_values = [allowed_values]

        user_value = normalize(
            profile.get(profile_key, "")
        )

        allowed_normalized = [
            normalize(value)
            for value in allowed_values
        ]

        if user_value not in allowed_normalized:

            reasons.append(message)

    # -----------------------------------------------------
    # OCCUPATION
    # -----------------------------------------------------

    check_list_rule(
        "occupation",
        "occupation",
        "Occupation does not match the scheme requirements."
    )

    # -----------------------------------------------------
    # CATEGORY
    # -----------------------------------------------------

    check_list_rule(
        "categories",
        "category",
        "Category does not match the scheme requirements."
    )

    # -----------------------------------------------------
    # GENDER
    # -----------------------------------------------------

    check_list_rule(
        "gender",
        "gender",
        "Gender does not match the scheme requirements."
    )

    # -----------------------------------------------------
    # RURAL / URBAN
    # -----------------------------------------------------

    check_list_rule(
        "ruralUrban",
        "ruralUrban",
        "Rural/Urban location does not match the scheme requirements."
    )

    # -----------------------------------------------------
    # BPL
    # -----------------------------------------------------

    check_list_rule(
        "bpl",
        "bpl",
        "BPL status does not match the scheme requirements."
    )

    # -----------------------------------------------------
    # STUDENT
    # -----------------------------------------------------

    check_list_rule(
        "student",
        "student",
        "Student status does not match the scheme requirements."
    )

    # -----------------------------------------------------
    # DISABILITY
    # -----------------------------------------------------

    check_list_rule(
        "disability",
        "disability",
        "Disability status does not match the scheme requirements."
    )

    # -----------------------------------------------------
    # HOUSE OWNERSHIP
    # -----------------------------------------------------

    check_list_rule(
        "houseOwnership",
        "houseOwnership",
        "House ownership does not match the scheme requirements."
    )

    # -----------------------------------------------------
    # SENIOR CITIZEN
    # -----------------------------------------------------

    check_list_rule(
        "seniorCitizen",
        "seniorCitizen",
        "Senior citizen status does not match the scheme requirements."
    )

    # -----------------------------------------------------
    # RESULT
    # -----------------------------------------------------

    return {
        "eligible": len(reasons) == 0,
        "reasons": reasons
    }


# =========================================================
# BASE MATCH SCORE
# =========================================================

def calculate_match_score(profile, scheme):

    rules = scheme.get("eligibility", {})

    if not rules:

        return 50

    total = 0
    matched = 0

    # -----------------------------------------------------
    # AGE
    # -----------------------------------------------------

    try:

        age = int(profile.get("age", 0))

        if "minAge" in rules:

            total += 1

            if age >= int(rules["minAge"]):
                matched += 1

        if "maxAge" in rules:

            total += 1

            if age <= int(rules["maxAge"]):
                matched += 1

    except:

        pass

    # -----------------------------------------------------
    # INCOME
    # -----------------------------------------------------

    if "maxIncome" in rules:

        total += 1

        try:

            if float(profile.get("income", 0)) <= float(
                rules["maxIncome"]
            ):

                matched += 1

        except:

            pass

    # -----------------------------------------------------
    # OTHER RULES
    # -----------------------------------------------------

    fields = [
        ("occupation", "occupation"),
        ("categories", "category"),
        ("gender", "gender"),
        ("ruralUrban", "ruralUrban"),
        ("bpl", "bpl"),
        ("student", "student"),
        ("disability", "disability"),
        ("houseOwnership", "houseOwnership"),
        ("seniorCitizen", "seniorCitizen")
    ]

    for rule_key, profile_key in fields:

        if not rules.get(rule_key):
            continue

        total += 1

        allowed = rules.get(rule_key)

        if not isinstance(allowed, list):
            allowed = [allowed]

        user_value = normalize(
            profile.get(profile_key, "")
        )

        allowed_values = [
            normalize(x)
            for x in allowed
        ]

        if user_value in allowed_values:
            matched += 1

    if total == 0:

        return 50

    return round(
        (matched / total) * 100
    )


# =========================================================
# AI JSON CLEANER
# =========================================================

def clean_ai_json(text):

    if not text:
        return []

    text = text.strip()

    text = text.replace(
        "```json",
        ""
    )

    text = text.replace(
        "```",
        ""
    )

    text = text.strip()

    # Find JSON array if Gemini added extra text
    start = text.find("[")

    end = text.rfind("]")

    if start != -1 and end != -1:

        text = text[start:end + 1]

    try:

        result = json.loads(text)

        if isinstance(result, list):
            return result

    except Exception as e:

        print(
            "⚠️ AI JSON parsing failed:",
            e
        )

    return []


# =========================================================
# AI ANALYSIS OF ELIGIBLE SCHEMES
# =========================================================

def ai_analyze_schemes(
    profile,
    eligible_schemes
):

    print(
        "🤖 AI FUNCTION CALLED FOR ELIGIBLE SCHEMES"
    )

    if not eligible_schemes:
        return []

    # -----------------------------------------------------
    # Always create a non-zero fallback score
    # -----------------------------------------------------

    for scheme in eligible_schemes:

        scheme["aiScore"] = calculate_match_score(
            profile,
            scheme
        )

        scheme["aiExplanation"] = (
            "This scheme matches the available "
            "eligibility information in your profile."
        )

    # -----------------------------------------------------
    # If Gemini unavailable
    # -----------------------------------------------------

    if not gemini_client:

        print(
            "⚠️ Gemini unavailable. Using rule-based match score."
        )

        eligible_schemes.sort(
            key=lambda x: x.get("aiScore", 0),
            reverse=True
        )

        return eligible_schemes

    # -----------------------------------------------------
    # Create compact AI input
    # -----------------------------------------------------

    scheme_input = []

    for index, scheme in enumerate(
        eligible_schemes
    ):

        scheme_input.append({
            "id": index,
            "name": scheme.get("name", ""),
            "category": scheme.get("category", ""),
            "description": scheme.get("description", ""),
            "benefit": scheme.get("benefit", "")
        })

    prompt = f"""
You are the AI ranking engine inside an Indian Government Scheme
Eligibility and Missed-Benefit Detection system.

USER PROFILE:
{json.dumps(profile, ensure_ascii=False)}

ELIGIBLE SCHEMES:
{json.dumps(scheme_input, ensure_ascii=False)}

Important rules:

1. The rule engine has ALREADY decided that these schemes are eligible.
2. Do not change eligibility.
3. Rank schemes by relevance to the user.
4. Give every scheme an AI relevance score from 1 to 100.
5. Give every scheme a short explanation.
6. Use ONLY the supplied information.
7. Do not invent benefits, eligibility rules or scheme names.
8. Return an object for EVERY supplied scheme.
9. Keep the same "id" values.

Return ONLY valid JSON:

[
  {{
    "id": 0,
    "aiScore": 85,
    "aiExplanation": "Short explanation"
  }}
]
"""

    try:

        response = gemini_client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        print(
            "🤖 GEMINI RESPONSE RECEIVED"
        )

        result = clean_ai_json(
            response.text
        )

        # -------------------------------------------------
        # Apply AI results using ID
        # -------------------------------------------------

        for item in result:

            if not isinstance(item, dict):
                continue

            try:

                index = int(
                    item.get("id")
                )

            except:

                continue

            if 0 <= index < len(
                eligible_schemes
            ):

                score = item.get(
                    "aiScore",
                    eligible_schemes[index]["aiScore"]
                )

                try:
                    score = int(score)
                except:
                    score = eligible_schemes[index]["aiScore"]

                score = max(
                    1,
                    min(100, score)
                )

                eligible_schemes[index][
                    "aiScore"
                ] = score

                explanation = item.get(
                    "aiExplanation"
                )

                if explanation:

                    eligible_schemes[index][
                        "aiExplanation"
                    ] = explanation

        # -------------------------------------------------
        # Sort highest AI score first
        # -------------------------------------------------

        eligible_schemes.sort(
            key=lambda x: x.get(
                "aiScore",
                0
            ),
            reverse=True
        )

        print(
            "🤖 AI SCORES:",
            [
                (
                    s.get("name"),
                    s.get("aiScore")
                )
                for s in eligible_schemes
            ]
        )

        return eligible_schemes

    except Exception as e:

        print(
            "❌ AI analysis error:",
            e
        )

        # Never return 0 just because AI failed
        eligible_schemes.sort(
            key=lambda x: x.get(
                "aiScore",
                0
            ),
            reverse=True
        )

        return eligible_schemes


# =========================================================
# AI ANALYSIS OF VERIFICATION SCHEMES
# =========================================================

def ai_analyze_verification_schemes(
    profile,
    verification_schemes
):

    if not verification_schemes:
        return []

    # Default score so frontend never shows 0
    for scheme in verification_schemes:

        scheme["aiScore"] = 50

        scheme["aiExplanation"] = (
            "This scheme may be relevant, but "
            "additional eligibility information "
            "or official verification is required."
        )

    if not gemini_client:
        return verification_schemes

    scheme_input = []

    for index, scheme in enumerate(
        verification_schemes
    ):

        scheme_input.append({
            "id": index,
            "name": scheme.get("name", ""),
            "category": scheme.get("category", ""),
            "description": scheme.get("description", ""),
            "benefit": scheme.get("benefit", "")
        })

    prompt = f"""
You are an AI relevance engine for Indian government schemes.

USER PROFILE:
{json.dumps(profile, ensure_ascii=False)}

SCHEMES REQUIRING VERIFICATION:
{json.dumps(scheme_input, ensure_ascii=False)}

For every scheme:
- Give a relevance score from 1 to 100.
- Explain why it may be relevant.
- Do not claim definite eligibility.
- Do not invent information.
- Keep the same id.

Return ONLY JSON:

[
  {{
    "id": 0,
    "aiScore": 70,
    "aiExplanation": "Short explanation"
  }}
]
"""

    try:

        response = gemini_client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        result = clean_ai_json(
            response.text
        )

        for item in result:

            if not isinstance(item, dict):
                continue

            try:

                index = int(
                    item.get("id")
                )

            except:

                continue

            if 0 <= index < len(
                verification_schemes
            ):

                try:

                    score = int(
                        item.get(
                            "aiScore",
                            50
                        )
                    )

                except:

                    score = 50

                score = max(
                    1,
                    min(100, score)
                )

                verification_schemes[index][
                    "aiScore"
                ] = score

                if item.get(
                    "aiExplanation"
                ):

                    verification_schemes[index][
                        "aiExplanation"
                    ] = item[
                        "aiExplanation"
                    ]

        verification_schemes.sort(
            key=lambda x: x.get(
                "aiScore",
                0
            ),
            reverse=True
        )

        return verification_schemes

    except Exception as e:

        print(
            "⚠️ Verification AI error:",
            e
        )

        return verification_schemes


# =========================================================
# AI MISSED BENEFIT ANALYSIS
# =========================================================

def ai_analyze_missed_benefits(
    profile,
    missed_benefits
):

    if not missed_benefits:
        return []

    # Safe fallback
    for scheme in missed_benefits:

        scheme["priorityScore"] = max(
            1,
            calculate_match_score(
                profile,
                scheme
            )
        )

        scheme["aiExplanation"] = (
            "Your profile appears to match "
            "the available eligibility information. "
            "Check whether you have already applied "
            "for or received this benefit."
        )

    if not gemini_client:
        return missed_benefits

    scheme_input = []

    for index, scheme in enumerate(
        missed_benefits
    ):

        scheme_input.append({
            "id": index,
            "name": scheme.get("name", ""),
            "category": scheme.get("category", ""),
            "benefit": scheme.get("benefit", ""),
            "reason": scheme.get("reason", "")
        })

    prompt = f"""
You are an AI-powered missed-benefit detector for
Indian government welfare schemes.

USER PROFILE:
{json.dumps(profile, ensure_ascii=False)}

POTENTIAL MISSED BENEFITS:
{json.dumps(scheme_input, ensure_ascii=False)}

For every scheme:
1. Give a priority score from 1 to 100.
2. Explain why the user should check it.
3. Do not claim definite eligibility.
4. Do not invent benefits or rules.
5. Use "may be eligible" or "potentially eligible".
6. Keep the same id.

Return ONLY JSON:

[
  {{
    "id": 0,
    "priorityScore": 80,
    "aiExplanation": "Short explanation"
  }}
]
"""

    try:

        response = gemini_client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        result = clean_ai_json(
            response.text
        )

        for item in result:

            if not isinstance(item, dict):
                continue

            try:

                index = int(
                    item.get("id")
                )

            except:

                continue

            if 0 <= index < len(
                missed_benefits
            ):

                try:

                    score = int(
                        item.get(
                            "priorityScore",
                            missed_benefits[index][
                                "priorityScore"
                            ]
                        )
                    )

                except:

                    score = missed_benefits[index][
                        "priorityScore"
                    ]

                score = max(
                    1,
                    min(100, score)
                )

                missed_benefits[index][
                    "priorityScore"
                ] = score

                if item.get(
                    "aiExplanation"
                ):

                    missed_benefits[index][
                        "aiExplanation"
                    ] = item[
                        "aiExplanation"
                    ]

        missed_benefits.sort(
            key=lambda x: x.get(
                "priorityScore",
                0
            ),
            reverse=True
        )

        return missed_benefits

    except Exception as e:

        print(
            "⚠️ Missed-benefit AI error:",
            e
        )

        return missed_benefits


# =========================================================
# ELIGIBILITY API
# =========================================================

@app.route(
    "/api/eligibility/check",
    methods=["POST"]
)
def check_eligibility():

    try:

        incoming_profile = (
            request.get_json() or {}
        )

        if not incoming_profile:

            return jsonify({
                "success": False,
                "message": "Profile data is required."
            }), 400

        # -------------------------------------------------
        # Convert frontend fields
        # -------------------------------------------------

        profile = {

            "age": incoming_profile.get(
                "age"
            ),

            "income": incoming_profile.get(
                "annualIncome"
            ),

            "occupation": incoming_profile.get(
                "occupation"
            ),

            "category": incoming_profile.get(
                "category"
            ),

            "gender": incoming_profile.get(
                "gender"
            ),

            "state": incoming_profile.get(
                "state"
            ),

            "district": incoming_profile.get(
                "district"
            ),

            "maritalStatus": incoming_profile.get(
                "maritalStatus"
            ),

            "disability": incoming_profile.get(
                "disability"
            ),

            "bpl": incoming_profile.get(
                "bplStatus"
            ),

            "student": incoming_profile.get(
                "studentStatus"
            ),

            "houseOwnership": incoming_profile.get(
                "houseOwnership"
            ),

            "ruralUrban": incoming_profile.get(
                "ruralUrban"
            ),

            "seniorCitizen": incoming_profile.get(
                "seniorCitizen"
            ),

            "widowSingleParent": incoming_profile.get(
                "widowSingleParent"
            ),

            "familySize": incoming_profile.get(
                "familySize"
            ),

            "employmentStatus": incoming_profile.get(
                "employmentStatus"
            ),

            "landOwnership": incoming_profile.get(
                "landOwnership"
            )
        }

        # -------------------------------------------------
        # GET ALL 55 SCHEMES
        # -------------------------------------------------

        schemes = list(
            db.schemes.find(
                {},
                {"_id": 0}
            )
        )

        print(
            "========================================"
        )

        print(
            "TOTAL SCHEMES:",
            len(schemes)
        )

        print(
            "========================================"
        )

        eligible_schemes = []
        not_eligible_schemes = []
        verification_schemes = []
        potential_missed_benefits = []

        # -------------------------------------------------
        # CHECK EVERY SCHEME
        # -------------------------------------------------

        for scheme in schemes:

            rules = scheme.get(
                "eligibility",
                {}
            )

            # ---------------------------------------------
            # NO RULES -> VERIFICATION
            # ---------------------------------------------

            if not rules:

                verification_schemes.append({

                    "name": scheme.get(
                        "name",
                        ""
                    ),

                    "category": scheme.get(
                        "category",
                        ""
                    ),

                    "description": scheme.get(
                        "description",
                        ""
                    ),

                    "benefit": scheme.get(
                        "benefit",
                        ""
                    ),

                    "documents": scheme.get(
                        "documents",
                        []
                    ),

                    "applicationMethod": scheme.get(
                        "applicationMethod",
                        ""
                    ),

                    "officialWebsite": scheme.get(
                        "officialWebsite",
                        ""
                    ),

                    "reason": (
                        "This scheme requires official "
                        "verification or additional "
                        "eligibility information."
                    )
                })

                continue

            # ---------------------------------------------
            # RULE ENGINE
            # ---------------------------------------------

            result = check_scheme_eligibility(
                profile,
                scheme
            )

            # ---------------------------------------------
            # ELIGIBLE
            # ---------------------------------------------

            if result["eligible"]:

                eligible_item = {

                    "name": scheme.get(
                        "name",
                        ""
                    ),

                    "category": scheme.get(
                        "category",
                        ""
                    ),

                    "description": scheme.get(
                        "description",
                        ""
                    ),

                    "benefit": scheme.get(
                        "benefit",
                        ""
                    ),

                    "documents": scheme.get(
                        "documents",
                        []
                    ),

                    "applicationMethod": scheme.get(
                        "applicationMethod",
                        ""
                    ),

                    "officialWebsite": scheme.get(
                        "officialWebsite",
                        ""
                    ),

                    "matchScore": calculate_match_score(
                        profile,
                        scheme
                    )
                }

                eligible_schemes.append(
                    eligible_item
                )

                # Potential missed benefit
                potential_missed_benefits.append({

                    "name": scheme.get(
                        "name",
                        ""
                    ),

                    "category": scheme.get(
                        "category",
                        ""
                    ),

                    "description": scheme.get(
                        "description",
                        ""
                    ),

                    "benefit": scheme.get(
                        "benefit",
                        ""
                    ),

                    "reason": (
                        "Your profile appears to match "
                        "the available eligibility conditions. "
                        "Check whether you have already applied "
                        "for or received this benefit."
                    ),

                    "missedReason": (
                        "You may be missing this benefit because "
                        "your profile matches the available "
                        "eligibility conditions and no application "
                        "is currently recorded."
                    ),

                    "documents": scheme.get(
                        "documents",
                        []
                    ),

                    "applicationMethod": scheme.get(
                        "applicationMethod",
                        ""
                    ),

                    "officialWebsite": scheme.get(
                        "officialWebsite",
                        ""
                    )
                })

            # ---------------------------------------------
            # NOT ELIGIBLE
            # ---------------------------------------------

            else:

                not_eligible_schemes.append({

                    "name": scheme.get(
                        "name",
                        ""
                    ),

                    "category": scheme.get(
                        "category",
                        ""
                    ),

                    "reasons": result[
                        "reasons"
                    ]
                })

        # =================================================
        # AI PROCESSING
        # =================================================

        print(
            "🤖 Starting AI analysis..."
        )

        # AI ranking for eligible schemes
        eligible_schemes = ai_analyze_schemes(
            profile,
            eligible_schemes
        )

        # AI ranking for schemes requiring verification
        verification_schemes = (
            ai_analyze_verification_schemes(
                profile,
                verification_schemes
            )
        )

        # AI missed-benefit detection
        potential_missed_benefits = (
            ai_analyze_missed_benefits(
                profile,
                potential_missed_benefits
            )
        )

        print(
            "🤖 AI processing completed!"
        )

        # =================================================
        # FINAL RESPONSE
        # =================================================

        return jsonify({

            "success": True,

            "totalSchemesChecked": len(
                schemes
            ),

            "eligibleCount": len(
                eligible_schemes
            ),

            "verificationCount": len(
                verification_schemes
            ),

            "notEligibleCount": len(
                not_eligible_schemes
            ),

            "eligibleSchemes":
                eligible_schemes,

            "verificationSchemes":
                verification_schemes,

            "notEligibleSchemes":
                not_eligible_schemes,

            "potentialMissedBenefits":
                potential_missed_benefits

        }), 200

    except Exception as e:

        print(
            "❌ ELIGIBILITY ERROR:",
            e
        )

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# =========================================================
# CREATE APPLICATION
# =========================================================

@app.route(
    "/api/applications",
    methods=["POST"]
)
def create_application():

    try:

        data = request.get_json() or {}

        if not data:

            return jsonify({
                "success": False,
                "message": "Application data is required."
            }), 400

        user_email = data.get(
            "userEmail"
        )

        scheme_name = data.get(
            "schemeName"
        )

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

        result = db.applications.insert_one(
            application
        )

        return jsonify({

            "success": True,

            "message": "Application saved successfully.",

            "applicationId":
                str(result.inserted_id)

        }), 201

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# =========================================================
# GET USER APPLICATIONS
# =========================================================

@app.route(
    "/api/applications/<user_email>",
    methods=["GET"]
)
def get_user_applications(
    user_email
):

    try:

        applications = list(
            db.applications.find(
                {
                    "userEmail":
                        user_email
                },
                {
                    "_id": 0
                }
            )
        )

        return jsonify({

            "success": True,

            "applications":
                applications

        }), 200

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# =========================================================
# AI CHAT
# =========================================================

@app.route(
    "/api/ai/chat",
    methods=["POST"]
)
def ai_chat():

    try:

        data = request.get_json() or {}

        message = data.get(
            "message",
            ""
        ).strip()

        email = data.get(
            "email",
            ""
        )

        if not message:

            return jsonify({

                "success": False,

                "message":
                    "Please enter a question."

            }), 400

        if not gemini_client:

            return jsonify({

                "success": False,

                "message":
                    "Gemini AI is not configured."

            }), 500

        user_profile = {}

        if email:

            user = db.users.find_one(

                {
                    "email": email
                },

                {
                    "_id": 0,
                    "profile": 1
                }

            )

            if user:

                user_profile = user.get(
                    "profile",
                    {}
                )

        prompt = f"""
You are Scheme Assist AI, an AI assistant for
Indian government schemes.

USER QUESTION:
{message}

USER PROFILE:
{json.dumps(user_profile, ensure_ascii=False)}

Instructions:

- Help with Indian government schemes.
- Explain eligibility, benefits, documents and application guidance.
- Use the user's profile when relevant.
- Do not invent scheme names, benefits or eligibility rules.
- If exact information is unavailable, clearly say so.
- Final eligibility is decided by the concerned government department.
- Give simple and clear answers.
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

        print(
            "❌ AI CHAT ERROR:",
            e
        )

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    print(
        "========================================"
    )

    print(
        "🚀 Scheme Assist Backend Starting..."
    )

    print(
        "========================================"
    )

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
        use_reloader=False
    )