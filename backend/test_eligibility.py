import requests

profile = {
    "age": "21",
    "income": "150000",
    "occupation": "Student",
    "category": "OBC"
}

response = requests.post(
    "http://127.0.0.1:5000/api/eligibility/check",
    json=profile
)

print("Status:", response.status_code)
print(response.json())