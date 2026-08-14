import { GovernmentScheme, PersonaPreset } from '../types';

export const ALL_SCHEMES: GovernmentScheme[] = [
  // 1. Health & Social Insurance
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    hindiName: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना',
    acronym: 'PM-JAY',
    ministry: 'Ministry of Health and Family Welfare (National Health Authority)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Health & Insurance',
    benefitType: 'Insurance Cover',
    estimatedAnnualValue: 0,
    insuranceCoverValue: 500000,
    valueDisplay: '₹5,00,000 / family / year Free Secondary & Tertiary Hospitalization',
    summary: 'Provides cashless and paperless access to 1,949+ medical procedures across 27,000+ empaneled public and private hospitals across India.',
    fullDescription: 'PM-JAY is the world’s largest government funded health assurance scheme. Covers 3 days pre-hospitalization, diagnostics, surgeries, ICU, implants, medicine, and 15 days post-hospitalization care without out-of-pocket expenses.',
    eligibilityRules: {
      maxIncome: 250000,
      allowedRationCards: ['AAY', 'BPL_PHH'],
      requireBpl: false,
    },
    keyBenefits: [
      '₹5 Lakh cashless health cover per family per year on floater basis',
      'Covers pre-existing illnesses from Day 1',
      'Portability across any empaneled hospital anywhere in India',
      'Covers major surgeries including cardiac, oncology, orthopedics & ICU'
    ],
    requiredDocuments: ['Aadhaar Card', 'Ration Card (PHH / AAY / SECC Listing)', 'Mobile Number'],
    officialPortalUrl: 'https://mera.pmjay.gov.in/search/login',
    helplineNumber: '14555',
    isCscAvailable: true,
    howToApplySteps: [
      'Check Aadhaar or Ration Card number on PM-JAY beneficiary portal (mera.pmjay.gov.in).',
      'Visit your nearest Ayushman Mitra desk at any empaneled government/private hospital or CSC.',
      'Complete biometric e-KYC and download your PVC Ayushman Golden Card.'
    ],
    commonRejectionReasons: [
      'Name mismatch between Aadhaar and Ration Card / SECC 2011 database',
      'Income tax payer status in household',
      'APL / Non-priority ration card without state top-up inclusion'
    ],
    tag: 'Flagship'
  },
  {
    id: 'pm-kisan',
    name: 'PM Kisan Samman Nidhi Yojana',
    hindiName: 'प्रधानमंत्री किसान सम्मान निधि',
    acronym: 'PM-KISAN',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central',
    applicableStates: 'All',
    category: 'Agriculture & Farmers',
    benefitType: 'Direct Cash Transfer',
    estimatedAnnualValue: 6000,
    valueDisplay: '₹6,000 / year (₹2,000 in 3 direct DBT installments)',
    summary: 'Direct income support of ₹6,000 per year in three equal 4-monthly installments to all cultivable landholding farmer families.',
    fullDescription: 'PM-KISAN is an institutional income transfer mechanism directly sent to the Aadhaar-seeded bank account of landholding farmer families to supplement their agricultural inputs and domestic needs.',
    eligibilityRules: {
      requiredOccupations: ['Farmer', 'Small / Marginal Farmer'],
      maxLandholdingAcres: 50,
      ruralOnly: false
    },
    keyBenefits: [
      '₹6,000 assured direct bank transfer (DBT) every year',
      'Transferred directly without any intermediary commission',
      'Enables purchase of seeds, fertilizers, diesel, and equipment',
      'Automatically qualifies farmer for PM Kisan Maandhan & KCC'
    ],
    requiredDocuments: ['Aadhaar Card', 'Land Ownership Record (Khatauni / RoR / Patta)', 'Aadhaar-seeded Bank Passbook', 'Active Mobile Number'],
    officialPortalUrl: 'https://pmkisan.gov.in',
    helplineNumber: '155261 / 011-24300606',
    isCscAvailable: true,
    howToApplySteps: [
      'Go to "Farmers Corner" on pmkisan.gov.in or visit local Village Revenue Officer / CSC.',
      'Enter Aadhaar number and land mutation / Khatauni document details.',
      'Complete mandatory OTP or Biometric e-KYC and ensure NPCI bank DBT is active.'
    ],
    commonRejectionReasons: [
      'Bank Account not seeded with NPCI / Aadhaar Direct Benefit Transfer mapper',
      'Land record name mismatch with Aadhaar spelling',
      'Institutional landholder or serving/retired government employee'
    ],
    tag: 'Flagship'
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Kaushal Samman Yojana',
    hindiName: 'प्रधानमंत्री विश्वकर्मा कौशल सम्मान योजना',
    acronym: 'PM-Vishwakarma',
    ministry: 'Ministry of Micro, Small & Medium Enterprises (MSME)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Skill & Entrepreneurship',
    benefitType: 'Subsidized Loan / Capital',
    estimatedAnnualValue: 15000,
    oneTimeGrantValue: 15000,
    loanSubsidyValue: '₹3,00,000 Collateral-free loan @ 5% concessional interest',
    valueDisplay: '₹15,000 Toolkit E-Voucher + ₹3 Lakh Loan @ 5% + ₹500/day Training Stipend',
    summary: 'Holistic support for 18 traditional artisan and craft trades including carpenters, blacksmiths, goldsmiths, potters, cobblers, masons, tailors, and weavers.',
    fullDescription: 'Provides PM Vishwakarma Certificate & ID Card, 5-7 days basic skill training with ₹500/day stipend, ₹15,000 modern digital toolkit incentive, and collateral-free enterprise development loans (₹1 Lakh tranche 1 + ₹2 Lakh tranche 2 @ 5% interest with 8% govt subsidy).',
    eligibilityRules: {
      minAge: 18,
      requiredOccupations: ['Traditional Artisan / Craftsperson', 'Construction Worker', 'Small Business Owner / MSME'],
    },
    keyBenefits: [
      '₹15,000 e-voucher grant for purchasing modern artisan toolkit',
      '₹3 Lakh collateral-free loan in 2 tranches at only 5% interest',
      '₹500 per day stipend during basic and advanced skill training',
      'Official PM Vishwakarma ID card and national artisan recognition'
    ],
    requiredDocuments: ['Aadhaar Card', 'Mobile linked to Aadhaar', 'Bank Account details', 'Ration card / Family declaration', 'Proof of artisan trade'],
    officialPortalUrl: 'https://pmvishwakarma.gov.in',
    helplineNumber: '18002677777',
    isCscAvailable: true,
    howToApplySteps: [
      'Visit local CSC with Aadhaar and registered mobile for biometric verification.',
      'Select your specific traditional trade from the 18 approved artisan categories.',
      'Gram Panchayat / Urban Local Body verifies trade -> Receive certificate & toolkit voucher.'
    ],
    commonRejectionReasons: [
      'Trade does not fall under the 18 specified traditional craft categories',
      'Another family member has already availed PM Vishwakarma benefits',
      'Existing default in institutional bank loan'
    ],
    tag: 'High Impact'
  },
  {
    id: 'pm-svanidhi',
    name: 'PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi)',
    hindiName: 'पीएम स्वनिधि योजना - स्ट्रीट वेंडर्स आत्मनिर्भर निधि',
    acronym: 'PM-SVANidhi',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Financial & Livelihoods',
    benefitType: 'Subsidized Loan / Capital',
    estimatedAnnualValue: 4200,
    loanSubsidyValue: '₹80,000 cumulative working capital (₹10k -> ₹20k -> ₹50k) @ 7% interest subsidy',
    valueDisplay: 'Collateral-free working capital loan up to ₹50,000 + 7% Interest Subsidy + Cashback',
    summary: 'Empowers urban and peri-urban street vendors with affordable collateral-free working capital loans to restart and expand livelihoods.',
    fullDescription: 'Facilitates collateral-free micro-credit: 1st tranche ₹10,000 (1 year), 2nd tranche ₹20,000 (18 months), and 3rd tranche ₹50,000 (36 months). Timely repayment gives 7% interest subsidy directly credited to bank account and up to ₹1,200/year digital transaction cashback.',
    eligibilityRules: {
      requiredOccupations: ['Street Vendor'],
      minAge: 18,
    },
    keyBenefits: [
      'No collateral or guarantor needed for loan approval',
      '7% annual interest subsidy credited quarterly to bank account',
      'Cashback of up to ₹100/month on digital payment transactions (QR code)',
      'Gradual credit limit increase from ₹10k to ₹50k upon prompt repayment'
    ],
    requiredDocuments: ['Vending Certificate / Letter of Recommendation from ULB or Town Vending Committee', 'Aadhaar Card', 'Bank Passbook'],
    officialPortalUrl: 'https://pmsvanidhi.mohua.gov.in',
    helplineNumber: '1800111979',
    isCscAvailable: true,
    howToApplySteps: [
      'Check Town Vending Committee (TVC) survey list or obtain Letter of Recommendation (LoR) from Municipal Corporation.',
      'Apply online on pmsvanidhi.mohua.gov.in or through Banking Correspondent (BC) / CSC.',
      'Loan is sanctioned and disbursed directly to savings account within 7 to 10 days.'
    ],
    commonRejectionReasons: [
      'Lack of Vending Certificate or Letter of Recommendation from Urban Local Body',
      'Vending outside municipal or notified urban limits'
    ],
    tag: 'Popular'
  },
  {
    id: 'pm-awas-gramin',
    name: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
    hindiName: 'प्रधानमंत्री आवास योजना - ग्रामीण',
    acronym: 'PMAY-G',
    ministry: 'Ministry of Rural Development',
    level: 'Central',
    applicableStates: 'All',
    category: 'Housing & Sanitation',
    benefitType: 'Asset / In-Kind Grant',
    estimatedAnnualValue: 0,
    oneTimeGrantValue: 120000,
    valueDisplay: '₹1,20,000 to ₹1,30,000 100% Direct Cash Grant + 90 days MGNREGA wages',
    summary: 'Direct financial assistance for construction of a 25 sq.m disaster-resilient pucca house with hygienic cooking space for rural homeless and kutcha house dwellers.',
    fullDescription: 'Financial grant of ₹1.20 Lakh in plain areas and ₹1.30 Lakh in hilly/difficult/northeastern states. Additionally bundles ₹12,000 under Swachh Bharat for toilet construction and 90-95 person-days of unskilled labor wages (~₹24,000) under MGNREGA.',
    eligibilityRules: {
      ruralOnly: true,
      requiresKutchaHouse: true,
      maxIncome: 180000
    },
    keyBenefits: [
      '₹1.20 Lakh (Plain) / ₹1.30 Lakh (Hilly/Tribal) direct grant in 3 construction tranches',
      'Extra ₹12,000 grant for building hygienic toilet under Swachh Bharat Mission',
      'Extra 90-95 days MGNREGA unskilled wage support (~₹24,000 direct credit)',
      'Free LPG connection under PM Ujjwala Yojana upon completion'
    ],
    requiredDocuments: ['Aadhaar Card', 'MGNREGA Job Card', 'Bank Account Passbook (Aadhaar linked)', 'Photo of existing Kutcha / dilapidated house with GPS geotag', 'Ration Card / SECC 2011 listing'],
    officialPortalUrl: 'https://pmayg.nic.in',
    helplineNumber: '1800116446',
    isCscAvailable: true,
    howToApplySteps: [
      'Verify name in Gram Sabha Priority Awaas+ waiting list through Village Panchayat / Gram Sevak.',
      'Block Development Officer (BDO) conducts geotagged photo verification of current kutcha dwelling.',
      'Sanction order issued; funds released directly into bank account at plinth, roof, and completion stages.'
    ],
    commonRejectionReasons: [
      'Ownership of existing pucca house anywhere in India',
      'Ownership of motorized 3/4 wheeler or mechanized agricultural equipment',
      'Any family member earning above ₹15,000/month or paying income tax'
    ],
    tag: 'Flagship'
  },
  {
    id: 'sukanya-samriddhi',
    name: 'Sukanya Samriddhi Yojana (Beti Bachao Beti Padhao)',
    hindiName: 'सुकन्या समृद्धि योजना (बेटी बचाओ बेटी पढ़ाओ)',
    acronym: 'SSY',
    ministry: 'Ministry of Finance / Ministry of Women and Child Development',
    level: 'Central',
    applicableStates: 'All',
    category: 'Women & Child Welfare',
    benefitType: 'Direct Cash Transfer',
    estimatedAnnualValue: 18000,
    valueDisplay: '8.2% Guaranteed Highest Tax-Free Interest Rate + High Maturity Wealth',
    summary: 'Government-backed high-yield savings scheme exclusively for a girl child below 10 years of age, ensuring funds for higher education and marriage.',
    fullDescription: 'Accounts can be opened in Post Office or authorized commercial banks with minimum deposit of ₹250/year. Offers highest sovereign guaranteed interest (currently 8.2% p.a. compounded yearly) with Triple Tax Exemption (EEE under Section 80C).',
    eligibilityRules: {
      requiresGirlChild: true,
    },
    keyBenefits: [
      'High 8.2% sovereign-backed tax-free compounding interest rate',
      'Account matures when girl reaches 21 years of age',
      '50% partial withdrawal allowed for higher education once girl reaches age 18',
      'Deposits qualify for 80C income tax deduction and tax-free interest/maturity'
    ],
    requiredDocuments: ['Girl Child’s Birth Certificate', 'Parent/Guardian Aadhaar Card & PAN Card', 'Address Proof', 'Passport size photographs'],
    officialPortalUrl: 'https://www.indiapost.gov.in/Financial/Pages/Content/SSY.aspx',
    helplineNumber: '18002666868',
    isCscAvailable: false,
    howToApplySteps: [
      'Visit any India Post Office or nationalized bank branch (SBI, PNB, BoB, etc.).',
      'Submit Form SSA-1 with girl child birth certificate and guardian Aadhaar.',
      'Deposit initial opening amount (minimum ₹250) and collect official SSY Passbook.'
    ],
    commonRejectionReasons: [
      'Girl child age exceeds 10 years at time of application',
      'More than two SSY accounts opened in one family (except for twins/triplets)'
    ],
    tag: 'Women Centric'
  },
  {
    id: 'pm-matru-vandana',
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    hindiName: 'प्रधानमंत्री मातृ वंदना योजना',
    acronym: 'PMMVY',
    ministry: 'Ministry of Women and Child Development',
    level: 'Central',
    applicableStates: 'All',
    category: 'Women & Child Welfare',
    benefitType: 'Direct Cash Transfer',
    estimatedAnnualValue: 5000,
    valueDisplay: '₹5,000 Cash Transfer (1st child) & ₹6,000 for 2nd girl child',
    summary: 'Maternity benefit cash incentive directly transferred to pregnant and lactating mothers for wage compensation and nutritional support.',
    fullDescription: 'Cash incentive of ₹5,000 in two installments for the first live birth upon early pregnancy registration and institutional health checkup. For a second child, if it is a girl, ₹6,000 is transferred in a single installment to promote female child sex ratio.',
    eligibilityRules: {
      requiresPregnantOrLactating: true,
      maxIncome: 800000
    },
    keyBenefits: [
      '₹5,000 direct cash transfer into mother’s Aadhaar-linked bank account',
      'Extra ₹6,000 incentive if the second child born is a girl child',
      'Compensates for wage loss during pregnancy and post-delivery period',
      'Promotes institutional delivery, vaccinations, and maternal nutrition'
    ],
    requiredDocuments: ['Mother & Husband Aadhaar Card', 'Mother and Child Protection (MCP) Card', 'Aadhaar-seeded Bank Passbook in mother’s name', 'Child Birth Certificate (for 2nd installment)'],
    officialPortalUrl: 'https://pmmvy.wcd.gov.in',
    helplineNumber: '011-23382393',
    isCscAvailable: true,
    howToApplySteps: [
      'Register pregnancy at local Anganwadi Center (AWC) or Government Primary Health Center (PHC).',
      'Fill Form 1A with MCP Card details and mother’s individual bank account details.',
      'Anganwadi / ASHA worker submits verification online on PMMVY portal.'
    ],
    commonRejectionReasons: [
      'Mother is in regular employment with Central / State Government or PSU (already entitled to paid maternity leave)',
      'Bank account is not in mother’s individual name (joint account without primary holder linkage)',
      'Delayed registration beyond 570 days from LMP date'
    ],
    tag: 'Women Centric'
  },
  {
    id: 'eshram-social-security',
    name: 'e-Shram National Database & Social Security Scheme',
    hindiName: 'ई-श्रम असंगठित कर्मकार सामाजिक सुरक्षा योजना',
    acronym: 'e-Shram',
    ministry: 'Ministry of Labour & Employment',
    level: 'Central',
    applicableStates: 'All',
    category: 'Financial & Livelihoods',
    benefitType: 'Insurance Cover',
    estimatedAnnualValue: 2400,
    insuranceCoverValue: 200000,
    valueDisplay: 'Universal UAN Card + ₹2 Lakh Free Accidental Death/Disability Cover',
    summary: 'National identity database for 29+ crore unorganized workers providing universal 12-digit UAN card, seamless social security integration, and accident coverage.',
    fullDescription: 'Unorganized workers (construction, agriculture labor, gig/delivery, maids, carpenters, drivers, weavers, street vendors) get Universal Account Number (UAN) with ₹2,00,000 accidental death/permanent disability cover and ₹1,00,000 partial disability cover under PMSBY.',
    eligibilityRules: {
      minAge: 16,
      maxAge: 59,
      requiredOccupations: [
        'Agricultural Labourer',
        'Construction Worker',
        'Gig / Platform / Domestic Worker',
        'Street Vendor',
        'Traditional Artisan / Craftsperson',
        'Small / Marginal Farmer'
      ],
    },
    keyBenefits: [
      'Universal 12-digit e-Shram UAN card valid across all Indian states',
      '₹2 Lakh free accidental death & permanent total disability insurance',
      '₹1 Lakh accidental partial disability coverage',
      'Direct gateway to social security welfare, disaster cash relief, and pension integration'
    ],
    requiredDocuments: ['Aadhaar Card', 'Aadhaar-linked Mobile Number', 'Savings Bank Account IFSC & Number'],
    officialPortalUrl: 'https://eshram.gov.in',
    helplineNumber: '14434',
    isCscAvailable: true,
    howToApplySteps: [
      'Visit eshram.gov.in or nearest CSC / Post Office / State Seva Kendra.',
      'Enter Aadhaar number and verify via OTP.',
      'Select your primary unorganized occupation, enter bank account, and download instant UAN Card.'
    ],
    commonRejectionReasons: [
      'Member of EPFO (Provident Fund) or ESIC (Employee State Insurance)',
      'Income Tax payer',
      'Age under 16 or above 59'
    ],
    tag: 'High Impact'
  },
  {
    id: 'atal-pension-yojana',
    name: 'Atal Pension Yojana (APY)',
    hindiName: 'अटल पेंशन योजना',
    acronym: 'APY',
    ministry: 'Ministry of Finance (PFRDA)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Social Security & Pensions',
    benefitType: 'Monthly Pension',
    estimatedAnnualValue: 36000,
    valueDisplay: 'Guaranteed Lifetime Monthly Pension of ₹1,000 to ₹5,000 / month after age 60',
    summary: 'Government-guaranteed pension scheme for all unorganized sector citizens, providing predictable monthly pension for life starting from age 60.',
    fullDescription: 'Subscribers can choose a guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 from age 60 until death. After subscriber’s death, same pension is paid to spouse for life, and full accumulated corpus is returned to nominees.',
    eligibilityRules: {
      minAge: 18,
      maxAge: 40,
    },
    keyBenefits: [
      'Guaranteed government monthly pension of ₹1,000 to ₹5,000 for entire life',
      '100% pension continues for spouse after subscriber’s demise',
      'Full accumulated pension corpus (~₹8.5 Lakhs for ₹5k pension) refunded to nominee',
      'Auto-debit facility from savings bank with low monthly contribution (starting as low as ₹42/mo at age 18)'
    ],
    requiredDocuments: ['Savings Bank Account / Post Office Account', 'Aadhaar Card', 'Mobile Number'],
    officialPortalUrl: 'https://npscra.nsdl.co.in/scheme-details.php',
    helplineNumber: '1800110069',
    isCscAvailable: true,
    howToApplySteps: [
      'Visit your bank branch or log in to Internet/Mobile Banking.',
      'Submit APY registration form with choice of monthly pension amount (₹1k to ₹5k) and nominee details.',
      'Auto-debit is activated; PRAN statement issued via SMS/email.'
    ],
    commonRejectionReasons: [
      'Age is above 40 years at time of joining',
      'Applicant is an income tax payer (as per updated 2022 guidelines)'
    ],
    tag: 'Popular'
  },
  {
    id: 'pm-ujjwala-2',
    name: 'Pradhan Mantri Ujjwala Yojana 2.0 (PMUY)',
    hindiName: 'प्रधानमंत्री उज्ज्वला योजना २.०',
    acronym: 'PMUY',
    ministry: 'Ministry of Petroleum and Natural Gas',
    level: 'Central',
    applicableStates: 'All',
    category: 'Housing & Sanitation',
    benefitType: 'Asset / In-Kind Grant',
    estimatedAnnualValue: 3600,
    oneTimeGrantValue: 3200,
    valueDisplay: 'Free LPG Gas Connection + 1st Filled Cylinder + Hotplate Stove + ₹300/refill subsidy',
    summary: 'Provides deposit-free LPG connections to poor and underprivileged adult women from households without an existing LPG cylinder.',
    fullDescription: 'PMUY 2.0 provides deposit-free LPG connection, first refill cylinder free of cost, and a free double-burner hotplate/stove. Beneficiaries receive a targeted direct subsidy of ₹300 per 14.2 kg cylinder for up to 12 refills per year.',
    eligibilityRules: {
      allowedGenders: ['Female'],
      minAge: 18,
      requiresNoLPG: true,
      maxIncome: 200000
    },
    keyBenefits: [
      'Zero deposit: 100% free LPG connection in adult woman’s name',
      'Free 1st 14.2kg filled cylinder and free double-burner gas stove included',
      'Targeted DBT subsidy of ₹300 per cylinder on up to 12 refills per year',
      'Protects family from indoor air pollution and biomass smoke hazards'
    ],
    requiredDocuments: ['Aadhaar of applicant & all adult family members', 'Ration Card / 14-point declaration', 'Bank Account (Aadhaar linked)', 'Proof of address / self-declaration for migrants'],
    officialPortalUrl: 'https://www.pmuy.gov.in',
    helplineNumber: '1906 / 18002666696',
    isCscAvailable: true,
    howToApplySteps: [
      'Apply online at pmuy.gov.in or submit form at nearest Indane, Bharatgas, or HP Gas distributor.',
      'Provide adult woman’s Aadhaar, family ration card, and KYC declaration.',
      'Gas distributor delivers cylinder, regulator, and stove directly to your home within 7 days.'
    ],
    commonRejectionReasons: [
      'Existing active LPG connection already registered in the name of any family member',
      'Applicant is male (scheme is strictly registered in adult woman’s name)'
    ],
    tag: 'Women Centric'
  },
  {
    id: 'kisan-credit-card',
    name: 'Kisan Credit Card (KCC) Subsidized Loan Scheme',
    hindiName: 'किसान क्रेडिट कार्ड (केसीसी) योजना',
    acronym: 'KCC',
    ministry: 'Ministry of Agriculture & Farmers Welfare / RBI & NABARD',
    level: 'Central',
    applicableStates: 'All',
    category: 'Agriculture & Farmers',
    benefitType: 'Subsidized Loan / Capital',
    estimatedAnnualValue: 9000,
    loanSubsidyValue: 'Up to ₹3,00,000 credit limit @ effective 4% interest per annum',
    valueDisplay: 'Collateral-free credit up to ₹1.6 Lakh (@ 4% interest) & up to ₹3 Lakh with land hypothecation',
    summary: 'Provides adequate and timely credit support under single window to farmers for cultivation expenses, post-harvest costs, and dairy/animal husbandry.',
    fullDescription: 'Offers 7% nominal interest rate with 3% prompt repayment incentive (PRI) from Govt of India, reducing effective interest rate to just 4% p.a. Loans up to ₹1.60 Lakh are completely collateral-free.',
    eligibilityRules: {
      requiredOccupations: ['Farmer', 'Small / Marginal Farmer', 'Agricultural Labourer'],
    },
    keyBenefits: [
      'Effective interest rate of only 4% on timely repayment',
      'Collateral-free credit limit up to ₹1.60 Lakh (and up to ₹3 Lakh with simple land record)',
      'Includes free crop insurance coverage under PM Fasal Bima Yojana',
      'Revolving cash credit line valid for 5 years with simple annual review'
    ],
    requiredDocuments: ['Aadhaar Card', 'Land Title Record / Patta / Land Revenue receipt / Tenant Agreement', 'Passport size photographs', 'PM-KISAN registration ID'],
    officialPortalUrl: 'https://pmkisan.gov.in/KCC.aspx',
    helplineNumber: '18001801551',
    isCscAvailable: true,
    howToApplySteps: [
      'Download 1-page simplified KCC form from pmkisan.gov.in or visit bank where PM-KISAN account exists.',
      'Attach land title document copy and submission receipt.',
      'Bank is mandated to issue KCC Card within 14 working days.'
    ],
    commonRejectionReasons: [
      'Unresolved default in existing agricultural loan with another institutional bank',
      'Absence of agricultural land record or tenancy certificate'
    ],
    tag: 'Flagship'
  },
  {
    id: 'post-matric-scholarship-sc-st',
    name: 'Post-Matric Scholarship for SC/ST/OBC Students',
    hindiName: 'अनुसूचित जाति/जनजाति/ओबीसी छात्रवृत्ति योजना',
    acronym: 'PMS-SC/ST/OBC',
    ministry: 'Ministry of Social Justice and Empowerment / Ministry of Tribal Affairs',
    level: 'Central',
    applicableStates: 'All',
    category: 'Education & Scholarships',
    benefitType: 'Scholarship & Fee Waiver',
    estimatedAnnualValue: 24000,
    valueDisplay: '100% Non-refundable Tuition Fee Waiver + ₹4,000 to ₹13,500/year Maintenance Allowance',
    summary: 'Complete financial assistance for SC, ST, and OBC students studying post-matriculation or post-secondary courses (Class 11 to Ph.D.).',
    fullDescription: 'Reimburses 100% non-refundable compulsory fees charged by recognized colleges/universities and provides monthly academic maintenance allowance directly into the student’s bank account through DBT.',
    eligibilityRules: {
      requiresStudent: true,
      allowedCastes: ['SC', 'ST', 'OBC'],
      maxIncome: 250000
    },
    keyBenefits: [
      '100% reimbursement of tuition fees, library, sports & exam fees',
      'Annual maintenance allowance up to ₹13,500 for hostellers & ₹7,000 for day scholars',
      'Book bank allowance and thesis typing charges for professional/technical degree students',
      'Direct DBT transfer with zero deduction'
    ],
    requiredDocuments: ['Caste Certificate issued by competent authority (SDM/Tehsildar)', 'Valid Annual Income Certificate (< ₹2.5 Lakh)', 'Class 10 / Previous year marksheet', 'College Fee Receipt & Bonafide Certificate', 'Student’s Aadhaar-seeded bank account'],
    officialPortalUrl: 'https://scholarships.gov.in',
    helplineNumber: '0120-6619540',
    isCscAvailable: true,
    howToApplySteps: [
      'Register on National Scholarship Portal (NSP) or State Scholarship Portal using Student Aadhaar.',
      'Upload caste, income, and admission bonafide certificate.',
      'College nodal officer verifies details -> State Directorate releases scholarship directly to student.'
    ],
    commonRejectionReasons: [
      'Income Certificate expired or exceeded ₹2,50,000 ceiling',
      'Caste Certificate not in candidate’s own name (parent’s certificate used without candidate linkage)',
      'Bank account not seeded with Aadhaar in NPCI mapping'
    ],
    tag: 'High Impact'
  },
  {
    id: 'pragati-scholarship-girls',
    name: 'AICTE Pragati Scholarship Scheme for Girl Students',
    hindiName: 'प्रगति छात्रवृत्ति योजना (बालिकाओं के लिए)',
    acronym: 'Pragati',
    ministry: 'Ministry of Education (AICTE)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Education & Scholarships',
    benefitType: 'Scholarship & Fee Waiver',
    estimatedAnnualValue: 50000,
    valueDisplay: '₹50,000 / year for every year of Technical Degree/Diploma Study',
    summary: 'Scholarship of ₹50,000 per year for meritorious girl students admitted to AICTE approved Technical Degree or Diploma institutions.',
    fullDescription: 'Empowers young women to pursue technical education (B.Tech, B.E., B.Arch, Polytechnic Diploma). Provides ₹50,000 per annum for tuition fees, computer purchase, books, stationery, and equipment for up to 4 years of degree study.',
    eligibilityRules: {
      allowedGenders: ['Female'],
      requiresStudent: true,
      maxIncome: 800000
    },
    keyBenefits: [
      '₹50,000 per annum paid directly to student’s bank account for up to 4 years',
      'Can be used for college tuition, laptop purchase, exam fees, and hostel fees',
      'Maximum 2 girl children per family eligible',
      'No state quota limitation'
    ],
    requiredDocuments: ['AICTE College Admission Proof & Fee Receipt', 'Class 10 & 12 Marksheets', 'Annual Family Income Certificate (< ₹8 Lakh)', 'Aadhaar Card', 'Parent declaration (maximum 2 girl children)'],
    officialPortalUrl: 'https://scholarships.gov.in',
    helplineNumber: '011-29581333',
    isCscAvailable: false,
    howToApplySteps: [
      'Secure admission in 1st year Degree/Diploma course at an AICTE approved college.',
      'Register on National Scholarship Portal (NSP) under AICTE Pragati Scheme.',
      'College head digitally validates application on portal.'
    ],
    commonRejectionReasons: [
      'College or course not approved by AICTE',
      'Family income exceeds ₹8,00,000 per annum',
      'Admission gained through management / NRI quota rather than centralized counselling'
    ],
    tag: 'Women Centric'
  },
  {
    id: 'mudra-yojana',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    hindiName: 'प्रधानमंत्री मुद्रा योजना',
    acronym: 'PMMY',
    ministry: 'Ministry of Finance (DFS)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Financial & Livelihoods',
    benefitType: 'Subsidized Loan / Capital',
    estimatedAnnualValue: 12000,
    loanSubsidyValue: 'Collateral-free business loan up to ₹20 Lakh (Shishu: ₹50k, Kishore: ₹5L, Tarun: ₹10L-20L)',
    valueDisplay: 'Collateral-Free Micro Enterprise Loan up to ₹20,00,000 with Zero Processing Fee',
    summary: 'Refinancing support for micro and small enterprises, shops, service units, food processing, and rural non-farm enterprises without requiring collateral security.',
    fullDescription: 'Offers 3 tiers: Shishu (up to ₹50,000 for start-ups), Kishore (₹50,001 to ₹5,00,000 for established units), and Tarun / Tarun Plus (₹5,00,001 up to ₹20,00,000 for expanding units). Requires no mortgage or collateral.',
    eligibilityRules: {
      minAge: 18,
      requiredOccupations: [
        'Small Business Owner / MSME',
        'Traditional Artisan / Craftsperson',
        'Women Entrepreneur / SHG Member',
        'Street Vendor',
        'Unemployed Youth'
      ]
    },
    keyBenefits: [
      'Zero collateral or third-party guarantor required',
      'Zero loan processing fee for Shishu and Kishore category loans',
      'MUDRA Debit Card provided for easy working capital withdrawal',
      'Repayment tenure flexible from 3 to 7 years'
    ],
    requiredDocuments: ['Aadhaar Card & PAN Card', 'Business address proof & quotation of machinery/inventory to purchase', 'Bank account statement for past 6 months', 'Passport size photos'],
    officialPortalUrl: 'https://www.udyamimitra.in',
    helplineNumber: '18001801111',
    isCscAvailable: true,
    howToApplySteps: [
      'Apply online at udyamimitra.in or visit any commercial bank, Regional Rural Bank (RRB), or NBFC.',
      'Submit business proposal and machinery quotation with Shishu/Kishore application form.',
      'Bank sanctions loan and issues MUDRA RuPay debit card.'
    ],
    commonRejectionReasons: [
      'Negative CIBIL credit score or past willful loan default',
      'Applying for agricultural farming purpose (MUDRA is strictly for non-farm enterprises)'
    ],
    tag: 'High Impact'
  },
  {
    id: 'nrlm-shg-livelihood',
    name: 'Deendayal Antyodaya Yojana - NRLM Women Self-Help Group (SHG)',
    hindiName: 'दीनदयाल अंत्योदय योजना - राष्ट्रीय ग्रामीण आजीविका मिशन',
    acronym: 'DAY-NRLM',
    ministry: 'Ministry of Rural Development',
    level: 'Central',
    applicableStates: 'All',
    category: 'Women & Child Welfare',
    benefitType: 'Subsidized Loan / Capital',
    estimatedAnnualValue: 20000,
    oneTimeGrantValue: 15000,
    loanSubsidyValue: 'Collateral-free credit linkage up to ₹10 Lakh @ sub-vented 7% interest rate',
    valueDisplay: '₹15,000 Revolving Fund + ₹1.5 Lakh Community Fund + ₹10 Lakh Bank Loan @ 7%',
    summary: 'Mobilizes rural women into Self-Help Groups (SHGs) to build community savings, micro-enterprises, poultry/dairy, and access low-interest institutional bank credit.',
    fullDescription: 'Each registered women SHG receives ₹15,000 Revolving Fund (RF), ₹1.5 Lakh Community Investment Fund (CIF), and priority collateral-free bank loans up to ₹10-20 Lakhs with 3% interest subvention for timely repayment (effective 4-7% interest).',
    eligibilityRules: {
      allowedGenders: ['Female'],
      ruralOnly: true,
      requiresShg: true,
      minAge: 18
    },
    keyBenefits: [
      '₹15,000 non-refundable Revolving Fund grant per SHG',
      'Collateral-free bank loan up to ₹10 Lakhs with interest subvention',
      'Access to PM Micro Food Processing Enterprises (PMFME) seed capital of ₹40,000 per member',
      'Skill training for Lakhpati Didi rural enterprise development'
    ],
    requiredDocuments: ['SHG Resolution & Bank Passbook', 'Aadhaar of all member women', 'Village Organization / Gram Panchayat certificate'],
    officialPortalUrl: 'https://nrlm.gov.in',
    helplineNumber: '011-23384707',
    isCscAvailable: true,
    howToApplySteps: [
      'Form or join a 10-15 women Self-Help Group in your village.',
      'Open savings bank account and maintain weekly thrift savings for 3 months.',
      'Gram Panchayat Cluster Coordinator (CC) conducts grading and releases Revolving Fund & Bank credit.'
    ],
    commonRejectionReasons: [
      'Irregular weekly meetings and lack of updated panchasutra bookkeeping',
      'Multiple members from the exact same nuclear family in one SHG'
    ],
    tag: 'Women Centric'
  },
  {
    id: 'ign-old-age-pension',
    name: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    hindiName: 'इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना',
    acronym: 'IGNOAPS',
    ministry: 'Ministry of Rural Development (NSAP)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Social Security & Pensions',
    benefitType: 'Monthly Pension',
    estimatedAnnualValue: 12000,
    valueDisplay: '₹1,000 to ₹2,500 / month direct pension (Central + State pooled DBT)',
    summary: 'Monthly social security pension for destitute senior citizens aged 60 and above belonging to below poverty line (BPL) households.',
    fullDescription: 'Senior citizens aged 60-79 receive monthly pension (central share + state contribution, ranging from ₹1,000 to ₹2,500 depending on state). For seniors aged 80+, enhanced pension is provided directly to bank account.',
    eligibilityRules: {
      minAge: 60,
      requireBpl: true,
      maxIncome: 120000
    },
    keyBenefits: [
      'Assured monthly pension directly credited every month to bank or post office account',
      'Enhanced payout for senior citizens reaching 80+ years of age',
      'No fees or charges for enrollment',
      'Free medical checkup benefits bundled under state elder-care programs'
    ],
    requiredDocuments: ['Aadhaar Card', 'Age Proof (Voter ID / Birth Certificate / Medical Board Certificate)', 'BPL Ration Card / BPL Certificate', 'Aadhaar-seeded Bank Passbook'],
    officialPortalUrl: 'https://nsap.nic.in',
    helplineNumber: '18001801551',
    isCscAvailable: true,
    howToApplySteps: [
      'Submit application at local Gram Panchayat, Block Development Office (BDO), or Urban Municipality.',
      'Village Revenue Officer (VRO) / Tehsildar verifies BPL and age credentials.',
      'Sanction letter issued; monthly pension starts crediting automatically via DBT.'
    ],
    commonRejectionReasons: [
      'Applicant does not possess valid BPL card or SECC poverty certificate',
      'Age verified by medical board is under 60 years',
      'Adult sons earning high income living in same joint household'
    ],
    tag: 'Popular'
  },
  {
    id: 'disability-adip-aid',
    name: 'ADIP Scheme - Assistance to Disabled Persons for Purchase of Aids & Appliances',
    hindiName: 'दिव्यांगजन सहायक उपकरण योजना (ADIP)',
    acronym: 'ADIP',
    ministry: 'Ministry of Social Justice and Empowerment (DEPwD)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Social Security & Pensions',
    benefitType: 'Asset / In-Kind Grant',
    estimatedAnnualValue: 25000,
    oneTimeGrantValue: 40000,
    valueDisplay: '100% Free Motorized Tricycles, Wheelchairs, Digital Hearing Aids & Smart Canes',
    summary: 'Provides high-quality modern assistive devices, motorized tricycles, prosthetic limbs, hearing aids, and smart walking devices to persons with disabilities (Divyangjan) free of cost.',
    fullDescription: 'Persons with 40% or higher certified disability and monthly income up to ₹22,500 receive 100% free aids and appliances (e.g. motorized tricycles worth ₹42,000, digital programmable hearing aids, braille kits, artificial limbs from ALIMCO).',
    eligibilityRules: {
      requiresDisability: true,
      minDisabilityPercentage: 40,
      maxIncome: 270000
    },
    keyBenefits: [
      '100% free motorized tricycles, active wheelchairs, and battery-powered mobility aids',
      'Digital hearing aids, cochlear implant support for children up to 5 years',
      'Daisy audio players, smart canes, braille laptops for visually impaired',
      'Free replacement and servicing of appliances every 3 years'
    ],
    requiredDocuments: ['UDID (Unique Disability ID) Card or Disability Certificate (min 40%)', 'Income Certificate (family income < ₹22,500/month)', 'Aadhaar Card', 'Passport size photo showing disability'],
    officialPortalUrl: 'https://adip.depwd.gov.in',
    helplineNumber: '18001805129',
    isCscAvailable: true,
    howToApplySteps: [
      'Apply online on adip.depwd.gov.in or attend local ALIMCO / District Social Welfare Camp.',
      'Present UDID Card and income certificate for device prescription by orthopedic/audiology specialist.',
      'Collect customized motorized tricycle or assistive aid during distribution camp.'
    ],
    commonRejectionReasons: [
      'Disability percentage certified below 40%',
      'Applicant received similar government aid within past 3 years',
      'Monthly income exceeds ₹22,500'
    ],
    tag: 'High Impact'
  },
  {
    id: 'pm-kusum-solar-pump',
    name: 'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)',
    hindiName: 'पीएम कुसुम योजना - सोलर पंप सब्सिडी',
    acronym: 'PM-KUSUM',
    ministry: 'Ministry of New and Renewable Energy (MNRE)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Agriculture & Farmers',
    benefitType: 'Subsidy & Price Support',
    estimatedAnnualValue: 30000,
    oneTimeGrantValue: 150000,
    valueDisplay: 'Up to 60% Govt Subsidy + 30% Bank Loan for Standalone Solar Agricultural Pumps',
    summary: 'Subsidizes standalone solar pumps for irrigation in off-grid rural areas, eliminating diesel pump expenses and generating surplus solar income.',
    fullDescription: 'Farmers pay only 10% of the total cost for installing 3HP to 7.5HP standalone DC/AC solar pumps. 60% is paid as subsidy (30% Central + 30% State Govt) and 30% through bank loan. Saves ₹30,000-50,000/year on diesel/electricity bills.',
    eligibilityRules: {
      requiredOccupations: ['Farmer', 'Small / Marginal Farmer'],
      minLandholdingAcres: 0.5
    },
    keyBenefits: [
      'Up to 60% direct government capital subsidy on solar water pump',
      'Eliminates heavy diesel recurring expenditure for irrigation',
      'Assured daytime irrigation without reliance on irregular rural grid electricity',
      'Option to sell surplus solar power back to DISCOM grid'
    ],
    requiredDocuments: ['Aadhaar Card', 'Land 7/12 & 8A / Khatauni Record', 'Bank Passbook', 'Electricity DISCOM non-connection declaration (for off-grid)'],
    officialPortalUrl: 'https://pmkusum.mnre.gov.in',
    helplineNumber: '18001803333',
    isCscAvailable: true,
    howToApplySteps: [
      'Register on state renewable energy agency portal (e.g. UPNEDA, MEDA, RRECL) or pmkusum.mnre.gov.in.',
      'Select pump capacity (3HP, 5HP, or 7.5HP) and make 10% farmer share payment.',
      'Approved empanelled vendor installs solar pump and commissioning certificate is issued.'
    ],
    commonRejectionReasons: [
      'Existing grid-connected electrified pump on the same borewell without solarization application',
      'Landholding documents not clear or disputed'
    ],
    tag: 'Popular'
  },
  {
    id: 'pm-suraksha-bima',
    name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    hindiName: 'प्रधानमंत्री सुरक्षा बीमा योजना',
    acronym: 'PMSBY',
    ministry: 'Ministry of Finance (DFS)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Health & Insurance',
    benefitType: 'Insurance Cover',
    estimatedAnnualValue: 0,
    insuranceCoverValue: 200000,
    valueDisplay: '₹2,00,000 Accidental Death & Full Disability Cover for just ₹20 / year premium',
    summary: 'Ultra-affordable government accidental death and disability insurance policy for all bank account holders aged 18 to 70 years.',
    fullDescription: 'For an annual premium of just ₹20 auto-debited once a year in May/June, provides ₹2,00,000 cover for accidental death or permanent total disability and ₹1,00,000 for permanent partial disability.',
    eligibilityRules: {
      minAge: 18,
      maxAge: 70
    },
    keyBenefits: [
      '₹2 Lakh death cover due to road, train, snake bite, drowning or work accident',
      '₹2 Lakh for irreversible loss of both eyes or both hands/feet',
      '₹1 Lakh for loss of sight in one eye or loss of one hand/foot',
      'Premium of just ₹20 per year (less than ₹2 per month)'
    ],
    requiredDocuments: ['Savings Bank Account with active Aadhaar seed', 'Nominee Aadhaar & details'],
    officialPortalUrl: 'https://www.jansuraksha.gov.in',
    helplineNumber: '18001801111',
    isCscAvailable: true,
    howToApplySteps: [
      'Enable PMSBY via NetBanking/Mobile Banking or submit 1-page form at your savings bank branch.',
      'Provide nominee name and consent for annual ₹20 auto-debit.',
      'Policy certificate is generated instantly with bank seal.'
    ],
    commonRejectionReasons: [
      'Insufficient bank balance on annual auto-debit renewal date (May 31)',
      'Multiple policies taken across multiple banks (only one claim is payable across all banks)'
    ],
    tag: 'Flagship'
  },
  {
    id: 'pm-jeevan-jyoti',
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    hindiName: 'प्रधानमंत्री जीवन ज्योति बीमा योजना',
    acronym: 'PMJJBY',
    ministry: 'Ministry of Finance (DFS)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Health & Insurance',
    benefitType: 'Insurance Cover',
    estimatedAnnualValue: 0,
    insuranceCoverValue: 200000,
    valueDisplay: '₹2,00,000 Pure Term Life Insurance Cover for ₹436 / year for any cause of death',
    summary: 'One-year renewable life insurance scheme offering ₹2 Lakh coverage for death due to any reason (natural illness, disease, or accident).',
    fullDescription: 'Affordable term life insurance for bank/post office account holders aged 18 to 50 years. For ₹436 per year, pays ₹2,00,000 to the nominee in case of death of the insured person due to any reason.',
    eligibilityRules: {
      minAge: 18,
      maxAge: 50
    },
    keyBenefits: [
      '₹2 Lakh direct lump-sum payout to family nominee on death due to any cause',
      'Covers natural death, medical illnesses, heart attack, infections, and accidents',
      'Simple auto-debit from savings bank account without any complex medical checkup',
      'Risk coverage valid up to age 55 provided premium is paid annually'
    ],
    requiredDocuments: ['Savings Bank Account', 'Aadhaar Card', 'Self-declaration of good health', 'Nominee Details'],
    officialPortalUrl: 'https://www.jansuraksha.gov.in',
    helplineNumber: '18001801111',
    isCscAvailable: true,
    howToApplySteps: [
      'Opt-in via Mobile Banking or fill consent-cum-declaration form at your bank branch.',
      'Ensure ₹436 is available in bank account for auto-debit.',
      'Confirmation SMS and policy certificate issued.'
    ],
    commonRejectionReasons: [
      'Age exceeds 50 years at time of fresh enrollment',
      'Lien clause: Death within initial 30 days of policy start (except accidental death)'
    ],
    tag: 'Popular'
  },
  {
    id: 'national-means-merit-scholarship',
    name: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
    hindiName: 'राष्ट्रीय आय-सह-मेधा छात्रवृत्ति योजना',
    acronym: 'NMMSS',
    ministry: 'Department of School Education & Literacy (Ministry of Education)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Education & Scholarships',
    benefitType: 'Scholarship & Fee Waiver',
    estimatedAnnualValue: 12000,
    valueDisplay: '₹12,000 / year (₹1,000/month) for Class 9 to Class 12 studies',
    summary: 'Prevents school dropouts after Class 8 by awarding scholarships to meritorious economically weaker students for continuing secondary and higher secondary education.',
    fullDescription: 'Students selected through a state-level competitive examination in Class 8 receive ₹12,000 per annum (₹48,000 total over 4 years) across Classes 9, 10, 11, and 12 in recognized government/aided schools.',
    eligibilityRules: {
      requiresStudent: true,
      maxIncome: 350000
    },
    keyBenefits: [
      '₹1,000 per month (₹12,000/year) directly transferred into student’s bank account',
      'Continuous 4-year financial support from Class 9 up to Class 12 completion',
      'Stops school dropout rates in economically vulnerable rural households'
    ],
    requiredDocuments: ['Class 7 & 8 Marksheets (min 55% marks)', 'Parental Income Certificate (< ₹3.5 Lakh)', 'School Bonafide Certificate', 'Student’s Aadhaar-seeded Bank Account'],
    officialPortalUrl: 'https://scholarships.gov.in',
    helplineNumber: '0120-6619540',
    isCscAvailable: false,
    howToApplySteps: [
      'Appear for State Level NMMSS Selection Test in Class 8.',
      'Qualified students register on National Scholarship Portal (scholarships.gov.in).',
      'School principal verifies application -> Annual scholarship credited via PFMS DBT.'
    ],
    commonRejectionReasons: [
      'Studying in private unaided schools or Navodaya/KVS schools (scheme is for Govt/aided schools)',
      'Failure to score minimum 55% marks in Class 9 or 11 for scholarship renewal'
    ],
    tag: 'Popular'
  },
  {
    id: 'pm-swachh-bharat-toilet',
    name: 'Swachh Bharat Mission (Grameen) - Individual Household Latrine Grant',
    hindiName: 'स्वच्छ भारत मिशन (ग्रामीण) - शौचालय निर्माण प्रोत्साहन राशि',
    acronym: 'SBM-G',
    ministry: 'Ministry of Jal Shakti (Department of Drinking Water & Sanitation)',
    level: 'Central',
    applicableStates: 'All',
    category: 'Housing & Sanitation',
    benefitType: 'Asset / In-Kind Grant',
    estimatedAnnualValue: 0,
    oneTimeGrantValue: 12000,
    valueDisplay: '₹12,000 100% Cash Incentive for constructing individual hygienic toilet',
    summary: 'Direct incentive of ₹12,000 provided to rural BPL/APL vulnerable households to construct an individual household latrine (IHHL) with twin-pit soak technology.',
    fullDescription: 'Incentive of ₹12,000 (Central share ₹7,200 + State share ₹4,800) transferred directly to beneficiary bank account after geotagged photo verification of newly constructed twin-pit toilet.',
    eligibilityRules: {
      ruralOnly: true,
      maxIncome: 200000
    },
    keyBenefits: [
      '₹12,000 direct cash reimbursement into beneficiary’s bank account',
      'Assistance in constructing eco-friendly twin-pit toilet',
      'Ensures dignity, privacy, and health safety for women and children'
    ],
    requiredDocuments: ['Aadhaar Card', 'Ration Card', 'Bank Passbook', 'Photograph of beneficiary standing near newly built toilet'],
    officialPortalUrl: 'https://sbm.gov.in/sbmphase2/Secure/User/IHHLRegistration.aspx',
    helplineNumber: '18001800404',
    isCscAvailable: true,
    howToApplySteps: [
      'Apply online on sbm.gov.in Citizen Corner or submit through Gram Panchayat Swachhata Dooth.',
      'Construct twin-pit toilet as per official engineering guidelines.',
      'Gram Panchayat geotags the toilet -> ₹12,000 released via DBT.'
    ],
    commonRejectionReasons: [
      'Household already has an existing functional toilet registered in baseline survey',
      'Photo geotag coordinates do not match the applicant’s village boundary'
    ],
    tag: 'Popular'
  }
];

