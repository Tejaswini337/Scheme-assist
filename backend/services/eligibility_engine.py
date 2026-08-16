def check_scheme_eligibility(profile, scheme):
    """
    Compare a user's profile with one government's scheme eligibility rules.
    Returns eligibility status and reasons.
    """

    rules = scheme.get("eligibility", {})
    reasons = []

    # -------------------------------------------------
    # AGE
    # -------------------------------------------------
    try:
        user_age = int(profile.get("age", 0))
    except (ValueError, TypeError):
        user_age = 0

    if "minAge" in rules and user_age < rules["minAge"]:
        reasons.append(
            f"Minimum age should be {rules['minAge']} years."
        )

    if "maxAge" in rules and user_age > rules["maxAge"]:
        reasons.append(
            f"Maximum age should be {rules['maxAge']} years."
        )

    # -------------------------------------------------
    # INCOME
    # -------------------------------------------------
    try:
        user_income = float(profile.get("income", 0))
    except (ValueError, TypeError):
        user_income = 0

    if "minIncome" in rules and user_income < rules["minIncome"]:
        reasons.append(
            f"Annual income should be at least ₹{rules['minIncome']}."
        )

    if "maxIncome" in rules and user_income > rules["maxIncome"]:
        reasons.append(
            f"Annual income should not exceed ₹{rules['maxIncome']}."
        )

    # -------------------------------------------------
    # OCCUPATION
    # -------------------------------------------------
    if rules.get("occupation"):
        user_occupation = str(
            profile.get("occupation", "")
        ).strip().lower()

        allowed_occupations = [
            str(x).strip().lower()
            for x in rules["occupation"]
        ]

        if user_occupation not in allowed_occupations:
            reasons.append(
                "Occupation does not match the scheme requirements."
            )

    # -------------------------------------------------
    # CATEGORY / CASTE
    # -------------------------------------------------
    if rules.get("categories"):
        user_category = str(
            profile.get("category", "")
        ).strip().lower()

        allowed_categories = [
            str(x).strip().lower()
            for x in rules["categories"]
        ]

        if user_category not in allowed_categories:
            reasons.append(
                "Social category does not match the scheme requirements."
            )

    # -------------------------------------------------
    # GENDER
    # -------------------------------------------------
    if rules.get("gender"):
        user_gender = str(
            profile.get("gender", "")
        ).strip().lower()

        allowed_genders = [
            str(x).strip().lower()
            for x in rules["gender"]
        ]

        if user_gender not in allowed_genders:
            reasons.append(
                "Gender does not match the scheme requirements."
            )

    # -------------------------------------------------
    # STATE
    # -------------------------------------------------
    if rules.get("states"):
        user_state = str(
            profile.get("state", "")
        ).strip().lower()

        allowed_states = [
            str(x).strip().lower()
            for x in rules["states"]
        ]

        if user_state not in allowed_states:
            reasons.append(
                "Your state is not covered by this scheme."
            )

    # -------------------------------------------------
    # DISTRICT
    # -------------------------------------------------
    if rules.get("districts"):
        user_district = str(
            profile.get("district", "")
        ).strip().lower()

        allowed_districts = [
            str(x).strip().lower()
            for x in rules["districts"]
        ]

        if user_district not in allowed_districts:
            reasons.append(
                "Your district is not covered by this scheme."
            )

    # -------------------------------------------------
    # MARITAL STATUS
    # -------------------------------------------------
    if rules.get("maritalStatus"):
        user_status = str(
            profile.get("maritalStatus", "")
        ).strip().lower()

        allowed_statuses = [
            str(x).strip().lower()
            for x in rules["maritalStatus"]
        ]

        if user_status not in allowed_statuses:
            reasons.append(
                "Marital status does not match the scheme requirements."
            )

    # -------------------------------------------------
    # DISABILITY
    # -------------------------------------------------
    if "disability" in rules:
        user_disability = str(
            profile.get("disability", "")
        ).strip().lower()

        required_disability = str(
            rules["disability"]
        ).strip().lower()

        if required_disability == "yes":
            if user_disability not in ["yes", "true", "1"]:
                reasons.append(
                    "This scheme requires disability eligibility."
                )

        elif required_disability == "no":
            if user_disability in ["yes", "true", "1"]:
                reasons.append(
                    "This scheme is not applicable to this disability status."
                )

    # -------------------------------------------------
    # BPL STATUS
    # -------------------------------------------------
    if "bpl" in rules:
        user_bpl = str(
            profile.get("bpl", "")
        ).strip().lower()

        required_bpl = str(
            rules["bpl"]
        ).strip().lower()

        if required_bpl == "yes":
            if user_bpl not in ["yes", "true", "1"]:
                reasons.append(
                    "BPL status is required for this scheme."
                )

        elif required_bpl == "no":
            if user_bpl in ["yes", "true", "1"]:
                reasons.append(
                    "This scheme is not applicable to BPL households."
                )

    # -------------------------------------------------
    # STUDENT STATUS
    # -------------------------------------------------
    if "student" in rules:
        user_student = str(
            profile.get("student", "")
        ).strip().lower()

        required_student = str(
            rules["student"]
        ).strip().lower()

        if required_student == "yes":
            if user_student not in ["yes", "true", "1"]:
                reasons.append(
                    "Student status is required for this scheme."
                )

    # -------------------------------------------------
    # LAND OWNERSHIP
    # -------------------------------------------------
    if "landOwnership" in rules:
        user_land = str(
            profile.get("landOwnership", "")
        ).strip().lower()

        required_land = str(
            rules["landOwnership"]
        ).strip().lower()

        if required_land == "yes":
            if user_land not in ["yes", "true", "1"]:
                reasons.append(
                    "Land ownership is required for this scheme."
                )

        elif required_land == "no":
            if user_land in ["yes", "true", "1"]:
                reasons.append(
                    "This scheme requires the applicant not to own land."
                )

    # -------------------------------------------------
    # HOUSE OWNERSHIP
    # -------------------------------------------------
    if "houseOwnership" in rules:
        user_house = str(
            profile.get("houseOwnership", "")
        ).strip().lower()

        required_house = str(
            rules["houseOwnership"]
        ).strip().lower()

        if required_house == "yes":
            if user_house not in ["yes", "true", "1"]:
                reasons.append(
                    "House ownership is required for this scheme."
                )

        elif required_house == "no":
            if user_house in ["yes", "true", "1"]:
                reasons.append(
                    "Applicant should not already own a house."
                )

    # -------------------------------------------------
    # RURAL / URBAN
    # -------------------------------------------------
    if rules.get("ruralUrban"):
        user_area = str(
            profile.get("ruralUrban", "")
        ).strip().lower()

        allowed_areas = [
            str(x).strip().lower()
            for x in rules["ruralUrban"]
        ]

        if user_area not in allowed_areas:
            reasons.append(
                "Your residential area does not match the scheme requirements."
            )

    # -------------------------------------------------
    # FINAL RESULT
    # -------------------------------------------------
    eligible = len(reasons) == 0

    return {
        "eligible": eligible,
        "reasons": reasons
    }