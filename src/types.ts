export type CasteCategory = 'GENERAL' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'MINORITY';

export type Gender = 'Male' | 'Female' | 'Transgender' | 'Other';

export type MaritalStatus = 'Single' | 'Married' | 'Widowed' | 'Divorced' | 'Deserted';

export type AreaType = 'Rural' | 'Urban' | 'Semi-Urban';

export type RationCardType = 'NONE' | 'AAY' | 'BPL_PHH' | 'APL_NPHH';

export type HousingType = 'Kutcha' | 'Pucca' | 'Semi-Pucca' | 'Homeless' | 'Rented';

export type OccupationType =
  | 'Farmer'
  | 'Small / Marginal Farmer'
  | 'Agricultural Labourer'
  | 'Street Vendor'
  | 'Traditional Artisan / Craftsperson'
  | 'Construction Worker'
  | 'Gig / Platform / Domestic Worker'
  | 'Student / Youth'
  | 'Women Entrepreneur / SHG Member'
  | 'Unemployed Youth'
  | 'Senior Citizen / Retired'
  | 'Private Sector Employee'
  | 'Small Business Owner / MSME'
  | 'Homemaker'
  | 'Other';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Spouse' | 'Daughter' | 'Son' | 'Mother' | 'Father' | 'Sibling' | 'Other Dependent';
  age: number;
  gender: Gender;
  occupation: OccupationType;
  isStudent?: boolean;
  educationLevel?: string;
  isPregnantOrLactating?: boolean;
  hasDisability?: boolean;
  disabilityPercentage?: number;
}

export interface CitizenProfile {
  id: string;
  fullName: string;
  age: number;
  gender: Gender;
  state: string;
  district: string;
  area: AreaType;
  casteCategory: CasteCategory;
  maritalStatus: MaritalStatus;
  
  // Socioeconomic
  annualHouseholdIncome: number; // in INR
  rationCard: RationCardType;
  isBPL: boolean;
  landholdingAcres: number;
  housingType: HousingType;
  hasLPGConnection: boolean;
  hasPuccaToilet: boolean;
  hasElectricity: boolean;
  hasBankDBTEnabled: boolean;
  
  // Occupation & Work
  occupation: OccupationType;
  specificTrade?: string; // for artisans / street vendors
  hasEshramCard: boolean;
  hasKisanCreditCard: boolean;
  isShgMember: boolean;
  
  // Disability & Vulnerability
  isDifferentlyAbled: boolean;
  disabilityPercentage?: number;
  isExServiceman: boolean;
  isSingleMotherOrWidow: boolean;
  
  // Student Specific (if applicable)
  isStudent: boolean;
  educationLevel?: 'School (1-8)' | 'Secondary (9-10)' | 'Higher Secondary (11-12)' | 'Diploma/Polytechnic' | 'Undergraduate' | 'Postgraduate' | 'Doctoral / Professional';
  academicScorePercentage?: number;
  
  // Active benefits already being received
  claimedSchemeIds: string[];
  
  // Family Members
  familyMembers: FamilyMember[];
}

export type SchemeCategory =
  | 'Health & Insurance'
  | 'Agriculture & Farmers'
  | 'Housing & Sanitation'
  | 'Financial & Livelihoods'
  | 'Education & Scholarships'
  | 'Women & Child Welfare'
  | 'Social Security & Pensions'
  | 'Skill & Entrepreneurship';

export type BenefitType =
  | 'Direct Cash Transfer'
  | 'Insurance Cover'
  | 'Subsidized Loan / Capital'
  | 'Monthly Pension'
  | 'Asset / In-Kind Grant'
  | 'Scholarship & Fee Waiver'
  | 'Subsidy & Price Support';

export interface SchemeRuleCriteria {
  minAge?: number;
  maxAge?: number;
  allowedGenders?: Gender[];
  allowedCastes?: CasteCategory[];
  maxIncome?: number;
  allowedRationCards?: RationCardType[];
  requireBpl?: boolean;
  requiredOccupations?: OccupationType[];
  maxLandholdingAcres?: number;
  minLandholdingAcres?: number;
  ruralOnly?: boolean;
  urbanOnly?: boolean;
  requiresDisability?: boolean;
  minDisabilityPercentage?: number;
  requiresStudent?: boolean;
  requiresEshram?: boolean;
  requiresKcc?: boolean;
  requiresShg?: boolean;
  requiresKutchaHouse?: boolean;
  requiresNoLPG?: boolean;
  requiresGirlChild?: boolean;
  requiresPregnantOrLactating?: boolean;
  requiresWidowOrSingleMother?: boolean;
  allowedStates?: string[]; // 'All' or specific states
}

export interface GovernmentScheme {
  id: string;
  name: string;
  hindiName?: string;
  acronym?: string;
  ministry: string;
  level: 'Central' | 'State';
  applicableStates: string[] | 'All';
  category: SchemeCategory;
  benefitType: BenefitType;
  
  // Quantifiable Value
  estimatedAnnualValue: number; // in INR / year (or cash equivalent)
  valueDisplay: string; // e.g. "₹6,000 / year (Direct DBT in 3 installments)"
  oneTimeGrantValue?: number;
  insuranceCoverValue?: number;
  loanSubsidyValue?: string;
  
  summary: string;
  fullDescription: string;
  eligibilityRules: SchemeRuleCriteria;
  
  keyBenefits: string[];
  requiredDocuments: string[];
  officialPortalUrl: string;
  helplineNumber: string;
  isCscAvailable: boolean;
  howToApplySteps: string[];
  commonRejectionReasons: string[];
  tag?: 'Flagship' | 'High Impact' | 'Popular' | 'Urgent Deadline' | 'Women Centric';
}

export type EvaluationStatus = 'ELIGIBLE_UNCLAIMED' | 'ALREADY_RECEIVING' | 'PARTIALLY_ELIGIBLE' | 'INELIGIBLE';

export interface EvaluationResult {
  scheme: GovernmentScheme;
  status: EvaluationStatus;
  matchScore: number; // 0 to 100
  matchingCriteria: string[];
  missingCriteria: string[];
  actionToUnlock?: string;
  potentialAnnualGain: number;
  estimatedTimeToApproval: string;
  priority: 'HIGH_URGENCY' | 'MEDIUM' | 'RECOMMENDED';
  familyMemberBeneficiary?: string; // if unlocked for daughter, spouse, etc.
}

export interface MissedBenefitAudit {
  totalUnclaimedAnnualValue: number;
  totalUnclaimedInsuranceCover: number;
  totalOneTimeGrantsMissed: number;
  eligibleSchemeCount: number;
  missedSchemeCount: number;
  alreadyClaimedSchemeCount: number;
  partiallyEligibleCount: number;
  
  missedSchemes: EvaluationResult[];
  claimedSchemes: EvaluationResult[];
  partialSchemes: EvaluationResult[];
  
  topActionableBlockers: {
    id: string;
    blockerName: string;
    unlocksSchemeNames: string[];
    potentialUnlockedValue: number;
    howToResolve: string;
    estimatedDays: string;
  }[];
  
  synergyBundles: {
    title: string;
    description: string;
    schemeNames: string[];
    combinedAnnualBenefit: string;
    icon: string;
  }[];
}

export interface PersonaPreset {
  id: string;
  label: string;
  role: string;
  avatar: string;
  location: string;
  profile: CitizenProfile;
}