// Sample realistic personas for instant citizen testing
export const SAMPLE_PERSONAS: PersonaPreset[] = [
  {
    id: 'ramesh-farmer',
    label: 'Ramesh Kumar (Small Farmer)',
    role: 'Small Farmer with 2 Acres land & 2 Daughters',
    avatar: '👨‍🌾',
    location: 'Varanasi, Uttar Pradesh',
    profile: {
      id: 'ramesh-01',
      fullName: 'Ramesh Kumar',
      age: 44,
      gender: 'Male',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      area: 'Rural',
      casteCategory: 'OBC',
      maritalStatus: 'Married',
      annualHouseholdIncome: 110000,
      rationCard: 'BPL_PHH',
      isBPL: true,
      landholdingAcres: 2.1,
      housingType: 'Semi-Pucca',
      hasLPGConnection: false,
      hasPuccaToilet: false,
      hasElectricity: true,
      hasBankDBTEnabled: true,
      occupation: 'Small / Marginal Farmer',
      hasEshramCard: false,
      hasKisanCreditCard: false,
      isShgMember: false,
      isDifferentlyAbled: false,
      isExServiceman: false,
      isSingleMotherOrWidow: false,
      isStudent: false,
      claimedSchemeIds: ['pm-jay'], // Only PM-JAY active, missing PM-Kisan, KCC, PMUY, SBM, SSY!
      familyMembers: [
        {
          id: 'fam-1',
          name: 'Sunita Devi',
          relationship: 'Spouse',
          age: 40,
          gender: 'Female',
          occupation: 'Homemaker'
        },
        {
          id: 'fam-2',
          name: 'Priya Kumar',
          relationship: 'Daughter',
          age: 7,
          gender: 'Female',
          occupation: 'Student / Youth',
          isStudent: true,
          educationLevel: 'School (1-8)'
        },
        {
          id: 'fam-3',
          name: 'Anjali Kumar',
          relationship: 'Daughter',
          age: 14,
          gender: 'Female',
          occupation: 'Student / Youth',
          isStudent: true,
          educationLevel: 'Secondary (9-10)'
        }
      ]
    }
  },
  {
    id: 'fatima-vendor',
    label: 'Fatima Begum (Urban Street Vendor)',
    role: 'Fruit Cart Vendor in Urban Slum',
    avatar: '🛒',
    location: 'Hyderabad, Telangana',
    profile: {
      id: 'fatima-02',
      fullName: 'Fatima Begum',
      age: 36,
      gender: 'Female',
      state: 'Telangana',
      district: 'Hyderabad',
      area: 'Urban',
      casteCategory: 'MINORITY',
      maritalStatus: 'Widowed',
      annualHouseholdIncome: 85000,
      rationCard: 'BPL_PHH',
      isBPL: true,
      landholdingAcres: 0,
      housingType: 'Rented',
      hasLPGConnection: true,
      hasPuccaToilet: true,
      hasElectricity: true,
      hasBankDBTEnabled: true,
      occupation: 'Street Vendor',
      specificTrade: 'Fruit & Vegetable Vending',
      hasEshramCard: false,
      hasKisanCreditCard: false,
      isShgMember: true,
      isDifferentlyAbled: false,
      isExServiceman: false,
      isSingleMotherOrWidow: true,
      isStudent: false,
      claimedSchemeIds: [], // 0 schemes claimed! Massive missed benefits!
      familyMembers: [
        {
          id: 'fam-4',
          name: 'Arif',
          relationship: 'Son',
          age: 12,
          gender: 'Male',
          occupation: 'Student / Youth',
          isStudent: true,
          educationLevel: 'School (1-8)'
        }
      ]
    }
  },
  {
    id: 'pooja-student',
    label: 'Pooja Sharma (B.Tech College Student)',
    role: 'Girl Student from Rural Low-Income Family',
    avatar: '🎓',
    location: 'Jaipur, Rajasthan',
    profile: {
      id: 'pooja-03',
      fullName: 'Pooja Sharma',
      age: 19,
      gender: 'Female',
      state: 'Rajasthan',
      district: 'Jaipur',
      area: 'Rural',
      casteCategory: 'EWS',
      maritalStatus: 'Single',
      annualHouseholdIncome: 160000,
      rationCard: 'APL_NPHH',
      isBPL: false,
      landholdingAcres: 0.5,
      housingType: 'Pucca',
      hasLPGConnection: true,
      hasPuccaToilet: true,
      hasElectricity: true,
      hasBankDBTEnabled: true,
      occupation: 'Student / Youth',
      isStudent: true,
      educationLevel: 'Undergraduate',
      academicScorePercentage: 88,
      hasEshramCard: false,
      hasKisanCreditCard: false,
      isShgMember: false,
      isDifferentlyAbled: false,
      isExServiceman: false,
      isSingleMotherOrWidow: false,
      claimedSchemeIds: [],
      familyMembers: [
        {
          id: 'fam-5',
          name: 'Brijesh Sharma',
          relationship: 'Father',
          age: 52,
          gender: 'Male',
          occupation: 'Private Sector Employee'
        }
      ]
    }
  },
  {
    id: 'muthu-artisan',
    label: 'Muthuvel K. (Traditional Carpenter & Artisan)',
    role: 'Traditional Woodcraft Artisan in Rural Village',
    avatar: '🪚',
    location: 'Thanjavur, Tamil Nadu',
    profile: {
      id: 'muthu-04',
      fullName: 'Muthuvel Karuppan',
      age: 48,
      gender: 'Male',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      area: 'Rural',
      casteCategory: 'OBC',
      maritalStatus: 'Married',
      annualHouseholdIncome: 130000,
      rationCard: 'BPL_PHH',
      isBPL: true,
      landholdingAcres: 0,
      housingType: 'Kutcha',
      hasLPGConnection: false,
      hasPuccaToilet: false,
      hasElectricity: true,
      hasBankDBTEnabled: false,
      occupation: 'Traditional Artisan / Craftsperson',
      specificTrade: 'Carpenter / Wood Carver',
      hasEshramCard: false,
      hasKisanCreditCard: false,
      isShgMember: false,
      isDifferentlyAbled: false,
      isExServiceman: false,
      isSingleMotherOrWidow: false,
      isStudent: false,
      claimedSchemeIds: [],
      familyMembers: [
        {
          id: 'fam-6',
          name: 'Meenakshi',
          relationship: 'Spouse',
          age: 43,
          gender: 'Female',
          occupation: 'Homemaker'
        }
      ]
    }
  },
  {
    id: 'shanti-senior',
    label: 'Shanti Devi (Elderly Widow & PwD)',
    role: '67yo Senior Widow with 50% Locomotor Disability',
    avatar: '👵',
    location: 'Patna, Bihar',
    profile: {
      id: 'shanti-05',
      fullName: 'Shanti Devi',
      age: 67,
      gender: 'Female',
      state: 'Bihar',
      district: 'Patna',
      area: 'Rural',
      casteCategory: 'SC',
      maritalStatus: 'Widowed',
      annualHouseholdIncome: 45000,
      rationCard: 'AAY', // Antyodaya Anna Yojana (Poorest of poor)
      isBPL: true,
      landholdingAcres: 0,
      housingType: 'Kutcha',
      hasLPGConnection: false,
      hasPuccaToilet: false,
      hasElectricity: false,
      hasBankDBTEnabled: true,
      occupation: 'Senior Citizen / Retired',
      isDifferentlyAbled: true,
      disabilityPercentage: 50,
      isExServiceman: false,
      isSingleMotherOrWidow: true,
      isStudent: false,
      hasEshramCard: false,
      hasKisanCreditCard: false,
      isShgMember: false,
      claimedSchemeIds: [],
      familyMembers: []
    }
  }
];

export const INDIAN_STATES: string[] = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi NCR', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];
