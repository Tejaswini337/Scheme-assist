import React from 'react';
import { 
  User, 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Users, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle,
  CreditCard,
  Home
} from 'lucide-react';
import { CitizenProfile } from '../types';

interface ProfileOverviewBarProps {
  profile: CitizenProfile;
  onOpenEdit: () => void;
}

export const ProfileOverviewBar: React.FC<ProfileOverviewBarProps> = ({ profile, onOpenEdit }) => {
  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Citizen Identity */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-emerald-900/40 shrink-0">
            {profile.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{profile.fullName}</h2>
              <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full font-medium">
                {profile.age} yrs • {profile.gender}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-semibold">
                {profile.casteCategory}
              </span>
              {profile.isBPL && (
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs px-2 py-0.5 rounded-full font-bold">
                  BPL Beneficiary
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {profile.district}, {profile.state} ({profile.area})
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                {profile.occupation}
              </span>
              <span className="flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                ₹{profile.annualHouseholdIncome.toLocaleString('en-IN')}/year
              </span>
              {profile.familyMembers.length > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  {profile.familyMembers.length} Family Dependents
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Readiness Badges & Edit Button */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-700/60">
          {/* DBT Status */}
          <div 
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
              profile.hasBankDBTEnabled
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
            }`}
            title={profile.hasBankDBTEnabled ? 'Bank account is linked with Aadhaar NPCI for direct benefit transfer' : 'Aadhaar DBT seeding needed'}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>DBT: {profile.hasBankDBTEnabled ? 'Active' : 'Unseeded'}</span>
          </div>

          {/* Housing Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border bg-slate-700/50 border-slate-600 text-slate-300">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>House: {profile.housingType}</span>
          </div>

          {/* Edit Profile Button */}
          <button
            id="btn-open-profile-modal-bar"
            onClick={onOpenEdit}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm ml-auto lg:ml-2"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Citizen Data</span>
          </button>
        </div>

      </div>
    </div>
  );
};
