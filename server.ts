import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. AI Scheme Advisor & Multilingual Q&A
app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { question, citizenProfile, conversationHistory, language = "English" } = req.body;

    const systemInstruction = `You are "YojanaSetu AI", an expert, highly empathetic Government Welfare Scheme and Missed-Benefit Advisor in India and public administration.
Your mission is to help citizens, rural families, workers, women, farmers, students, and seniors discover eligible government schemes, claim missed benefits, navigate official portals, and resolve eligibility blockers.

Guidelines:
1. Provide accurate, clear, and actionable advice based on verified Central and State Government schemes (e.g., Ayushman Bharat PM-JAY, PM-Kisan, PM Awas Yojana, PM Vishwakarma, PM SVANidhi, Sukanya Samriddhi, PMMVY, scholarships, pensions, e-Shram, Atal Pension Yojana, Mudra loans, etc.).
2. Tone: Warm, respectful, supportive, and simple to understand (avoid heavy bureaucratic jargon).
3. If the user asks in Hindi, Telugu, Tamil, Marathi, Bengali, or requests a specific language, respond in that language (${language}).
4. Always clearly specify:
   - Why the citizen qualifies
   - What exact monetary or non-monetary benefit they will receive
   - Mandatory documents needed (e.g., Aadhaar-seeded Bank Account, Income Certificate, etc.)
   - How and where to apply (Official online portal, CSC / Common Service Center / MeeSeva / Jan Seva Kendra).
5. If the citizen profile is provided, personalize the advice specifically to their age, state, occupation, income, caste category, and family members.
6. Provide bullet points and bold key terms for high readability.`;

    const userPrompt = `
Citizen Profile Context:
${citizenProfile ? JSON.stringify(citizenProfile, null, 2) : "No profile loaded yet."}

User Language Preference: ${language}

User Question/Prompt:
${question}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      answer: response.text || "I could not generate an answer at this moment. Please try again.",
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/advisor:", error);
    res.status(500).json({
      error: "Failed to generate AI advice",
      details: error?.message || "Unknown error",
      fallback: "You may explore the eligible schemes directly in the dashboard below.",
    });
  }
});

// 2. AI Deep Benefit Audit & Action Plan
app.post("/api/gemini/deep-audit", async (req, res) => {
  try {
    const { profile, eligibleSchemes, missedSchemes, language = "English" } = req.body;

    const systemInstruction = `You are a Senior Welfare Auditor and Social Security Strategist.
Analyze the citizen's profile and their missed benefits. Generate a high-impact, empathetic, personalized 3-step action roadmap to claim their highest-value missed benefits with zero rejection risk.

Output format: Return clear structured markdown with:
1. **Executive Summary**: 2 sentences highlighting their total missed financial value and primary social security gap.
2. **Top 3 High-Urgency Schemes to Claim This Week**: For each, why they are eligible, exact annual benefit, and direct 1-2-3 application steps.
3. **Key Document Readiness Warnings**: Crucial prerequisite alerts (e.g., Aadhaar-NPCI bank linking for DBT, income certificate validity, e-Shram UAN card).
4. **Family Synergy Tip**: How other family members (spouse, children, elderly parents) can unlock additional welfare.
Respond in ${language}.`;

    const prompt = `
Citizen Profile:
${JSON.stringify(profile, null, 2)}

Eligible Unclaimed (Missed) Schemes Detected:
${JSON.stringify(missedSchemes, null, 2)}

Already Receiving:
${JSON.stringify(eligibleSchemes.filter((s: any) => s.status === 'ALREADY_RECEIVING'), null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({
      auditPlan: response.text || "Audit plan generated successfully.",
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/deep-audit:", error);
    res.status(500).json({
      error: "Failed to run deep audit",
      details: error?.message || "Unknown error",
    });
  }
});

// 3. AI Document & Eligibility Checker
app.post("/api/gemini/document-check", async (req, res) => {
  try {
    const { documentName, documentDetails, targetScheme } = req.body;

    const systemInstruction = `You are a Government Document Verification & Scheme Compliance Specialist.
Evaluate the document details provided by the citizen for applying to: ${targetScheme?.name || "Government Schemes"}.
Highlight:
1. Whether this document meets standard government compliance criteria (validity period, issuing authority, required seals/QR).
2. Common pitfalls that cause rejection (e.g. name spelling mismatch between Aadhaar & Bank passbook, unseeded NPCI mapper for Direct Benefit Transfer).
3. Exact steps to fix or obtain if missing/expired.`;

    const prompt = `
Document Name: ${documentName}
Document Details / Metadata: ${documentDetails}
Target Scheme: ${JSON.stringify(targetScheme || {}, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    res.json({
      analysis: response.text || "Document check complete.",
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/document-check:", error);
    res.status(500).json({
      error: "Failed to evaluate document",
      details: error?.message || "Unknown error",
    });
  }
});

// 4. Scheme Simplifier & Jargon Explainer
app.post("/api/gemini/explain-scheme", async (req, res) => {
  try {
    const { scheme, language = "English" } = req.body;

    const systemInstruction = `You are a Citizen Advocate translating complex government scheme notifications into crystal-clear, 5th-grade reading level guidelines.
Format the explanation into:
- 💡 **What is this in 1 sentence?**
- 💰 **What will I get and when?**
- 📋 **Am I 100% eligible? (Quick checklist)**
- 🚀 **Exact 3-step process to apply without paying any bribe/middleman.**
- 📞 **Helpline & Where to go.**
Language: ${language}.`;

    const prompt = `Scheme Data: ${JSON.stringify(scheme, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    res.json({
      simplifiedText: response.text || "Scheme explanation completed.",
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/explain-scheme:", error);
    res.status(500).json({
      error: "Failed to simplify scheme",
      details: error?.message || "Unknown error",
    });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Scheme Assist server listening on http://localhost:${PORT}`);
  });
}

startServer();
