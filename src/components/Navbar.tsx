import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  User, 
  FileText, 
  Globe, 
  HelpCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { CitizenProfile, PersonaPreset } from '../types';
import { SAMPLE_PERSONAS } from '../data/schemesDatabase';

interface NavbarProps {
  activeProfile: CitizenProfile;
  onSelectPersona: (preset: PersonaPreset) => void;
  onOpenProfileEditor: () => void;
  onOpenReportModal: () => void;
  activeTab: 'missed-benefits' | 'all-schemes' | 'simulator' | 'ai-advisor' | 'document-checker';
  onSelectTab: (tab: 'missed-benefits' | 'all-schemes' | 'simulator' | 'ai-advisor' | 'document-checker') => void;
  language: string;
  onSelectLanguage: (lang: string) => void;
  unclaimedValue: number;
  missedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeProfile,
  onSelectPersona,
  onOpenProfileEditor,
  onOpenReportModal,
  activeTab,
  onSelectTab,
  language,
  onSelectLanguage,
  unclaimedValue,
  missedCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Notification / Stats Banner */}
      <div className="bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-indigo-900/80 px-4 py-1.5 text-xs text-slate-200 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-emerald-300">AI Welfare Intelligence Radar:</span>
          <span>Verified against 32+ Central & State welfare initiatives, Direct Benefit Transfer (DBT) mandates & NSAP rules</span>
        </div>
        
        {missedCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded text-amber-200 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>₹{unclaimedValue.toLocaleString('en-IN')} Unclaimed Benefit Detected for {activeProfile.fullName}</span>
          </div>
        )}
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl tracking-wider border border-white/20">
              YS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                  YojanaSetu <span className="text-emerald-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">AI</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Government Scheme Eligibility & Missed-Benefit Detector
              </p>
            </div>
          </div>

          {/* Persona Quick Selector */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" /> Quick Persona:
            </span>
            {SAMPLE_PERSONAS.map(p => {
              const isSelected = activeProfile.id === p.profile.id;
              return (
                <button
                  key={p.id}
                  id={`btn-persona-${p.id}`}
                  onClick={() => onSelectPersona(p)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`${p.label} - ${p.role}`}
                >
                  <span>{p.avatar}</span>
                  <span>{p.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                id="select-language"
                value={language}
                onChange={(e) => onSelectLanguage(e.target.value)}
                aria-label="Select Language"
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="English" className="bg-slate-800 text-white">English</option>
                <option value="Hindi" className="bg-slate-800 text-white">हिन्दी (Hindi)</option>
                <option value="Telugu" className="bg-slate-800 text-white">తెలుగు (Telugu)</option>
                <option value="Tamil" className="bg-slate-800 text-white">தமிழ் (Tamil)</option>
                <option value="Bengali" className="bg-slate-800 text-white">বাংলা (Bengali)</option>
                <option value="Marathi" className="bg-slate-800 text-white">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Profile Edit Button */}
            <button
              id="btn-edit-citizen-profile"
              onClick={onOpenProfileEditor}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Citizen Profile:</span>
              <span className="text-emerald-300 truncate max-w-[90px]">{activeProfile.fullName.split(' ')[0]}</span>
            </button>

            {/* Print / Export Report Button */}
            <button
              id="btn-export-audit-report"
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm shadow-emerald-600/30"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Audit Report</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none text-xs">
          <button
            id="tab-missed-benefits"
            onClick={() => onSelectTab('missed-benefits')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'missed-benefits'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Missed Benefit Audit</span>
            {missedCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {missedCount} Missed
              </span>
            )}
          </button>

          <button
            id="tab-all-schemes"
            onClick={() => onSelectTab('all-schemes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'all-schemes'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <span>Scheme Catalog & Explorer</span>
          </button>

          <button
            id="tab-simulator"
            onClick={() => onSelectTab('simulator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'simulator'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>What-If Welfare Simulator</span>
          </button>

          <button
            id="tab-ai-advisor"
            onClick={() => onSelectTab('ai-advisor')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'ai-advisor'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>AI Scheme Advisor (Ask AI)</span>
          </button>

          <button
            id="tab-document-checker"
            onClick={() => onSelectTab('document-checker')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'document-checker'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>AI Document & Blocker Scanner</span>
          </button>
        </div>

      </div>
    </header>
  );
};
