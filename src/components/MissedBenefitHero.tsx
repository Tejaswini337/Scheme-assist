import React from 'react';
import { 
  IndianRupee, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck,
  TrendingUp,
  Zap
} from 'lucide-react';
import { MissedBenefitAudit, CitizenProfile } from '../types';

interface MissedBenefitHeroProps {
  audit: MissedBenefitAudit;
  profile: CitizenProfile;
  onRunDeepAudit: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const MissedBenefitHero: React.FC<MissedBenefitHeroProps> = ({
  audit,
  profile,
  onRunDeepAudit,
  onNavigateToTab
}) => {
  const hasMissed = audit.missedSchemeCount > 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-900/90 to-slate-950 border border-slate-700/80 shadow-2xl p-6 sm:p-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        
        {/* Top Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Missed-Benefit Audit Engine
            </span>
            <span className="text-xs text-slate-400">
              Personalized for <strong className="text-slate-200">{profile.fullName}</strong> & Family
            </span>
          </div>

          <button
            id="btn-run-ai-deep-audit-hero"
            onClick={onRunDeepAudit}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30 group"
          >
            <Sparkles className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
            <span>Generate AI 3-Step Claim Roadmap</span>
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Big Highlight: Unclaimed Annual Financial Value */}
          <div className="md:col-span-6 lg:col-span-5 bg-gradient-to-br from-amber-950/40 via-slate-900/60 to-slate-900/80 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden shadow-inner">
            <div className="text-xs font-semibold text-amber-300/90 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Total Unclaimed Direct Annual Value
            </div>
            
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-300 tracking-tight">
                ₹{audit.totalUnclaimedAnnualValue.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-semibold text-amber-200/80">/ year</span>
            </div>

            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Direct cash transfers, agricultural subsidies, training stipends, and pensions you qualify for but haven&apos;t claimed yet.
            </p>

            {/* Additional One-Time Grants or Insurance */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-x-4 gap-y-2 text-xs">
              {audit.totalUnclaimedInsuranceCover > 0 && (
                <div className="text-slate-300">
                  <span className="text-slate-400 block text-[10px]">Unclaimed Insurance Cover:</span>
                  <span className="font-bold text-teal-300 text-sm">
                    ₹{(audit.totalUnclaimedInsuranceCover / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
              )}

              {audit.totalOneTimeGrantsMissed > 0 && (
                <div className="text-slate-300">
                  <span className="text-slate-400 block text-[10px]">One-Time Capital / Housing Grants:</span>
                  <span className="font-bold text-emerald-300 text-sm">
                    ₹{audit.totalOneTimeGrantsMissed.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Analytics & Status Breakdown */}
          <div className="md:col-span-6 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            
            {/* Missed Schemes Count */}
            <div 
              onClick={() => onNavigateToTab('missed-benefits')}
              className="bg-slate-800/80 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-500/70 p-4 rounded-2xl transition cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-amber-300">Missed Schemes</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-300 transition">
                {audit.missedSchemeCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">100% Eligible, Not Claimed</p>
            </div>

            {/* Already Claimed Count */}
            <div className="bg-slate-800/80 border border-emerald-500/30 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-emerald-300">Active / Claimed</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {audit.alreadyClaimedSchemeCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Currently Receiving</p>
            </div>

            {/* Partially Eligible Count */}
            <div 
              onClick={() => onNavigateToTab('document-checker')}
              className="bg-slate-800/80 hover:bg-slate-800 border border-indigo-500/40 hover:border-indigo-500/70 p-4 rounded-2xl transition cursor-pointer group shadow-sm col-span-2 sm:col-span-1"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-indigo-300">Fixable Blockers</span>
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-indigo-300 transition">
                {audit.partiallyEligibleCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">1-2 simple actions unlock</p>
            </div>

            {/* Visual Benefit Utilization Bar */}
            <div className="col-span-2 sm:col-span-3 bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 font-medium">Household Welfare Claim Ratio:</span>
                <span className="font-bold text-slate-200">
                  {audit.eligibleSchemeCount > 0
                    ? Math.round((audit.alreadyClaimedSchemeCount / audit.eligibleSchemeCount) * 100)
                    : 0}% Claimed
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-700/80 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ 
                    width: `${audit.eligibleSchemeCount > 0 ? (audit.alreadyClaimedSchemeCount / audit.eligibleSchemeCount) * 100 : 0}%` 
                  }}
                  title="Claimed Benefits"
                />
                <div 
                  className="bg-amber-400 h-full transition-all duration-500 animate-pulse"
                  style={{ 
                    width: `${audit.eligibleSchemeCount > 0 ? (audit.missedSchemeCount / audit.eligibleSchemeCount) * 100 : 100}%` 
                  }}
                  title="Missed Unclaimed Benefits"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  Claimed ({audit.alreadyClaimedSchemeCount})
                </span>
                <span className="flex items-center gap-1 font-semibold text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                  Missed &amp; Unclaimed ({audit.missedSchemeCount})
                </span>
                <span className="text-slate-400">
                  Total Eligible: {audit.eligibleSchemeCount}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
