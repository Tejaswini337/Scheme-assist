import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Layers, 
  Zap, 
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { MissedBenefitAudit, CitizenProfile, GovernmentScheme } from '../types';
import { SchemeCard } from './SchemeCard';
import { getDeepAuditPlan } from '../services/api';

interface MissedBenefitAuditTabProps {
  audit: MissedBenefitAudit;
  profile: CitizenProfile;
  language: string;
  onOpenSchemeDetails: (scheme: GovernmentScheme) => void;
  onToggleClaimed: (schemeId: string) => void;
  onAskAIAboutScheme: (scheme: GovernmentScheme) => void;
  onOpenProfileEditor: () => void;
}

export const MissedBenefitAuditTab: React.FC<MissedBenefitAuditTabProps> = ({
  audit,
  profile,
  language,
  onOpenSchemeDetails,
  onToggleClaimed,
  onAskAIAboutScheme,
  onOpenProfileEditor,
}) => {
  const [aiAuditPlan, setAiAuditPlan] = useState<string | null>(null);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);

  const handleGenerateAiDeepAudit = async () => {
    setLoadingAudit(true);
    try {
      const plan = await getDeepAuditPlan(profile, audit.claimedSchemes, audit.missedSchemes, language);
      setAiAuditPlan(plan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleCopyPlan = () => {
    if (!aiAuditPlan) return;
    navigator.clipboard.writeText(aiAuditPlan);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Missed Benefits Section */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>Unclaimed Missed Benefits ({audit.missedSchemeCount})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Schemes where your profile matches 100% of the eligibility criteria, but benefit has not yet been claimed.
            </p>
          </div>

          <button
            id="btn-generate-deep-audit-tab"
            onClick={handleGenerateAiDeepAudit}
            disabled={loadingAudit}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{loadingAudit ? 'Auditing with Gemini AI...' : 'Generate AI Social Security Roadmap'}</span>
          </button>
        </div>

        {/* AI Deep Audit Plan Panel (if generated) */}
        {aiAuditPlan && (
          <div className="mb-6 p-5 sm:p-6 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/40 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">AI Welfare Audit &amp; Claim Strategy ({language})</h3>
              </div>

              <button
                onClick={handleCopyPlan}
                className="flex items-center gap-1 text-xs text-emerald-300 hover:text-white bg-emerald-900/40 border border-emerald-500/30 px-3 py-1 rounded-lg transition"
              >
                {copiedPlan ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPlan ? 'Copied' : 'Copy Strategy'}</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed space-y-2 font-normal">
              {aiAuditPlan}
            </div>
          </div>
        )}

        {audit.missedSchemes.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/40 border border-slate-700/80 rounded-2xl text-slate-300">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white">Great Job! No Missed Benefits Detected</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              You are already receiving all eligible benefits or can explore partially eligible schemes below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {audit.missedSchemes.map((evaluation) => (
              <SchemeCard
                key={evaluation.scheme.id}
                evaluation={evaluation}
                onOpenDetails={onOpenSchemeDetails}
                onToggleClaimed={onToggleClaimed}
                onAskAIAboutScheme={onAskAIAboutScheme}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. Top Actionable Blockers (Fixable to Unlock More Welfare) */}
      {audit.topActionableBlockers.length > 0 && (
        <section className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Prerequisite Blockers &amp; Quick Unlocks</h3>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Resolving these specific documentation or registration gaps will immediately unlock pending schemes for your family.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audit.topActionableBlockers.map((blocker) => (
              <div 
                key={blocker.id}
                className="bg-slate-900/80 border border-slate-700 p-4 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{blocker.blockerName}</span>
                    </h4>
                    <span className="text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full shrink-0">
                      {blocker.estimatedDays}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {blocker.howToResolve}
                  </p>

                  <div className="mt-3 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Unlocks Schemes: </span>
                    <span className="text-emerald-300 font-medium">{blocker.unlocksSchemeNames.join(', ')}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Potential Unlocked Value:</span>
                  <span className="font-extrabold text-amber-300">₹{blocker.potentialUnlockedValue.toLocaleString('en-IN')}+</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Synergistic Benefit Stacks (Complementary Bundles) */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-teal-400" />
          <h3 className="text-lg font-bold text-white">Synergistic Welfare Stacks</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Integrated schemes designed to be claimed together for maximum social security and zero conflict.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audit.synergyBundles.map((bundle, idx) => (
            <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="text-2xl mb-2">{bundle.icon}</div>
                <h4 className="text-sm font-bold text-white">{bundle.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{bundle.description}</p>

                <div className="mt-3 space-y-1">
                  {bundle.schemeNames.map((s, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs font-bold text-teal-300">
                {bundle.combinedAnnualBenefit}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Already Claimed Schemes */}
      {audit.claimedSchemes.length > 0 && (
        <section className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Currently Active Benefits ({audit.alreadyClaimedSchemeCount})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Schemes your household is actively receiving. Click &quot;Customize Citizen Data&quot; to update.
              </p>
            </div>

            <button
              onClick={onOpenProfileEditor}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg transition"
            >
              Update Claimed List
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {audit.claimedSchemes.map((evaluation) => (
              <SchemeCard
                key={evaluation.scheme.id}
                evaluation={evaluation}
                onOpenDetails={onOpenSchemeDetails}
                onToggleClaimed={onToggleClaimed}
                onAskAIAboutScheme={onAskAIAboutScheme}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
