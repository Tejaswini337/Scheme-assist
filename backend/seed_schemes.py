from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["scheme_assist"]

schemes = [

    {
        "name": "Student Education Support",
        "category": "Education",
        "description": "Financial support for eligible students from economically weaker backgrounds.",
        "eligibility": {
            "occupation": ["Student"],
            "maxIncome": 300000,
            "maxAge": 25,
            "categories": ["SC", "ST", "OBC", "EWS"]
        },
        "documents": [
            "Aadhaar Card",
            "Income Certificate",
            "Caste Certificate",
            "Student ID"
        ],
        "benefit": "Education financial assistance",
        "officialWebsite": "https://scholarships.gov.in/"
    },

    {
        "name": "Low Income Family Housing Support",
        "category": "Housing",
        "description": "Housing assistance for eligible low-income families.",
        "eligibility": {
            "maxIncome": 300000,
            "categories": ["SC", "ST", "OBC", "EWS"]
        },
        "documents": [
            "Aadhaar Card",
            "Income Certificate",
            "Residence Certificate"
        ],
        "benefit": "Housing assistance",
        "officialWebsite": "https://pmay-urban.gov.in/"
    },

    {
        "name": "Women Employment Support",
        "category": "Employment",
        "description": "Support for eligible women seeking employment or livelihood opportunities.",
        "eligibility": {
            "gender": ["Female"],
            "maxIncome": 400000,
            "categories": ["SC", "ST", "OBC", "EWS"]
        },
        "documents": [
            "Aadhaar Card",
            "Income Certificate",
            "Bank Account Details"
        ],
        "benefit": "Employment and livelihood support",
        "officialWebsite": "https://www.spniwcd.wcd.gov.in/"
    },

    {
        "name": "Senior Citizen Assistance",
        "category": "Social Welfare",
        "description": "Financial assistance for eligible senior citizens.",
        "eligibility": {
            "minAge": 60,
            "maxIncome": 300000
        },
        "documents": [
            "Aadhaar Card",
            "Age Proof",
            "Income Certificate"
        ],
        "benefit": "Senior citizen financial assistance",
        "officialWebsite": "https://nsap.nic.in/"
    },

    {
        "name": "Rural Livelihood Support",
        "category": "Rural Development",
        "description": "Support for eligible individuals in rural areas for livelihood opportunities.",
        "eligibility": {
            "maxIncome": 250000,
            "ruralUrban": ["Rural"],
            "categories": ["SC", "ST", "OBC", "EWS"]
        },
        "documents": [
            "Aadhaar Card",
            "Income Certificate",
            "Residence Certificate"
        ],
        "benefit": "Livelihood assistance",
        "officialWebsite": "https://nrlm.gov.in/"
    }

]

db.schemes.delete_many({})

db.schemes.insert_many(schemes)

print("Schemes inserted successfully!")
print("Total schemes:", db.schemes.count_documents({}))