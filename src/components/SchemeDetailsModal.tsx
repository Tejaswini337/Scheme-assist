import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Phone, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  Building2, 
  Copy, 
  Check,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Clock
} from 'lucide-react';
import { GovernmentScheme, CitizenProfile } from '../types';
import { getSimplifiedSchemeGuide } from '../services/api';

interface SchemeDetailsModalProps {
  scheme: GovernmentScheme | null;
  isOpen: boolean;
  onClose: () => void;
  profile: CitizenProfile;
  language: string;
  onToggleClaimed: (schemeId: string) => void;
  isClaimed: boolean;
}

export const SchemeDetailsModal: React.FC<SchemeDetailsModalProps> = ({
  scheme,
  isOpen,
  onClose,
  profile,
  language,
  onToggleClaimed,
  isClaimed,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'apply-steps' | 'documents' | 'rejection-pitfalls' | 'ai-simplified'>('overview');
  const [aiSimplifiedText, setAiSimplifiedText] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copiedDoc, setCopiedDoc] = useState(false);

  if (!isOpen || !scheme) return null;

  const handleFetchAiExplanation = async () => {
    setLoadingAi(true);
    try {
      const text = await getSimplifiedSchemeGuide(scheme, language);
      setAiSimplifiedText(text);
      setActiveTab('ai-simplified');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopyDocs = () => {
    const text = scheme.requiredDocuments.map((d, i) => `${i + 1}. ${d}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-900 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {scheme.category}
              </span>
              <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full">
                {scheme.level} Government Initiative
              </span>
              {scheme.tag && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2 py-0.5 rounded-full font-semibold">
                  ★ {scheme.tag}
                </span>
              )}
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {scheme.name}
            </h2>
            {scheme.hindiName && (
              <p className="text-sm text-slate-400 font-medium mt-0.5">{scheme.hindiName}</p>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{scheme.ministry}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Highlight Value Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Assured Benefit Value
            </div>
            <div className="text-base font-extrabold text-white">
              {scheme.valueDisplay}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleClaimed(scheme.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                isClaimed
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isClaimed ? 'Marked as Received' : 'Mark as Claimed'}</span>
            </button>

            <a
              href={scheme.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-6 gap-2 overflow-x-auto text-xs py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview &amp; Benefits
          </button>
          
          <button
            onClick={() => setActiveTab('apply-steps')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'apply-steps'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Application Roadmap (How to Apply)
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'documents'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Required Documents ({scheme.requiredDocuments.length})
          </button>

          <button
            onClick={() => setActiveTab('rejection-pitfalls')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'rejection-pitfalls'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Common Rejection Causes
          </button>

          <button
            onClick={handleFetchAiExplanation}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
              activeTab === 'ai-simplified'
                ? 'bg-purple-600 text-white font-semibold shadow-sm'
                : 'bg-purple-950/40 text-purple-300 border border-purple-500/30 hover:bg-purple-900/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI Plain Language Guide</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-200 flex-1">
          
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{scheme.fullDescription}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Key Beneficiary Entitlements</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {scheme.keyBenefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/70 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Toll-Free Helpline</div>
                  <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{scheme.helplineNumber}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Common Service Center (CSC)</div>
                  <div className="text-sm font-bold text-emerald-300 mt-1">
                    {scheme.isCscAvailable ? 'Available at all Jan Seva Kendra' : 'Online / Branch Direct'}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Coverage Level</div>
                  <div className="text-sm font-bold text-white mt-1">
                    {scheme.applicableStates === 'All' ? 'Pan-India National' : 'State Specific'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Apply Roadmap */}
          {activeTab === 'apply-steps' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                Follow this official 3-step application path to claim without paying any commission to unauthorized intermediaries.
              </div>

              <div className="space-y-3">
                {scheme.howToApplySteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mb-1">Step {idx + 1}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-slate-800/60 border border-slate-700 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Need Offline Help?</div>
                  <div className="text-xs text-slate-400">Visit your nearest Gram Panchayat, Village Revenue Officer, or CSC center with your documents.</div>
                </div>
                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <span>Open Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: Documents Checklist */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Ensure all documents have matching names and valid active issue dates.</p>
                <button
                  onClick={handleCopyDocs}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-lg transition"
                >
                  {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDoc ? 'Copied List!' : 'Copy Checklist'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {scheme.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                    <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-slate-200">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Common Rejection Causes */}
          {activeTab === 'rejection-pitfalls' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Over 40% of government scheme applications face rejection due to these common oversights. Review and rectify beforehand:</span>
              </div>

              <div className="space-y-2.5">
                {scheme.commonRejectionReasons.map((reason, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-800/80 border border-rose-500/20 text-xs text-slate-200 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AI Simplified */}
          {activeTab === 'ai-simplified' && (
            <div className="space-y-4">
              {loadingAi ? (
                <div className="p-12 text-center text-slate-400 text-xs space-y-3">
                  <Sparkles className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                  <p>Translating legalistic scheme guidelines into plain, friendly 5th-grade reading level...</p>
                </div>
              ) : (
                <div className="p-5 bg-purple-950/20 border border-purple-500/30 rounded-2xl space-y-3 text-xs leading-relaxed text-slate-200">
                  <div className="flex items-center gap-2 text-purple-300 font-bold border-b border-purple-500/20 pb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>AI Citizen Simplified Guidance ({language})</span>
                  </div>
                  <div className="whitespace-pre-line text-slate-300">
                    {aiSimplifiedText}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Official Portal: <a href={scheme.officialPortalUrl} target="_blank" rel="noreferrer" className="text-emerald-400 underline">{scheme.officialPortalUrl}</a>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
