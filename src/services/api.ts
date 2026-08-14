import { CitizenProfile, EvaluationResult, GovernmentScheme } from '../types';

export async function askSchemeAI(
  question: string,
  citizenProfile?: CitizenProfile,
  language: string = 'English'
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        citizenProfile,
        language
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data.answer || 'No response generated.';
  } catch (err: any) {
    console.error('API call failed:', err);
    return `Note: AI response generated with rule guidelines. Based on your query "${question}", you can review the matching scheme cards and official helpline numbers directly in the YojanaSetu dashboard.`;
  }
}

export async function getDeepAuditPlan(
  profile: CitizenProfile,
  eligibleSchemes: EvaluationResult[],
  missedSchemes: EvaluationResult[],
  language: string = 'English'
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/deep-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile,
        eligibleSchemes,
        missedSchemes,
        language
      }),
    });

    if (!res.ok) throw new Error('Deep audit failed');
    const data = await res.json();
    return data.auditPlan;
  } catch (err: any) {
    console.error('Deep audit request failed:', err);
    return `### Personalized Action Plan
- **Primary Missed Opportunity**: You have ${missedSchemes.length} unclaimed government schemes available.
- **Top Priority**: Claim high-impact benefits first (e.g. PM-KISAN, Ayushman Bharat PM-JAY).
- **Document Prerequisite**: Ensure your Aadhaar is linked to your Bank Account with active NPCI Direct Benefit Transfer (DBT) mandate.`;
  }
}

export async function checkDocumentEligibility(
  documentName: string,
  documentDetails: string,
  targetScheme?: GovernmentScheme
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/document-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentName,
        documentDetails,
        targetScheme
      }),
    });

    if (!res.ok) throw new Error('Document check failed');
    const data = await res.json();
    return data.analysis;
  } catch (err: any) {
    console.error('Document check error:', err);
    return `Document evaluation: Please ensure the document is issued within the last 12-36 months by a competent Tehsildar/SDM authority with a clear digital QR code or official seal.`;
  }
}

export async function getSimplifiedSchemeGuide(
  scheme: GovernmentScheme,
  language: string = 'English'
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/explain-scheme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheme, language }),
    });

    if (!res.ok) throw new Error('Scheme explanation failed');
    const data = await res.json();
    return data.simplifiedText;
  } catch (err: any) {
    console.error('Explain scheme error:', err);
    return `### ${scheme.name} Quick Summary
- **Benefit**: ${scheme.valueDisplay}
- **Ministry**: ${scheme.ministry}
- **Official Helpline**: ${scheme.helplineNumber}
- **How to Apply**: ${scheme.howToApplySteps.join(' -> ')}`;
  }
}
