import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  RotateCcw,
  IndianRupee,
  ShieldCheck,
  Users
} from 'lucide-react';
import { CitizenProfile, MissedBenefitAudit } from '../types';
import { performMissedBenefitAudit } from '../services/ruleEngine';
import { SchemeCard } from './SchemeCard';

interface WhatIfSimulatorProps {
  baselineProfile: CitizenProfile;
  onApplySimulatedToActive: (simulated: CitizenProfile) => void;
  onOpenSchemeDetails: (scheme: any) => void;
  onToggleClaimed: (schemeId: string) => void;
  onAskAIAboutScheme: (scheme: any) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  baselineProfile,
  onApplySimulatedToActive,
  onOpenSchemeDetails,
  onToggleClaimed,
  onAskAIAboutScheme,
}) => {
  const [simulatedProfile, setSimulatedProfile] = useState<CitizenProfile>({
    ...baselineProfile,
    familyMembers: [...baselineProfile.familyMembers.map(f => ({ ...f }))]
  });

  const baselineAudit: MissedBenefitAudit = useMemo(() => {
    return performMissedBenefitAudit(baselineProfile);
  }, [baselineProfile]);

  const simulatedAudit: MissedBenefitAudit = useMemo(() => {
    return performMissedBenefitAudit(simulatedProfile);
  }, [simulatedProfile]);

  const newlyUnlockedSchemes = useMemo(() => {
    const baselineMissedIds = baselineAudit.missedSchemes.map(m => m.scheme.id);
    const baselineClaimedIds = baselineAudit.claimedSchemes.map(c => c.scheme.id);
    
    return simulatedAudit.missedSchemes.filter(
      s => !baselineMissedIds.includes(s.scheme.id) && !baselineClaimedIds.includes(s.scheme.id)
    );
  }, [baselineAudit, simulatedAudit]);

  const deltaAnnualValue = simulatedAudit.totalUnclaimedAnnualValue - baselineAudit.totalUnclaimedAnnualValue;
  const deltaInsurance = simulatedAudit.totalUnclaimedInsuranceCover - baselineAudit.totalUnclaimedInsuranceCover;
  const deltaOneTime = simulatedAudit.totalOneTimeGrantsMissed - baselineAudit.totalOneTimeGrantsMissed;

  const handleReset = () => {
    setSimulatedProfile({
      ...baselineProfile,
      familyMembers: [...baselineProfile.familyMembers.map(f => ({ ...f }))]
    });
  };

  const handleToggle = (field: keyof CitizenProfile) => {
    setSimulatedProfile(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleIncomeSlider = (value: number) => {
    setSimulatedProfile(prev => ({
      ...prev,
      annualHouseholdIncome: value
    }));
  };

  const handleAddGirlChild = () => {
    const hasGirl = simulatedProfile.familyMembers.some(f => f.relationship === 'Daughter' && f.age <= 10);
    if (!hasGirl) {
      setSimulatedProfile(prev => ({
        ...prev,
        familyMembers: [
          ...prev.familyMembers,
          {
            id: `sim-daughter-${Date.now()}`,
            name: 'Priya (Daughter)',
            relationship: 'Daughter',
            age: 6,
            gender: 'Female',
            occupation: 'Student / Youth',
            isStudent: true,
            educationLevel: 'School (1-8)'
          }
        ]
      }));
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                What-If Welfare &amp; Entitlement Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Simulate documentation actions, income tier adjustments, or family life events to preview unlocked benefits before applying.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Scenario</span>
            </button>

            <button
              onClick={() => onApplySimulatedToActive(simulatedProfile)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition shadow-lg shadow-indigo-600/30"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save as Primary Profile</span>
            </button>
          </div>
        </div>

        {/* Delta Impact Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-900/80 border border-indigo-500/30 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-indigo-300">Newly Unlocked Schemes</span>
            <div className="text-2xl font-black text-white mt-1 flex items-center gap-2">
              <span>+{newlyUnlockedSchemes.length}</span>
              <span className="text-xs font-medium text-emerald-400">Schemes</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-amber-300">Net Additional Annual Gain</span>
            <div className="text-2xl font-black text-amber-300 mt-1">
              +₹{deltaAnnualValue > 0 ? deltaAnnualValue.toLocaleString('en-IN') : 0}/yr
            </div>
          </div>

          <div className="bg-slate-900/80 border border-teal-500/30 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-teal-300">Additional Insurance Cover</span>
            <div className="text-2xl font-black text-teal-300 mt-1">
              +₹{deltaInsurance > 0 ? (deltaInsurance / 100000).toFixed(1) : 0} Lakhs
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Control Sliders & Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scenario Controls 1 */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Document &amp; Program Registrations</span>
          </h3>

          <div className="space-y-3.5">
            <label className="flex items-center justify-between p-3 bg-slate-900/70 border border-slate-700/80 rounded-xl cursor-pointer hover:border-slate-600 transition">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Register e-Shram 12-Digit UAN Card</span>
                <span className="text-[11px] text-slate-400">Unlocks accident insurance &amp; worker welfare</span>
              </div>
              <input
                type="checkbox"
                checked={simulatedProfile.hasEshramCard}
                onChange={() => handleToggle('hasEshramCard')}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-900/70 border border-slate-700/80 rounded-xl cursor-pointer hover:border-slate-600 transition">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Aadhaar Bank NPCI DBT Seeding</span>
                <span className="text-[11px] text-slate-400">Enables direct bank transfer payouts without rejection</span>
              </div>
              <input
                type="checkbox"
                checked={simulatedProfile.hasBankDBTEnabled}
                onChange={() => handleToggle('hasBankDBTEnabled')}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-900/70 border border-slate-700/80 rounded-xl cursor-pointer hover:border-slate-600 transition">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Join Women Self-Help Group (DAY-NRLM)</span>
                <span className="text-[11px] text-slate-400">Unlocks Revolving Fund, CIF grant &amp; 7% loans</span>
              </div>
              <input
                type="checkbox"
                checked={simulatedProfile.isShgMember}
                onChange={() => handleToggle('isShgMember')}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-900/70 border border-slate-700/80 rounded-xl cursor-pointer hover:border-slate-600 transition">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Acquire Kisan Credit Card (KCC)</span>
                <span className="text-[11px] text-slate-400">Unlocks 4% crop loan credit up to ₹3 Lakh</span>
              </div>
              <input
                type="checkbox"
                checked={simulatedProfile.hasKisanCreditCard}
                onChange={() => handleToggle('hasKisanCreditCard')}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-600"
              />
            </label>
          </div>
        </div>

        {/* Scenario Controls 2: Income & Family Life Events */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Socioeconomic &amp; Family Conditions</span>
          </h3>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200">Household Annual Income:</span>
              <span className="font-bold text-emerald-300">₹{simulatedProfile.annualHouseholdIncome.toLocaleString('en-IN')}/year</span>
            </div>
            <input
              type="range"
              min={30000}
              max={600000}
              step={10000}
              value={simulatedProfile.annualHouseholdIncome}
              onChange={(e) => handleIncomeSlider(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹30,000 (AAY/BPL)</span>
              <span>₹2.5 Lakh (OBC/SC Scholarship ceiling)</span>
              <span>₹6 Lakh</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 bg-slate-900/70 border border-slate-700/80 rounded-xl cursor-pointer hover:border-slate-600 transition">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Housing: Kutcha / Dilapidated Dwelling</span>
                <span className="text-[11px] text-slate-400">Tests PMAY-G ₹1.2 Lakh pucca housing grant</span>
              </div>
              <input
                type="checkbox"
                checked={simulatedProfile.housingType === 'Kutcha'}
                onChange={() => {
                  setSimulatedProfile(prev => ({
                    ...prev,
                    housingType: prev.housingType === 'Kutcha' ? 'Pucca' : 'Kutcha'
                  }));
                }}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-600"
              />
            </label>

            <button
              onClick={handleAddGirlChild}
              className="w-full text-left p-3 bg-slate-900/70 border border-slate-700/80 rounded-xl hover:border-purple-500/60 transition flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-purple-200 block">+ Add Daughter Under 10 Years</span>
                <span className="text-[11px] text-slate-400">Unlocks Sukanya Samriddhi 8.2% high yield savings</span>
              </div>
              <span className="text-xs font-bold text-purple-400 bg-purple-950/60 px-2 py-1 rounded-lg border border-purple-500/30">
                + Simulate
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Newly Unlocked Schemes in Simulation */}
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>Newly Unlocked Schemes Under This Scenario ({newlyUnlockedSchemes.length})</span>
        </h3>

        {newlyUnlockedSchemes.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl text-slate-400 text-xs">
            Toggle settings above (e.g. register on e-Shram, add a girl child, or adjust income) to preview unlocked schemes.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {newlyUnlockedSchemes.map((evaluation) => (
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
      </div>

    </div>
  );
};
