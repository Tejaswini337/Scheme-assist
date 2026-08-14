import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  FileText,
  CreditCard,
  MapPin,
  Users
} from 'lucide-react';
import { CitizenProfile, MissedBenefitAudit } from '../types';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CitizenProfile;
  audit: MissedBenefitAudit;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  audit,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Header (Hidden on print) */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Government Welfare &amp; Missed-Benefit Audit Dossier</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div ref={reportRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 print:text-slate-900 print:p-8 bg-slate-900 print:bg-white">
          
          {/* Official Dossier Header */}
          <div className="border-b-2 border-emerald-600 pb-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xl font-black text-white print:text-slate-900 tracking-tight flex items-center gap-2">
                  <span>YojanaSetu AI</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 print:text-emerald-800 border border-emerald-500/30 rounded font-semibold">
                    Official Audit Dossier
                  </span>
                </div>
                <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                  National Welfare Entitlement &amp; Direct Benefit Transfer Verification System
                </p>
              </div>

              <div className="text-right text-xs text-slate-400 print:text-slate-600">
                <div>Audit Ref: <strong className="text-slate-200 print:text-slate-900">YS-{profile.id.toUpperCase()}-{new Date().getFullYear()}</strong></div>
                <div>Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>
          </div>

          {/* Citizen Summary Box */}
          <div className="bg-slate-800/80 print:bg-slate-50 border border-slate-700 print:border-slate-300 rounded-2xl p-5 text-xs">
            <h4 className="font-bold text-emerald-400 print:text-emerald-800 text-xs uppercase tracking-wider mb-3">
              Citizen Socioeconomic Parameters
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-300 print:text-slate-700">
              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px]">Beneficiary Name</span>
                <span className="font-bold text-white print:text-black">{profile.fullName}</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px]">Age &amp; Gender</span>
                <span className="font-semibold">{profile.age} yrs • {profile.gender}</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px]">Location</span>
                <span className="font-semibold">{profile.district}, {profile.state} ({profile.area})</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px]">Social Category</span>
                <span className="font-semibold">{profile.casteCategory}</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px]">Occupation</span>
                <span className="font-semibold">{profile.occupation}</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px]">Household Annual Income</span>
                <span className="font-bold text-amber-300 print:text-amber-800">₹{profile.annualHouseholdIncome.toLocaleString('en-IN')}/yr</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px]">Ration Card</span>
                <span className="font-semibold">{profile.rationCard}</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px]">Bank DBT Status</span>
                <span className={`font-semibold ${profile.hasBankDBTEnabled ? 'text-emerald-400 print:text-emerald-700' : 'text-amber-400 print:text-amber-700'}`}>
                  {profile.hasBankDBTEnabled ? 'NPCI Active' : 'Unseeded'}
                </span>
              </div>
            </div>
          </div>

          {/* Audit Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-amber-950/30 print:bg-amber-50 border border-amber-500/40 print:border-amber-300 rounded-2xl">
              <span className="text-[10px] text-amber-400 print:text-amber-800 font-bold uppercase">Unclaimed Annual Value</span>
              <div className="text-xl sm:text-2xl font-black text-amber-300 print:text-amber-900 mt-1">
                ₹{audit.totalUnclaimedAnnualValue.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400 print:text-slate-600">{audit.missedSchemeCount} Missed Schemes</span>
            </div>

            <div className="p-4 bg-teal-950/30 print:bg-teal-50 border border-teal-500/40 print:border-teal-300 rounded-2xl">
              <span className="text-[10px] text-teal-400 print:text-teal-800 font-bold uppercase">Insurance Coverage</span>
              <div className="text-xl sm:text-2xl font-black text-teal-300 print:text-teal-900 mt-1">
                ₹{(audit.totalUnclaimedInsuranceCover / 100000).toFixed(1)} Lakhs
              </div>
              <span className="text-[10px] text-slate-400 print:text-slate-600">Health &amp; Life Safety</span>
            </div>

            <div className="p-4 bg-emerald-950/30 print:bg-emerald-50 border border-emerald-500/40 print:border-emerald-300 rounded-2xl">
              <span className="text-[10px] text-emerald-400 print:text-emerald-800 font-bold uppercase">Currently Claimed</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 print:text-emerald-900 mt-1">
                {audit.alreadyClaimedSchemeCount} Schemes
              </div>
              <span className="text-[10px] text-slate-400 print:text-slate-600">Active Direct Entitlements</span>
            </div>
          </div>

          {/* List of Missed Schemes */}
          <div>
            <h4 className="text-sm font-bold text-white print:text-black mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 print:text-amber-700" />
              <span>Prioritized Missed Welfare Schemes to Claim</span>
            </h4>

            <div className="space-y-3">
              {audit.missedSchemes.map((ev, i) => (
                <div 
                  key={ev.scheme.id}
                  className="p-3.5 bg-slate-800/60 print:bg-slate-50 border border-slate-700 print:border-slate-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white print:text-black text-sm">
                      {i + 1}. {ev.scheme.name} {ev.scheme.acronym ? `(${ev.scheme.acronym})` : ''}
                    </div>
                    <p className="text-slate-400 print:text-slate-600 mt-0.5">{ev.scheme.summary}</p>
                    <div className="text-[11px] text-slate-300 print:text-slate-700 mt-1">
                      <strong>Ministry: </strong> {ev.scheme.ministry} • <strong>Helpline: </strong> {ev.scheme.helplineNumber}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-emerald-400 print:text-emerald-800">
                      {ev.scheme.valueDisplay}
                    </div>
                    <div className="text-[10px] text-slate-400 print:text-slate-500">
                      100% Eligible
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Steps & Official Links */}
          <div className="border-t border-slate-800 print:border-slate-300 pt-4 text-[11px] text-slate-400 print:text-slate-600">
            <h5 className="font-bold text-slate-300 print:text-slate-800 mb-1">Recommended Application Steps:</h5>
            <ol className="list-decimal list-inside space-y-1">
              <li>Visit nearest Common Service Center (CSC / Jan Seva Kendra) or official state portal.</li>
              <li>Carry Original Aadhaar, Bank Passbook (NPCI DBT linked), and relevant caste/income certificates.</li>
              <li>Do not pay unauthorized intermediary commission fees. All government scheme registrations are subsidized.</li>
            </ol>
          </div>

        </div>

      </div>
    </div>
  );
};
