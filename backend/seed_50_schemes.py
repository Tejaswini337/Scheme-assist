from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["scheme_assist"]

schemes = [
    {
    "name": "PM Kisan Samman Nidhi",
    "category": "Agriculture",
    "description": "...",
    "eligibility": {
        "occupation": ["Farmer"],
        "otherConditions": [
            "Eligible landholding farmer family",
            "Subject to scheme exclusions"
        ]
    },
    "documents": [
        "Aadhaar",
        "Land/beneficiary records",
        "Bank account details"
    ],
    "benefit": "₹6,000 per year in three installments",
    "officialSource": "Government of India",
    "officialwebsite": "https://pmkisan.gov.in/"
},
    {
        "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        "category": "Agriculture",
        "description": "Income support scheme for eligible landholding farmer families.",
        "eligibility": {
            "occupation": ["Farmer"],
            "otherConditions": [
                "Eligible landholding farmer family",
                "Cultivable land should be held as required under the scheme",
                "Subject to scheme exclusions and official verification"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Land Records",
            "Bank Account Details"
        ],
        "benefit": "Financial support of ₹6,000 per year, subject to scheme conditions",
        "officialSource": "Government of India",
        "officialwebsite": "https://pmkisan.gov.in/"
    },

    {
        "name": "Pradhan Mantri Fasal Bima Yojana",
        "category": "Agriculture",
        "description": "Government-sponsored crop insurance scheme providing crop risk coverage to eligible farmers.",
        "eligibility": {
            "occupation": ["Farmer"],
            "otherConditions": [
                "Eligibility depends on notified crops and areas",
                "Applicable crop insurance conditions must be satisfied"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Land Records",
            "Bank Account Details",
            "Crop Details"
        ],
        "benefit": "Crop insurance coverage against eligible risks",
        "officialSource": "Government of India",
        "officialwebsite": "https://pmfby.gov.in/"
    },

    {
        "name": "Kisan Credit Card",
        "category": "Agriculture",
        "description": "Credit facility designed to meet eligible farmers' agricultural and allied activity credit requirements.",
        "eligibility": {
            "occupation": ["Farmer"],
            "otherConditions": [
                "Eligibility and lending conditions are determined by the participating financial institution"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Land Records",
            "Bank Account Details",
            "Identity Proof"
        ],
        "benefit": "Agricultural credit facility",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.myscheme.gov.in/schemes/kcc"
    },

    {
        "name": "Pradhan Mantri Krishi Sinchayee Yojana",
        "category": "Agriculture",
        "description": "Government programme focused on improving irrigation coverage and water-use efficiency.",
        "eligibility": {
            "otherConditions": [
                "Eligibility varies according to the relevant component and implementing programme"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Land Records",
            "Bank Account Details"
        ],
        "benefit": "Support related to irrigation and water-use efficiency",
        "officialSource": "Government of India",
        "officialwebsite": "https://sampada-mofpi.gov.in/"
    },

    {
        "name": "Soil Health Card Scheme",
        "category": "Agriculture",
        "description": "Provides soil health information to help farmers make informed decisions about soil nutrients and agricultural inputs.",
        "eligibility": {
            "occupation": ["Farmer"],
            "otherConditions": [
                "Soil samples are assessed under the implementing programme"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Farmer Details",
            "Land Details"
        ],
        "benefit": "Soil health information and nutrient management guidance",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.myscheme.gov.in/schemes/nmmss"
    },

    {
        "name": "PM-KUSUM",
        "category": "Agriculture",
        "description": "Programme supporting solar energy applications in the agricultural sector through its approved components.",
        "eligibility": {
            "occupation": ["Farmer"],
            "otherConditions": [
                "Eligibility depends on the applicable PM-KUSUM component and implementing agency"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Land Documents",
            "Bank Account Details"
        ],
        "benefit": "Support for eligible solar-energy applications in agriculture",
        "officialSource": "Government of India",
        "officialwebsite": "https://scholarships.gov.in/"
    },

    {
        "name": "National Agriculture Market (e-NAM)",
        "category": "Agriculture",
        "description": "National electronic agriculture market platform intended to improve agricultural marketing and price discovery.",
        "eligibility": {
            "occupation": ["Farmer"],
            "otherConditions": [
                "Participation is subject to applicable market and registration requirements"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Farmer Details",
            "Bank Account Details"
        ],
        "benefit": "Access to an electronic agricultural market platform",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.indiascienceandtechnology.gov.in/nurturing-minds/scholarships/school/pre-matric-scholarship-scheme-minorities"
    },

    {
        "name": "Agriculture Infrastructure Fund",
        "category": "Agriculture",
        "description": "Financing facility supporting eligible agricultural infrastructure projects.",
        "eligibility": {
            "otherConditions": [
                "Eligibility depends on the eligible project/activity and applicable guidelines"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Project Documents",
            "Bank Account Details",
            "Identity Proof"
        ],
        "benefit": "Financing support for eligible agricultural infrastructure",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.indiascienceandtechnology.gov.in/nurturing-minds/scholarships/school/post-matric-scholarship-scheme-minorities"
    },

    {
        "name": "National Food Security Mission",
        "category": "Agriculture",
        "description": "Government programme supporting increased production and productivity of selected crops.",
        "eligibility": {
            "occupation": ["Farmer"],
            "otherConditions": [
                "Benefits depend on applicable crop, state and programme components"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Farmer Details",
            "Land Records"
        ],
        "benefit": "Support under applicable crop-production interventions",
        "officialSource": "Government of India",
        "officialwebsite": "https://socialjustice.gov.in/schemes/27"
    },

    {
        "name": "Pradhan Mantri Kisan Sampada Yojana",
        "category": "Agriculture",
        "description": "Comprehensive programme supporting modern food-processing infrastructure and supply-chain development.",
        "eligibility": {
            "otherConditions": [
                "Eligibility depends on the applicable component and project guidelines"
            ]
        },
        "documents": [
            "Identity Proof",
            "Project Documents",
            "Business Documents",
            "Bank Account Details"
        ],
        "benefit": "Support for eligible food-processing infrastructure and supply-chain projects",
        "officialSource": "Government of India",
        "officialwebsite": "https://fellowship.tribal.gov.in/"
    },
        {
        "name": "National Means-cum-Merit Scholarship Scheme",
        "category": "Education",
        "description": "Scholarship support for eligible students to encourage continuation of secondary education.",
        "eligibility": {
            "occupation": ["Student"],
            "otherConditions": [
                "Student must satisfy the scheme's merit and income conditions",
                "Applicable class and examination requirements must be satisfied"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Income Certificate",
            "Student ID",
            "Academic Certificate",
            "Bank Account Details"
        ],
        "benefit": "Scholarship assistance for eligible students",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.myscheme.gov.in/schemes/post-dis"
    },

    {
        "name": "Central Sector Scheme of Scholarship for College and University Students",
        "category": "Education",
        "description": "Scholarship scheme for meritorious students pursuing higher education.",
        "eligibility": {
            "occupation": ["Student"],
            "otherConditions": [
                "Student must satisfy the applicable merit and income criteria",
                "Must be pursuing eligible higher education"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Income Certificate",
            "Academic Certificate",
            "College ID",
            "Bank Account Details"
        ],
        "benefit": "Financial assistance for higher education",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.dosje.gov.in/schemes-and-services/pm-yasasvi/"
    },

    {
        "name": "Pre-Matric Scholarship Scheme for Minorities",
        "category": "Education",
        "description": "Educational assistance for eligible students belonging to notified minority communities.",
        "eligibility": {
            "occupation": ["Student"],
            "otherConditions": [
                "Applicant must satisfy the notified minority-community eligibility",
                "Applicable class and income conditions must be satisfied"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Income Certificate",
            "Community Certificate",
            "School ID",
            "Bank Account Details"
        ],
        "benefit": "Pre-matric educational assistance",
        "officialSource": "Government of India",
        "officialwebsite": ""
    },

    {
        "name": "Post-Matric Scholarship Scheme for Minorities",
        "category": "Education",
        "description": "Educational assistance for eligible minority students pursuing post-matric studies.",
        "eligibility": {
            "occupation": ["Student"],
            "otherConditions": [
                "Applicant must satisfy the notified minority-community eligibility",
                "Applicable course and income conditions must be satisfied"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Income Certificate",
            "Community Certificate",
            "College ID",
            "Bank Account Details"
        ],
        "benefit": "Post-matric educational assistance",
        "officialSource": "Government of India",
        "officialwebsite": "https://socialjustice.gov.in/schemes/23"
    },

    {
        "name": "Top Class Education Scheme for SC Students",
        "category": "Education",
        "description": "Financial support for eligible Scheduled Caste students pursuing higher education in notified institutions.",
        "eligibility": {
            "occupation": ["Student"],
            "categories": ["SC"],
            "otherConditions": [
                "Student must satisfy the applicable income and academic conditions",
                "Institution and course must meet scheme requirements"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Caste Certificate",
            "Income Certificate",
            "College ID",
            "Academic Certificate"
        ],
        "benefit": "Financial support for eligible higher education",
        "officialSource": "Government of India",
        "officialwebsite": "https://pmmvy.wcd.gov.in/Home/Contact"
    },

    {
        "name": "National Fellowship and Scholarship for Higher Education of ST Students",
        "category": "Education",
        "description": "Higher education fellowship and scholarship support for eligible Scheduled Tribe students.",
        "eligibility": {
            "occupation": ["Student"],
            "categories": ["ST"],
            "otherConditions": [
                "Applicant must satisfy the applicable academic and institutional requirements"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "ST Certificate",
            "Academic Certificate",
            "Institution ID",
            "Bank Account Details"
        ],
        "benefit": "Higher education fellowship or scholarship support",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.pmuy.gov.in/index.aspx"
    },

    {
        "name": "Post-Matric Scholarship for Students with Disabilities",
        "category": "Education",
        "description": "Scholarship assistance for eligible students with disabilities pursuing post-matric education.",
        "eligibility": {
            "occupation": ["Student"],
            "disability": ["Yes"],
            "otherConditions": [
                "Applicant must satisfy the applicable disability and course requirements"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Disability Certificate",
            "Student ID",
            "Academic Certificate",
            "Bank Account Details"
        ],
        "benefit": "Educational financial assistance",
        "officialSource": "Government of India",
        "officialwebsite": "https://pmmvy.wcd.gov.in/Home/Contact"
    },

    {
        "name": "PM YASASVI",
        "category": "Education",
        "description": "Scholarship and educational support framework for eligible students from identified disadvantaged communities.",
        "eligibility": {
            "occupation": ["Student"],
            "otherConditions": [
                "Eligibility depends on the applicable PM YASASVI component",
                "Applicable class, income and institutional conditions must be satisfied"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Income Certificate",
            "Category Certificate",
            "Student ID",
            "Academic Certificate"
        ],
        "benefit": "Educational scholarship support",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.nsiindia.gov.in/(S(5f5r2w55mohhxk2tsc3psmvb))/InternalPage.aspx?Id_Pk=89"
    },

    {
        "name": "Pre-Matric Scholarship for SC Students",
        "category": "Education",
        "description": "Educational assistance for eligible Scheduled Caste students at the pre-matric level.",
        "eligibility": {
            "occupation": ["Student"],
            "categories": ["SC"],
            "otherConditions": [
                "Applicable class and family-income conditions must be satisfied"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "SC Certificate",
            "Income Certificate",
            "School ID"
        ],
        "benefit": "Pre-matric educational assistance",
        "officialSource": "Government of India",
        "officialwebsite": "https://socialjustice.gov.in/schemes/23"
    },

    {
        "name": "Post-Matric Scholarship for SC Students",
        "category": "Education",
        "description": "Educational assistance for eligible Scheduled Caste students pursuing post-matric education.",
        "eligibility": {
            "occupation": ["Student"],
            "categories": ["SC"],
            "otherConditions": [
                "Applicable course, institution and family-income conditions must be satisfied"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "SC Certificate",
            "Income Certificate",
            "College ID",
            "Academic Certificate"
        ],
        "benefit": "Post-matric educational assistance",
        "officialSource": "Government of India",
        "officialwebsite": "https://missionshakti.wcd.gov.in/"
    },
        {
        "name": "Pradhan Mantri Ujjwala Yojana (PMUY)",
        "category": "Women & Child",
        "description": "Government scheme for providing LPG connections to eligible women from deprived households.",
        "eligibility": {
            "gender": ["Female"],
            "otherConditions": [
                "Applicant must satisfy the current PMUY household and eligibility conditions",
                "Eligibility is subject to official verification"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Address Proof",
            "Bank Account Details",
            "Other documents as required"
        ],
        "benefit": "LPG connection support for eligible beneficiaries",
        "officialSource": "Government of India",
        "officialwebsite": "https://wcdhry.gov.in/schemes-for-women/onestop-centre/"
    },

    {
        "name": "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        "category": "Women & Child",
        "description": "Maternity benefit scheme providing Direct Benefit Transfer support to eligible pregnant and lactating women.",
        "eligibility": {
            "gender": ["Female"],
            "otherConditions": [
                "Applicant must satisfy the current PMMVY beneficiary conditions",
                "Pregnancy and childbirth-related conditions apply",
                "Application must satisfy the applicable time-limit conditions"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Bank Account Details",
            "Pregnancy/Childbirth Related Records",
            "Other documents as required"
        ],
        "benefit": "Maternity benefit through Direct Benefit Transfer",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.myscheme.gov.in/schemes/whl-181"
    },

    {
        "name": "Sukanya Samriddhi Account Scheme",
        "category": "Women & Child",
        "description": "Small savings scheme designed for the financial future of a girl child.",
        "eligibility": {
            "gender": ["Female"],
            "otherConditions": [
                "Account is intended for an eligible girl child",
                "Account opening and operation are subject to the applicable scheme rules"
            ]
        },
        "documents": [
            "Birth Certificate",
            "Aadhaar Card",
            "Guardian KYC Documents"
        ],
        "benefit": "Long-term savings facility for an eligible girl child",
        "officialSource": "Government of India",
        "officialwebsite": "https://pmay-urban.gov.in/"
    },

    {
        "name": "Beti Bachao Beti Padhao",
        "category": "Women & Child",
        "description": "Government initiative focused on the protection, education and empowerment of the girl child.",
        "eligibility": {
            "otherConditions": [
                "Implementation is through applicable government programmes and interventions",
                "Specific services depend on the relevant component"
            ]
        },
        "documents": [
            "Documents depend on the applicable service or programme"
        ],
        "benefit": "Support for girl-child protection, education and empowerment",
        "officialSource": "Government of India",
        "officialwebsite": "https://pmayg.dord.gov.in/netiayHome/Home.aspx"
    },

    {
        "name": "Mission Shakti",
        "category": "Women & Child",
        "description": "Umbrella scheme aimed at strengthening interventions for women's safety, security and empowerment.",
        "eligibility": {
            "gender": ["Female"],
            "otherConditions": [
                "Eligibility depends on the applicable Mission Shakti component",
                "Specific services may have additional conditions"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Identity Proof",
            "Other documents as required by the applicable component"
        ],
        "benefit": "Women safety, security and empowerment support",
        "officialSource": "Government of India",
        "officialwebsite": "https://ejalshakti.gov.in/JJM/Login.aspx?Ty=se"
    },

    {
        "name": "One Stop Centre Scheme",
        "category": "Women & Child",
        "description": "Support services for women affected by violence through integrated assistance.",
        "eligibility": {
            "gender": ["Female"],
            "otherConditions": [
                "Services are available to women affected by violence",
                "Specific assistance depends on the circumstances and service required"
            ]
        },
        "documents": [
            "Identity Proof where available",
            "Other documents as required"
        ],
        "benefit": "Integrated support and assistance services for women affected by violence",
        "officialSource": "Government of India",
        "officialwebsite": "https://sbm.gov.in/sbm_dbt/secure/login.aspx"
    },

    {
        "name": "Women Helpline Scheme",
        "category": "Women & Child",
        "description": "Support mechanism intended to provide assistance and information to women through the designated helpline system.",
        "eligibility": {
            "gender": ["Female"],
            "otherConditions": [
                "Service availability and assistance depend on the applicable situation"
            ]
        },
        "documents": [
            "Identity information where required"
        ],
        "benefit": "Information, support and referral assistance",
        "officialSource": "Government of India",
        "officialwebsite": "https://swachhbharatmission.ddws.gov.in/"
    },
        {
        "name": "Pradhan Mantri Awas Yojana - Urban 2.0",
        "category": "Housing",
        "description": "Housing support for eligible urban families under the Housing for All mission.",
        "eligibility": {
            "ruralUrban": ["Urban"],
            "otherConditions": [
                "Family must satisfy the applicable EWS, LIG or MIG conditions",
                "Family should not own a pucca house anywhere in India, subject to scheme rules",
                "Applicable city and scheme component conditions must be satisfied"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Income Proof",
            "Address Proof",
            "Bank Account Details",
            "Property or Housing Documents where applicable"
        ],
        "benefit": "Housing assistance under applicable PMAY-U 2.0 component",
        "officialSource": "Government of India",
        "officialwebsite": "https://sbmurban.org/"
    },

    {
        "name": "Pradhan Mantri Awaas Yojana - Gramin",
        "category": "Housing",
        "description": "Rural housing assistance for eligible households to support construction of pucca houses with basic amenities.",
        "eligibility": {
            "ruralUrban": ["Rural"],
            "otherConditions": [
                "Household must satisfy the applicable PMAY-G selection and eligibility conditions",
                "Eligibility is determined using the applicable rural housing criteria and verification"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Residence Proof",
            "Bank Account Details",
            "Household/Beneficiary Records"
        ],
        "benefit": "Rural housing assistance",
        "officialSource": "Government of India",
        "officialwebsite": "https://pmsuryaghar.gov.in/"
    },

    {
        "name": "Jal Jeevan Mission",
        "category": "Basic Services",
        "description": "Government mission focused on providing functional household tap water connections in rural areas.",
        "eligibility": {
            "ruralUrban": ["Rural"],
            "otherConditions": [
                "Implementation is through eligible rural households and local water-supply programmes",
                "Availability depends on the applicable village and implementation plan"
            ]
        },
        "documents": [
            "Address Proof",
            "Household Details",
            "Identity Proof where required"
        ],
        "benefit": "Access to functional household tap water supply",
        "officialSource": "Government of India",
        "officialwebsite": "https://ejalshakti.gov.in/IMISReports/NRDWP_MIS_NationalRuralDrinkingWaterProgramme.htm"
    },

    {
        "name": "Swachh Bharat Mission - Gramin",
        "category": "Basic Services",
        "description": "Rural sanitation programme supporting sanitation and cleanliness interventions.",
        "eligibility": {
            "ruralUrban": ["Rural"],
            "otherConditions": [
                "Specific benefits depend on the applicable rural sanitation component and local implementation"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Address Proof",
            "Household Details"
        ],
        "benefit": "Support for eligible rural sanitation interventions",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.mudra.org.in/"
    },

    {
        "name": "Swachh Bharat Mission - Urban",
        "category": "Basic Services",
        "description": "Urban sanitation mission supporting cleanliness, sanitation and waste-management interventions.",
        "eligibility": {
            "ruralUrban": ["Urban"],
            "otherConditions": [
                "Specific services and benefits depend on the applicable urban local body programme"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Address Proof",
            "Household Details where applicable"
        ],
        "benefit": "Support through applicable urban sanitation services",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.jansamarth.in/prime-minister-svanidhi-scheme"
    },

    {
        "name": "PM Surya Ghar: Muft Bijli Yojana",
        "category": "Energy",
        "description": "Government scheme promoting rooftop solar adoption for residential electricity consumers.",
        "eligibility": {
            "otherConditions": [
                "Applicant must satisfy the current residential consumer and rooftop-solar requirements",
                "Installation must follow the applicable scheme and distribution-company requirements"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Electricity Consumer Details",
            "Bank Account Details",
            "Address Proof"
        ],
        "benefit": "Support/subsidy for eligible residential rooftop solar installations",
        "officialSource": "Government of India",
        "officialwebsite": "https://pmvishwakarma.gov.in/"
    },

    {
        "name": "National Rural Drinking Water Programme",
        "category": "Basic Services",
        "description": "Government rural drinking-water programme supporting access to safe drinking water.",
        "eligibility": {
            "ruralUrban": ["Rural"],
            "otherConditions": [
                "Implementation depends on applicable rural drinking-water programmes and local plans"
            ]
        },
        "documents": [
            "Address Proof",
            "Household Details",
            "Identity Proof where required"
        ],
        "benefit": "Support for rural drinking-water access",
        "officialSource": "Government of India",
        "officialwebsite": "https://xn--o1bna6ezc1cxc.xn--11b7cb3a6a.xn--h2brj9c/offerings/schemes-and-services/details/pradhan-mantri-kaushal-vikas-yojana-4-0-pmkvy-4-0-2021-ITO3ATMtQWa"
    },
        {
        "name": "Pradhan Mantri Mudra Yojana",
        "category": "Business & Self-Employment",
        "description": "Credit support for eligible non-corporate, non-farm small and micro enterprises.",
        "eligibility": {
            "otherConditions": [
                "Applicant must be an Indian citizen",
                "Loan must be for an eligible income-generating activity",
                "Applicant must satisfy applicable lender and scheme conditions"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "PAN Card",
            "Business Details",
            "Bank Account Details"
        ],
        "benefit": "MUDRA loan support for eligible micro and small business activities",
        "officialSource": "Government of India",
        "officialwebsite": "https://pmegp.msme.gov.in/"
    },

    {
        "name": "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
        "category": "Business & Self-Employment",
        "description": "Micro-credit support scheme for eligible street vendors.",
        "eligibility": {
            "occupation": ["Street Vendor"],
            "otherConditions": [
                "Applicant must satisfy the current street-vendor eligibility requirements",
                "Eligibility is subject to the applicable verification and scheme guidelines"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Street Vendor Certificate or Letter of Recommendation where applicable",
            "Bank Account Details",
            "Identity Proof"
        ],
        "benefit": "Working-capital credit support for eligible street vendors",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.myscheme.gov.in/schemes/sui"
    },

    {
        "name": "PM Vishwakarma",
        "category": "Business & Self-Employment",
        "description": "Support programme for eligible artisans and craftspeople engaged in traditional trades.",
        "eligibility": {
            "otherConditions": [
                "Applicant must be engaged in an eligible traditional artisan or craftsperson trade",
                "Applicant must satisfy the current PM Vishwakarma eligibility conditions",
                "Registration and verification requirements apply"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Identity Proof",
            "Bank Account Details",
            "Trade/Occupation Details"
        ],
        "benefit": "Training, toolkit and credit-related support under applicable scheme components",
        "officialSource": "Government of India",
        "officialwebsite": "https://nats.education.gov.in/"
    },

    {
        "name": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
        "category": "Skill Development",
        "description": "Skill training and certification programme aimed at improving employability of eligible Indian youth.",
        "eligibility": {
            "otherConditions": [
                "Eligibility depends on the applicable PMKVY training component",
                "Candidate must satisfy the requirements of the selected training programme"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Identity Proof",
            "Educational Certificate where applicable"
        ],
        "benefit": "Skill training, assessment and certification support",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.myscheme.gov.in/hi/schemes/ddugku"
    },

    {
        "name": "Prime Minister's Employment Generation Programme (PMEGP)",
        "category": "Employment & Entrepreneurship",
        "description": "Credit-linked support programme for setting up eligible new self-employment ventures and micro enterprises.",
        "eligibility": {
            "otherConditions": [
                "Applicant must satisfy the applicable PMEGP beneficiary conditions",
                "Project must meet applicable scheme requirements",
                "New eligible self-employment ventures are covered subject to guidelines"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "PAN Card",
            "Project Report",
            "Bank Account Details",
            "Educational Certificate where applicable"
        ],
        "benefit": "Credit-linked subsidy support for eligible new micro enterprises",
        "officialSource": "Government of India",
        "officialwebsite": "https://nirdpr.org.in/rseti/"
    },

    {
        "name": "Stand-Up India",
        "category": "Business & Self-Employment",
        "description": "Bank loan support for eligible SC/ST entrepreneurs and women entrepreneurs for greenfield enterprises.",
        "eligibility": {
            "otherConditions": [
                "Applicant must satisfy the current Stand-Up India eligibility conditions",
                "Enterprise must meet the applicable greenfield requirements",
                "Loan and banking conditions apply"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "PAN Card",
            "Business Plan",
            "Identity Proof",
            "Bank Documents"
        ],
        "benefit": "Bank loan support for eligible greenfield enterprises",
        "officialSource": "Government of India",
        "officialwebsite": "https://pmjdy.gov.in/"
    },

    {
        "name": "Startup India",
        "category": "Business & Self-Employment",
        "description": "Government initiative supporting eligible startups through recognition and access to various benefits and ecosystem support.",
        "eligibility": {
            "otherConditions": [
                "Entity must satisfy the applicable Startup India recognition conditions",
                "Recognition is subject to current government rules and verification"
            ]
        },
        "documents": [
            "Entity Registration Documents",
            "PAN",
            "Business Details",
            "Founder Details"
        ],
        "benefit": "Startup recognition and access to applicable government support",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.myscheme.gov.in/schemes/pmjjby"
    },

    {
        "name": "National Apprenticeship Promotion Scheme",
        "category": "Skill Development",
        "description": "Government programme promoting apprenticeship training and engagement of apprentices.",
        "eligibility": {
            "otherConditions": [
                "Eligibility depends on the applicable apprenticeship trade and programme conditions",
                "Apprentice and establishment requirements apply"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Educational Certificate",
            "Bank Account Details",
            "Identity Proof"
        ],
        "benefit": "Support for apprenticeship training and employability",
        "officialSource": "Government of India",
        "officialwebsite": "https://jansuraksha.in/pmsbyScheme"
    },

    {
        "name": "Deen Dayal Upadhyaya Grameen Kaushalya Yojana",
        "category": "Skill Development",
        "description": "Rural skills and placement-oriented programme for eligible rural youth.",
        "eligibility": {
            "ruralUrban": ["Rural"],
            "otherConditions": [
                "Applicant must satisfy the applicable rural youth and programme conditions",
                "Training and placement conditions depend on the selected programme"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Residence Proof",
            "Educational Certificate where applicable",
            "Bank Account Details"
        ],
        "benefit": "Skill training and employment-oriented support",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.npscra.proteantech.in/scheme-details.php"
    },

    {
        "name": "Rural Self Employment Training Institutes (RSETI)",
        "category": "Skill Development",
        "description": "Rural self-employment training initiative supporting entrepreneurship and livelihood skills.",
        "eligibility": {
            "ruralUrban": ["Rural"],
            "otherConditions": [
                "Eligibility depends on the applicable RSETI training programme",
                "Training centre-specific requirements may apply"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Residence Proof",
            "Identity Proof",
            "Educational Certificate where applicable"
        ],
        "benefit": "Entrepreneurship and self-employment training",
        "officialSource": "Government of India",
        "officialwebsite": "https://maandhan.in/"
    },
        {
        "name": "Pradhan Mantri Jan Dhan Yojana",
        "category": "Financial Inclusion",
        "description": "National financial inclusion programme focused on access to basic banking services.",
        "eligibility": {
            "otherConditions": [
                "Eligible Indian residents can open an account subject to applicable banking requirements"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Identity Proof",
            "Address Proof"
        ],
        "benefit": "Access to basic banking and financial inclusion services",
        "officialSource": "Government of India",
        "officialwebsite": "https://csc.gov.in/pmkmy"
    },

    {
        "name": "Pradhan Mantri Jeevan Jyoti Bima Yojana",
        "category": "Social Security",
        "description": "Government-backed life insurance scheme available through participating banks and insurers.",
        "eligibility": {
            "otherConditions": [
                "Applicant must satisfy the current age and account-related conditions",
                "Enrollment is subject to applicable insurance and scheme rules"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Bank Account Details",
            "Consent/Auto-debit Authorization"
        ],
        "benefit": "Life insurance coverage under the scheme",
        "officialSource": "Government of India",
        "officialwebsite": "https://web.umang.gov.in/landing/department/national-social-assistance-programme-nsap.html"
    },

    {
        "name": "Pradhan Mantri Suraksha Bima Yojana",
        "category": "Social Security",
        "description": "Accident insurance scheme offered through participating banks and insurers.",
        "eligibility": {
            "otherConditions": [
                "Applicant must satisfy the current age and participating-bank account conditions",
                "Enrollment is subject to applicable insurance rules"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Bank Account Details",
            "Consent/Auto-debit Authorization"
        ],
        "benefit": "Accident insurance coverage under the scheme",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.myscheme.gov.in/schemes/nfbs"
    },

    {
        "name": "Atal Pension Yojana",
        "category": "Social Security",
        "description": "Government-backed pension scheme aimed at providing retirement income security.",
        "eligibility": {
            "otherConditions": [
                "Applicant must satisfy the current age and account-related conditions",
                "Enrollment is subject to applicable pension-scheme rules"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Bank Account Details",
            "Identity Proof"
        ],
        "benefit": "Pension support after meeting applicable scheme conditions",
        "officialSource": "Government of India",
        "officialwebsite": "https://janaushadhi.gov.in/"
    },

    {
        "name": "Pradhan Mantri Shram Yogi Maandhan",
        "category": "Social Security",
        "description": "Contributory pension scheme for eligible unorganised workers.",
        "eligibility": {
            "occupation": ["Unorganised Worker"],
            "otherConditions": [
                "Applicant must satisfy the current age and income conditions",
                "Applicant must not fall under the scheme's excluded categories",
                "Applicable contribution requirements apply"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Bank Account Details",
            "Identity Proof"
        ],
        "benefit": "Pension support for eligible unorganised workers",
        "officialSource": "Government of India",
        "officialwebsite": "https://janaushadhi.gov.in/"
    },

    {
        "name": "Pradhan Mantri Kisan Maandhan Yojana",
        "category": "Social Security",
        "description": "Contributory pension scheme for eligible small and marginal farmers.",
        "eligibility": {
            "occupation": ["Farmer"],
            "otherConditions": [
                "Applicant must satisfy the current small and marginal farmer conditions",
                "Applicable age and landholding conditions apply",
                "Contribution requirements apply"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Land Records",
            "Bank Account Details"
        ],
        "benefit": "Pension support for eligible farmers",
        "officialSource": "Government of India",
        "officialwebsite": "https://study.com/learn/student-support-teaching.html"
    },

    {
        "name": "National Social Assistance Programme",
        "category": "Social Security",
        "description": "Social assistance programme covering eligible beneficiaries through specified welfare components.",
        "eligibility": {
            "otherConditions": [
                "Eligibility depends on the applicable NSAP component",
                "Applicable poverty, age and beneficiary conditions must be satisfied"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Age Proof",
            "Income/BPL-related Documents",
            "Bank Account Details"
        ],
        "benefit": "Social assistance under applicable NSAP components",
        "officialSource": "Government of India",
        "officialwebsite": "https://housing.ap.gov.in/"
    },

    {
        "name": "National Family Benefit Scheme",
        "category": "Social Security",
        "description": "Financial assistance component under the National Social Assistance Programme for eligible families after the death of the primary breadwinner.",
        "eligibility": {
            "otherConditions": [
                "Family must satisfy the applicable NSAP and beneficiary conditions",
                "Death of the eligible primary breadwinner must be established",
                "Applicable income and household conditions apply"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Death Certificate",
            "Family/Household Records",
            "Bank Account Details"
        ],
        "benefit": "Financial assistance to eligible families",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.india.gov.in/category/benefits-social-development/subcategory/women-children/details/support-to-training-and-employment-programme-for-women"
    },

    {
        "name": "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
        "category": "Health",
        "description": "Government-funded health assurance programme providing eligible beneficiaries access to healthcare services.",
        "eligibility": {
            "otherConditions": [
                "Eligibility is determined according to the current PM-JAY beneficiary database and applicable government criteria",
                "Hospital and treatment coverage is subject to scheme rules"
            ]
        },
        "documents": [
            "Aadhaar Card",
            "Beneficiary Identification/Eligibility Record",
            "Other documents as required"
        ],
        "benefit": "Cashless healthcare coverage for eligible beneficiaries under PM-JAY",
        "officialSource": "Government of India",
        "officialwebsite": "https://www.helpinghandindiango.org/?gad_source=1&gad_campaignid=737593438&gbraid=0AAAAADNtTMu8ptyI8GNprnfPQC-e4VfpB&gclid=CjwKCAjwhZDUBhBGEiwAbi5bjqCoECduzBo0xa0MynvX2hNVvLh1fy3X3G9hQME0zX6Icj0Gmul02xoCFDkQAvD_BwE"
    },

    {
        "name": "Pradhan Mantri Bhartiya Janaushadhi Pariyojana",
        "category": "Health",
        "description": "Government initiative promoting access to quality generic medicines through Jan Aushadhi outlets.",
        "eligibility": {
            "otherConditions": [
                "Availability and purchase are subject to the applicable medicine and outlet requirements"
            ]
        },
        "documents": [
            "Prescription where required",
            "Identity Proof where required"
        ],
        "benefit": "Access to quality generic medicines at affordable prices",
        "officialSource": "Government of India",
        "officialwebsite": "https://thecreats.org/rural-education?gad_source=1&gad_campaignid=23070270703&gbraid=0AAAAAqYf243dlNovJ7Ei9gMqqazWR-0uE&gclid=CjwKCAjwhZDUBhBGEiwAbi5bjuYybm1CgPVFh7KGLEB9jg5JUwMQe7KSXkUU7gLI_2jIrdWG10OKsBoC1acQAvD_BwE"
    },
]

# Remove existing scheme data
db.schemes.delete_many({})

# Insert all schemes
db.schemes.insert_many(schemes)

print("Schemes inserted successfully!")
print("Total schemes:", db.schemes.count_documents({}))