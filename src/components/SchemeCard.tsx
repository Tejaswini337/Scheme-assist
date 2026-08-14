import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Check, 
  Phone,
  BookmarkPlus,
  Users
} from 'lucide-react';
import { EvaluationResult, GovernmentScheme } from '../types';

interface SchemeCardProps {
  evaluation: EvaluationResult;
  onOpenDetails: (scheme: GovernmentScheme) => void;
  onToggleClaimed: (schemeId: string) => void;
  onAskAIAboutScheme: (scheme: GovernmentScheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  evaluation,
  onOpenDetails,
  onToggleClaimed,
  onAskAIAboutScheme,
}) => {
  const { scheme, status, matchScore, matchingCriteria, missingCriteria, actionToUnlock, familyMemberBeneficiary } = evaluation;

  const isMissed = status === 'ELIGIBLE_UNCLAIMED';
  const isClaimed = status === 'ALREADY_RECEIVING';
  const isPartial = status === 'PARTIALLY_ELIGIBLE';

  return (
    <div 
      className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative shadow-md ${
        isMissed
          ? 'bg-slate-800/95 border-amber-500/50 hover:border-amber-400 hover:shadow-amber-500/10'
          : isClaimed
          ? 'bg-slate-800/60 border-emerald-500/40 opacity-90'
          : isPartial
          ? 'bg-slate-800/80 border-indigo-500/40 hover:border-indigo-400'
          : 'bg-slate-900/60 border-slate-800 opacity-60'
      }`}
    >
      {/* Top Banner Tag */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          
          {/* Status Badge */}
          {isMissed && (
            <span className="bg-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <AlertCircle className="w-3.5 h-3.5" />
              Missed Benefit (100% Eligible)
            </span>
          )}

          {isClaimed && (
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Active Benefit (Claimed)
            </span>
          )}

          {isPartial && (
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Partially Eligible ({matchScore}% Match)
            </span>
          )}

          {!isMissed && !isClaimed && !isPartial && (
            <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[11px] px-2 py-0.5 rounded-full">
              Ineligible ({matchScore}%)
            </span>
          )}

          {/* Scheme Category Tag */}
          <span className="text-[11px] font-medium text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-md">
            {scheme.category}
          </span>
        </div>

        {/* Scheme Title & Hindi name */}
        <h3 className="text-base font-bold text-white leading-snug group cursor-pointer hover:text-emerald-300 transition" onClick={() => onOpenDetails(scheme)}>
          {scheme.name}
        </h3>
        
        {scheme.hindiName && (
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{scheme.hindiName}</p>
        )}

        {/* Beneficiary Tag if applicable */}
        {familyMemberBeneficiary && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 mt-2 bg-indigo-950/40 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
            <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Beneficiary: <strong>{familyMemberBeneficiary}</strong></span>
          </div>
        )}
      </div>

      {/* Benefit Highlight Box */}
      <div className="px-5 py-2.5">
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            Direct Welfare Benefit Value
          </div>
          <div className="text-sm font-black text-slate-100 mt-0.5 leading-snug">
            {scheme.valueDisplay}
          </div>
        </div>

        {/* Action to Unlock for Partial Schemes */}
        {isPartial && actionToUnlock && (
          <div className="mt-2.5 p-2 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs text-amber-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Unlock Action: </span>
              <span>{actionToUnlock}</span>
            </div>
          </div>
        )}

        {/* Key bullets */}
        <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
          {scheme.keyBenefits.slice(0, 2).map((b, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-tight">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Card Action Buttons Footer */}
      <div className="px-5 py-3.5 bg-slate-900/90 border-t border-slate-700/70 flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-1.5">
          {/* Claim / Unclaim toggle */}
          <button
            id={`btn-toggle-claim-${scheme.id}`}
            onClick={() => onToggleClaimed(scheme.id)}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 border ${
              isClaimed
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title={isClaimed ? 'Mark as not claimed' : 'Mark as already receiving'}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isClaimed ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{isClaimed ? 'Claimed' : 'Mark Claimed'}</span>
          </button>

          {/* Ask AI button */}
          <button
            id={`btn-ask-ai-${scheme.id}`}
            onClick={() => onAskAIAboutScheme(scheme)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 transition flex items-center gap-1"
            title="Ask AI how to claim this scheme"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>

        {/* View Full Guide & Apply Modal */}
        <button
          id={`btn-view-scheme-${scheme.id}`}
          onClick={() => onOpenDetails(scheme)}
          className="flex items-center gap-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition shadow-sm"
        >
          <span>Claim Guide</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
