from services.eligibility_engine import check_scheme_eligibility


scheme = {
    "name": "Test Student Scholarship",
    "eligibility": {
        "occupation": ["Student"],
        "maxIncome": 300000,
        "maxAge": 25,
        "categories": ["SC", "ST", "OBC", "EWS"]
    }
}


profile = {
    "age": "24",
    "income": "15000",
    "occupation": "Student",
    "category": "OBC"
}


result = check_scheme_eligibility(profile, scheme)

print(result)