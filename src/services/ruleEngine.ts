import {
  CitizenProfile,
  GovernmentScheme,
  EvaluationResult,
  EvaluationStatus,
  MissedBenefitAudit,
  SchemeRuleCriteria
} from '../types';
import { ALL_SCHEMES } from '../data/schemesDatabase';

export function evaluateSchemeEligibility(
  profile: CitizenProfile,
  scheme: GovernmentScheme
): EvaluationResult {
  const rules: SchemeRuleCriteria = scheme.eligibilityRules;
  const isAlreadyClaimed = profile.claimedSchemeIds.includes(scheme.id);
  
  const matchingCriteria: string[] = [];
  const missingCriteria: string[] = [];
  let actionToUnlock: string | undefined;
  let familyMemberBeneficiary: string | undefined;

  let totalScorePoints = 0;
  let earnedScorePoints = 0;

  // 1. Age Rule
  if (rules.minAge !== undefined || rules.maxAge !== undefined) {
    totalScorePoints += 20;
    const min = rules.minAge ?? 0;
    const max = rules.maxAge ?? 120;
    if (profile.age >= min && profile.age <= max) {
      earnedScorePoints += 20;
      matchingCriteria.push(`Age (${profile.age} yrs) is within eligible range (${min}-${max} yrs)`);
    } else {
      missingCriteria.push(`Age is ${profile.age} yrs (requires ${min}-${max} yrs)`);
    }
  }

  // 2. Gender Rule
  if (rules.allowedGenders && rules.allowedGenders.length > 0) {
    totalScorePoints += 20;
    if (rules.allowedGenders.includes(profile.gender)) {
      earnedScorePoints += 20;
      matchingCriteria.push(`Gender (${profile.gender}) matches scheme criteria`);
    } else {
      // Check if any female family member is present for women centric scheme
      const femaleMember = profile.familyMembers.find(f => rules.allowedGenders?.includes(f.gender));
      if (femaleMember) {
        earnedScorePoints += 15;
        matchingCriteria.push(`Applicable through family member: ${femaleMember.name} (${femaleMember.relationship}, ${femaleMember.gender})`);
        familyMemberBeneficiary = `${femaleMember.name} (${femaleMember.relationship})`;
      } else {
        missingCriteria.push(`Scheme is specifically for: ${rules.allowedGenders.join(', ')}`);
      }
    }
  }

  // 3. Caste / Category Rule
  if (rules.allowedCastes && rules.allowedCastes.length > 0) {
    totalScorePoints += 20;
    if (rules.allowedCastes.includes(profile.casteCategory)) {
      earnedScorePoints += 20;
      matchingCriteria.push(`Social Category (${profile.casteCategory}) is eligible`);
    } else {
      missingCriteria.push(`Requires Category: ${rules.allowedCastes.join(', ')}`);
    }
  }

  // 4. Income Rule
  if (rules.maxIncome !== undefined) {
    totalScorePoints += 25;
    if (profile.annualHouseholdIncome <= rules.maxIncome) {
      earnedScorePoints += 25;
      matchingCriteria.push(`Household income (₹${profile.annualHouseholdIncome.toLocaleString()}/yr) is under ceiling of ₹${rules.maxIncome.toLocaleString()}`);
    } else {
      missingCriteria.push(`Household income exceeds ₹${rules.maxIncome.toLocaleString()} limit`);
    }
  }

  // 5. Ration Card & BPL Rule
  if (rules.allowedRationCards && rules.allowedRationCards.length > 0) {
    totalScorePoints += 15;
    if (rules.allowedRationCards.includes(profile.rationCard)) {
      earnedScorePoints += 15;
      matchingCriteria.push(`Ration Card (${profile.rationCard}) matches beneficiary criteria`);
    } else if (profile.isBPL) {
      earnedScorePoints += 10;
      matchingCriteria.push(`BPL Status qualifies under socio-economic criterion`);
    } else {
      missingCriteria.push(`Requires Ration Card type: ${rules.allowedRationCards.join(' or ')}`);
      if (!actionToUnlock) {
        actionToUnlock = 'Apply for NFSA / BPL Ration Card survey at local Food & Civil Supplies desk';
      }
    }
  }

  if (rules.requireBpl) {
    totalScorePoints += 15;
    if (profile.isBPL || profile.rationCard === 'AAY' || profile.rationCard === 'BPL_PHH') {
      earnedScorePoints += 15;
      matchingCriteria.push(`BPL status verified`);
    } else {
      missingCriteria.push(`Requires Below Poverty Line (BPL) or AAY certification`);
    }
  }

  // 6. Occupation Rule
  if (rules.requiredOccupations && rules.requiredOccupations.length > 0) {
    totalScorePoints += 30;
    if (rules.requiredOccupations.includes(profile.occupation)) {
      earnedScorePoints += 30;
      matchingCriteria.push(`Primary occupation (${profile.occupation}) is explicitly targeted`);
    } else {
      // Check family members
      const matchingFam = profile.familyMembers.find(f => rules.requiredOccupations?.includes(f.occupation));
      if (matchingFam) {
        earnedScorePoints += 25;
        matchingCriteria.push(`Family member qualifies: ${matchingFam.name} (${matchingFam.occupation})`);
        familyMemberBeneficiary = `${matchingFam.name} (${matchingFam.relationship})`;
      } else {
        missingCriteria.push(`Requires occupation: ${rules.requiredOccupations.join(', ')}`);
      }
    }
  }

  // 7. Landholding Rule
  if (rules.maxLandholdingAcres !== undefined) {
    totalScorePoints += 15;
    if (profile.landholdingAcres <= rules.maxLandholdingAcres && profile.landholdingAcres > 0) {
      earnedScorePoints += 15;
      matchingCriteria.push(`Agricultural landholding (${profile.landholdingAcres} acres) meets requirements`);
    } else if (profile.landholdingAcres === 0) {
      missingCriteria.push(`Requires agricultural land record in applicant's name`);
    } else {
      missingCriteria.push(`Landholding (${profile.landholdingAcres} acres) exceeds max limit of ${rules.maxLandholdingAcres} acres`);
    }
  }

  if (rules.minLandholdingAcres !== undefined) {
    totalScorePoints += 15;
    if (profile.landholdingAcres >= rules.minLandholdingAcres) {
      earnedScorePoints += 15;
      matchingCriteria.push(`Meets minimum landholding of ${rules.minLandholdingAcres} acres`);
    } else {
      missingCriteria.push(`Requires at least ${rules.minLandholdingAcres} acres of cultivable land`);
    }
  }

  // 8. Location: Rural / Urban
  if (rules.ruralOnly) {
    totalScorePoints += 15;
    if (profile.area === 'Rural') {
      earnedScorePoints += 15;
      matchingCriteria.push(`Rural residency confirmed`);
    } else {
      missingCriteria.push(`Applicable exclusively to Rural residents`);
    }
  }

  if (rules.urbanOnly) {
    totalScorePoints += 15;
    if (profile.area === 'Urban' || profile.area === 'Semi-Urban') {
      earnedScorePoints += 15;
      matchingCriteria.push(`Urban / Semi-Urban residency confirmed`);
    } else {
      missingCriteria.push(`Applicable exclusively to Urban / Municipal residents`);
    }
  }

  // 9. Disability / PwD Rule
  if (rules.requiresDisability) {
    totalScorePoints += 30;
    if (profile.isDifferentlyAbled) {
      const minPercent = rules.minDisabilityPercentage ?? 40;
      if ((profile.disabilityPercentage ?? 0) >= minPercent) {
        earnedScorePoints += 30;
        matchingCriteria.push(`Disability (${profile.disabilityPercentage}%) meets required ≥${minPercent}% threshold`);
      } else {
        missingCriteria.push(`Disability percentage is ${profile.disabilityPercentage}% (requires ≥${minPercent}%)`);
      }
    } else {
      missingCriteria.push(`Requires Divyangjan / Disability certification with ≥40% UDID`);
    }
  }

  // 10. Student Rule
  if (rules.requiresStudent) {
    totalScorePoints += 25;
    if (profile.isStudent) {
      earnedScorePoints += 25;
      matchingCriteria.push(`Active Student status confirmed (${profile.educationLevel || 'Enrolled'})`);
    } else {
      const studentFam = profile.familyMembers.find(f => f.isStudent);
      if (studentFam) {
        earnedScorePoints += 20;
        matchingCriteria.push(`Family student qualifies: ${studentFam.name} (${studentFam.educationLevel || 'Enrolled'})`);
        familyMemberBeneficiary = `${studentFam.name} (${studentFam.relationship})`;
      } else {
        missingCriteria.push(`Requires student enrollment in recognized school/college`);
      }
    }
  }

  // 11. Housing & Sanitation condition
  if (rules.requiresKutchaHouse) {
    totalScorePoints += 20;
    if (profile.housingType === 'Kutcha' || profile.housingType === 'Homeless') {
      earnedScorePoints += 20;
      matchingCriteria.push(`Housing condition (${profile.housingType}) qualifies for housing grant`);
    } else {
      missingCriteria.push(`Requires Kutcha or dilapidated dwelling condition`);
    }
  }

  if (rules.requiresNoLPG) {
    totalScorePoints += 15;
    if (!profile.hasLPGConnection) {
      earnedScorePoints += 15;
      matchingCriteria.push(`No prior LPG connection (Eligible for free gas connection)`);
    } else {
      missingCriteria.push(`Household already has registered LPG connection`);
    }
  }

  // 12. Girl Child Specific (e.g. Sukanya Samriddhi)
  if (rules.requiresGirlChild) {
    totalScorePoints += 25;
    const hasEligibleGirl = (profile.gender === 'Female' && profile.age <= 10) ||
      profile.familyMembers.some(f => f.gender === 'Female' && f.relationship === 'Daughter' && f.age <= 10);
    
    if (hasEligibleGirl) {
      earnedScorePoints += 25;
      const girlMember = profile.familyMembers.find(f => f.gender === 'Female' && f.relationship === 'Daughter' && f.age <= 10);
      const girlName = girlMember ? `${girlMember.name} (Age ${girlMember.age})` : profile.fullName;
      matchingCriteria.push(`Girl child under 10 years verified: ${girlName}`);
      if (girlMember) familyMemberBeneficiary = `${girlMember.name} (Daughter)`;
    } else {
      missingCriteria.push(`Requires a girl child below 10 years of age in the family`);
    }
  }

  // 13. Pregnant / Lactating Mother
  if (rules.requiresPregnantOrLactating) {
    totalScorePoints += 30;
    const hasEligibleMother = profile.familyMembers.some(f => f.isPregnantOrLactating) || (profile.gender === 'Female' && profile.age >= 18 && profile.age <= 45);
    if (hasEligibleMother) {
      earnedScorePoints += 30;
      matchingCriteria.push(`Eligible for maternal health incentive`);
    } else {
      missingCriteria.push(`Requires pregnant or lactating mother status`);
    }
  }

  // 14. SHG Membership
  if (rules.requiresShg) {
    totalScorePoints += 20;
    if (profile.isShgMember) {
      earnedScorePoints += 20;
      matchingCriteria.push(`Active Self-Help Group (SHG) membership confirmed`);
    } else {
      missingCriteria.push(`Requires active registration in DAY-NRLM / State Women SHG`);
      if (!actionToUnlock) {
        actionToUnlock = 'Join or register a 10-member Women Self Help Group in your Gram Panchayat';
      }
    }
  }

  // 15. e-Shram Registration check for workers
  if (rules.requiresEshram) {
    totalScorePoints += 15;
    if (profile.hasEshramCard) {
      earnedScorePoints += 15;
      matchingCriteria.push(`e-Shram Universal Account Number (UAN) active`);
    } else {
      missingCriteria.push(`e-Shram Card is not registered`);
      if (!actionToUnlock) {
        actionToUnlock = 'Self-register on eshram.gov.in (Takes 5 minutes with Aadhaar OTP)';
      }
    }
  }

  // Final Match Score calculation
  const matchScore = totalScorePoints > 0 ? Math.round((earnedScorePoints / totalScorePoints) * 100) : 100;

  // Determine Status
  let status: EvaluationStatus;
  if (isAlreadyClaimed) {
    status = 'ALREADY_RECEIVING';
  } else if (missingCriteria.length === 0 && matchScore >= 90) {
    status = 'ELIGIBLE_UNCLAIMED';
  } else if (missingCriteria.length <= 2 && matchScore >= 60) {
    status = 'PARTIALLY_ELIGIBLE';
    if (!actionToUnlock && missingCriteria.length > 0) {
      actionToUnlock = `Resolve requirement: ${missingCriteria[0]}`;
    }
  } else {
    status = 'INELIGIBLE';
  }

  // Calculate potential annual gain
  let potentialGain = scheme.estimatedAnnualValue;
  if (scheme.oneTimeGrantValue) {
    potentialGain += Math.round(scheme.oneTimeGrantValue / 3); // amortized estimated gain
  }

  // Priority Tagging
  let priority: 'HIGH_URGENCY' | 'MEDIUM' | 'RECOMMENDED' = 'RECOMMENDED';
  if (scheme.tag === 'Flagship' || scheme.estimatedAnnualValue >= 10000 || (scheme.insuranceCoverValue ?? 0) >= 200000 || scheme.oneTimeGrantValue) {
    priority = 'HIGH_URGENCY';
  } else if (scheme.tag === 'High Impact' || scheme.estimatedAnnualValue >= 5000) {
    priority = 'MEDIUM';
  }

  return {
    scheme,
    status,
    matchScore,
    matchingCriteria,
    missingCriteria,
    actionToUnlock,
    potentialAnnualGain: potentialGain,
    estimatedTimeToApproval: scheme.level === 'Central' ? '7 to 21 Days' : '14 to 30 Days',
    priority,
    familyMemberBeneficiary
  };
}

