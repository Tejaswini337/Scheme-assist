import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { CitizenProfile, GovernmentScheme } from '../types';
import { ALL_SCHEMES } from '../data/schemesDatabase';
import { checkDocumentEligibility } from '../services/api';

interface AIDocumentScannerProps {
  profile: CitizenProfile;
  onOpenSchemeDetails: (scheme: GovernmentScheme) => void;
}

export const AIDocumentScanner: React.FC<AIDocumentScannerProps> = ({
  profile,
  onOpenSchemeDetails,
}) => {
  const [selectedDocType, setSelectedDocType] = useState('Aadhaar Card');
  const [selectedSchemeId, setSelectedSchemeId] = useState('pm-jay');
  const [documentDetailsInput, setDocumentDetailsInput] = useState(
    `Name on Document: ${profile.fullName}\nAadhaar Linked Mobile: Yes\nBank NPCI Seeding: ${profile.hasBankDBTEnabled ? 'Active' : 'Missing / Inactive'}\nIssue Date: 15/06/2021\nState: ${profile.state}`
  );
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const documentPresets = [
    {
      name: 'Aadhaar Card',
      desc: 'Mandatory primary identity for DBT benefit transfers and e-KYC',
      defaultDetails: `Name on Document: ${profile.fullName}\nAadhaar Linked Mobile: Yes\nBank NPCI Seeding: ${profile.hasBankDBTEnabled ? 'Active' : 'Missing / Inactive'}\nIssue Date: 15/06/2021\nState: ${profile.state}`
    },
    {
      name: 'Income Certificate',
      desc: 'Tehsildar issued annual family income statement (Valid for 1-3 years)',
      defaultDetails: `Name: ${profile.fullName}\nAnnual Income Certified: ₹${profile.annualHouseholdIncome}\nIssuing Authority: Tehsildar / Sub-Divisional Magistrate (SDM)\nIssue Date: 10/01/2024\nValidity: 3 Years\nDigital QR Code: Present`
    },
    {
      name: 'Caste / Community Certificate',
      desc: 'Permanent reservation & quota proof for SC, ST, OBC, or EWS category',
      defaultDetails: `Name: ${profile.fullName}\nCategory: ${profile.casteCategory}\nSub-caste: Recognized State / Central List\nIssuing Authority: District Magistrate / Revenue Officer\nDigital Signature: Verified`
    },
    {
      name: 'Ration Card (NFSA)',
      desc: 'Family member food security & poverty baseline record',
      defaultDetails: `Card Category: ${profile.rationCard}\nHead of Family: ${profile.fullName}\nRegistered Family Members: ${profile.familyMembers.length + 1}\nFair Price Shop (FPS) Code: FPS-39102\nBiometric e-KYC: Completed`
    },
    {
      name: 'Land Record (Khatauni / 7-12 / Patta)',
      desc: 'Agricultural land ownership title proof for PM-KISAN, KCC & Solar Pumps',
      defaultDetails: `Owner Name: ${profile.fullName}\nTotal Landholding: ${profile.landholdingAcres} Acres\nVillage / Tehsil: ${profile.district}\nEncumbrance: Clear / No bank dispute`
    }
  ];

  const handleSelectPreset = (doc: typeof documentPresets[0]) => {
    setSelectedDocType(doc.name);
    setDocumentDetailsInput(doc.defaultDetails);
  };

  const handleRunAiCheck = async () => {
    setLoading(true);
    try {
      const targetScheme = ALL_SCHEMES.find(s => s.id === selectedSchemeId);
      const result = await checkDocumentEligibility(selectedDocType, documentDetailsInput, targetScheme);
      setAiAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const targetSchemeObj = ALL_SCHEMES.find(s => s.id === selectedSchemeId);

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Document Compliance &amp; Rejection Prevention Scanner
            </h2>
            <p className="text-xs text-slate-400">
              Verify your certificates, passbooks, and ration records against scheme compliance rules before applying to ensure 0% rejection risk.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Preset Document Selector & Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Select Document to Audit
            </h3>

            <div className="space-y-2">
              {documentPresets.map((preset) => {
                const isSelected = selectedDocType === preset.name;
                return (
                  <button
                    key={preset.name}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200 shadow-sm'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{preset.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{preset.desc}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-700">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                2. Target Welfare Scheme
              </label>
              <select
                value={selectedSchemeId}
                onChange={(e) => setSelectedSchemeId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {ALL_SCHEMES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.acronym ? `[${s.acronym}] ` : ''}{s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Document Details & AI Analysis Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Document Metadata &amp; Parameters
              </h3>
              <span className="text-[11px] text-slate-400">Edit fields to test your certificate data</span>
            </div>

            <textarea
              rows={5}
              value={documentDetailsInput}
              onChange={(e) => setDocumentDetailsInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed"
            />

            <button
              id="btn-run-doc-scanner"
              onClick={handleRunAiCheck}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-600/30 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>{loading ? 'Evaluating with Gemini AI...' : `Verify ${selectedDocType} for ${targetSchemeObj?.acronym || 'Scheme'}`}</span>
            </button>
          </div>

          {/* AI Output Analysis Box */}
          {aiAnalysis && (
            <div className="bg-cyan-950/30 border border-cyan-500/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>AI Document Verification &amp; Compliance Report</span>
                </div>
                {targetSchemeObj && (
                  <button
                    onClick={() => onOpenSchemeDetails(targetSchemeObj)}
                    className="text-[11px] text-cyan-300 hover:text-white flex items-center gap-1 underline"
                  >
                    <span>View Scheme Guide</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                {aiAnalysis}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