export function performMissedBenefitAudit(
  profile: CitizenProfile,
  allSchemes: GovernmentScheme[] = ALL_SCHEMES
): MissedBenefitAudit {
  const evaluations = allSchemes.map(scheme => evaluateSchemeEligibility(profile, scheme));

  const missedSchemes = evaluations.filter(e => e.status === 'ELIGIBLE_UNCLAIMED');
  const claimedSchemes = evaluations.filter(e => e.status === 'ALREADY_RECEIVING');
  const partialSchemes = evaluations.filter(e => e.status === 'PARTIALLY_ELIGIBLE');

  let totalUnclaimedAnnualValue = 0;
  let totalUnclaimedInsuranceCover = 0;
  let totalOneTimeGrantsMissed = 0;

  for (const item of missedSchemes) {
    totalUnclaimedAnnualValue += item.scheme.estimatedAnnualValue;
    if (item.scheme.insuranceCoverValue) {
      totalUnclaimedInsuranceCover += item.scheme.insuranceCoverValue;
    }
    if (item.scheme.oneTimeGrantValue) {
      totalOneTimeGrantsMissed += item.scheme.oneTimeGrantValue;
    }
  }

  // Identify top actionable blockers
  const blockersMap = new Map<string, { unlocks: string[]; value: number; guide: string; days: string }>();

  if (!profile.hasBankDBTEnabled) {
    blockersMap.set('Aadhaar-Bank NPCI DBT Seeding Missing', {
      unlocks: ['PM-KISAN', 'PMMVY', 'Post-Matric Scholarship', 'PMAY Direct Grant'],
      value: 35000,
      guide: 'Submit Aadhaar DBT consent form at your home bank branch or verify on UIDAI portal.',
      days: '2-3 Days'
    });
  }

  if (!profile.hasEshramCard && (profile.occupation === 'Agricultural Labourer' || profile.occupation === 'Construction Worker' || profile.occupation === 'Street Vendor' || profile.occupation === 'Traditional Artisan / Craftsperson')) {
    blockersMap.set('Unregistered on e-Shram Portal', {
      unlocks: ['e-Shram Accident Cover', 'PMSBY', 'State BOCW Welfare Grants'],
      value: 12000,
      guide: 'Visit eshram.gov.in, enter Aadhaar and select your trade for instant 12-digit UAN Card.',
      days: 'Instant (5 mins)'
    });
  }

  if (profile.housingType === 'Kutcha' && !profile.claimedSchemeIds.includes('pm-awas-gramin')) {
    blockersMap.set('PMAY-G Awaas+ Gram Sabha Listing Verification', {
      unlocks: ['PMAY-G Housing Grant (₹1.2 Lakh)', 'SBM Toilet Grant (₹12k)', 'MGNREGA Wages (₹24k)'],
      value: 156000,
      guide: 'Request Village Panchayat Secretary to update your name in Awaas+ survey list.',
      days: '15-30 Days'
    });
  }

  if (profile.occupation === 'Small / Marginal Farmer' && !profile.hasKisanCreditCard) {
    blockersMap.set('Kisan Credit Card (KCC) Inactive', {
      unlocks: ['KCC 4% Subsidized Crop Loan up to ₹3 Lakh', 'PM Fasal Bima automatic coverage'],
      value: 15000,
      guide: 'Submit 1-page KCC application form at your PM-KISAN bank branch with land 7/12 record.',
      days: '14 Days'
    });
  }

  if (profile.isDifferentlyAbled && !profile.claimedSchemeIds.includes('disability-adip-aid')) {
    blockersMap.set('UDID Disability Card / Medical Board Certificate', {
      unlocks: ['ADIP Free Motorized Tricycle/Aid (₹40,000)', 'Divyangjan Pension', 'Travel Concessions'],
      value: 52000,
      guide: 'Apply on swavlambancard.gov.in or visit District Civil Hospital for UDID card.',
      days: '10-20 Days'
    });
  }

  const topActionableBlockers = Array.from(blockersMap.entries()).map(([name, data], idx) => ({
    id: `blocker-${idx + 1}`,
    blockerName: name,
    unlocksSchemeNames: data.unlocks,
    potentialUnlockedValue: data.value,
    howToResolve: data.guide,
    estimatedDays: data.days
  }));

  // Calculate synergy bundles
  const synergyBundles = [
    {
      title: 'Farmer Welfare & Security Stack',
      description: 'Complete integrated social safety and income stack for small & marginal agricultural families.',
      schemeNames: ['PM-KISAN', 'Kisan Credit Card (KCC)', 'PMSBY Accidental Cover', 'PM-KUSUM Solar Pump'],
      combinedAnnualBenefit: '₹45,000+ / year in cash & input subsidies + ₹2 Lakh accident protection',
      icon: '🌾'
    },
    {
      title: 'Artisan & Street Micro-Enterprise Stack',
      description: 'Capital, toolkit incentives, and national identity for informal self-employed craftspeople.',
      schemeNames: ['PM Vishwakarma', 'PM SVANidhi', 'e-Shram Social Security', 'Atal Pension Yojana'],
      combinedAnnualBenefit: '₹15,000 free toolkit + ₹3.8 Lakh low-interest credit + ₹5,000/mo lifetime pension',
      icon: '🛠️'
    },
    {
      title: 'Women Empowerment & Mother-Child Stack',
      description: 'Maternal health DBT, girl child compounding savings, and clean household energy.',
      schemeNames: ['PMMVY Maternity Benefit', 'Sukanya Samriddhi Yojana', 'PM Ujjwala 2.0 Free LPG', 'DAY-NRLM SHG Fund'],
      combinedAnnualBenefit: '₹28,000+ / year in direct subsidies + 8.2% tax-free daughter education fund',
      icon: '🌸'
    }
  ];

  return {
    totalUnclaimedAnnualValue,
    totalUnclaimedInsuranceCover,
    totalOneTimeGrantsMissed,
    eligibleSchemeCount: missedSchemes.length + claimedSchemes.length,
    missedSchemeCount: missedSchemes.length,
    alreadyClaimedSchemeCount: claimedSchemes.length,
    partiallyEligibleCount: partialSchemes.length,
    missedSchemes,
    claimedSchemes,
    partialSchemes,
    topActionableBlockers,
    synergyBundles
  };
}

export function evaluateAllSchemes(profile: CitizenProfile): EvaluationResult[] {
  return ALL_SCHEMES.map(scheme => evaluateSchemeEligibility(profile, scheme));
}
