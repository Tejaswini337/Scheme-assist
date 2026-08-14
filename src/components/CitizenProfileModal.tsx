import React, { useState } from 'react';
import { 
  X, 
  User, 
  Users, 
  MapPin, 
  Briefcase, 
  Home, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  IndianRupee,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { 
  CitizenProfile, 
  Gender, 
  CasteCategory, 
  AreaType, 
  MaritalStatus, 
  RationCardType, 
  HousingType, 
  OccupationType, 
  FamilyMember 
} from '../types';
import { INDIAN_STATES, ALL_SCHEMES } from '../data/schemesDatabase';

interface CitizenProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CitizenProfile;
  onSaveProfile: (updated: CitizenProfile) => void;
}

export const CitizenProfileModal: React.FC<CitizenProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<CitizenProfile>({ ...profile });
  const [activeFormTab, setActiveFormTab] = useState<'demographics' | 'income-housing' | 'occupation' | 'family' | 'claimed-schemes'>('demographics');

  if (!isOpen) return null;

  const handleTextChange = (field: keyof CitizenProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddFamilyMember = () => {
    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: '',
      relationship: 'Daughter',
      age: 8,
      gender: 'Female',
      occupation: 'Student / Youth',
      isStudent: true,
      educationLevel: 'School (1-8)'
    };
    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember]
    }));
  };

  const handleRemoveFamilyMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter(m => m.id !== id)
    }));
  };

  const handleFamilyMemberChange = (id: string, field: keyof FamilyMember, val: any) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map(m => m.id === id ? { ...m, [field]: val } : m)
    }));
  };

  const toggleClaimedScheme = (schemeId: string) => {
    setFormData(prev => {
      const exists = prev.claimedSchemeIds.includes(schemeId);
      return {
        ...prev,
        claimedSchemeIds: exists
          ? prev.claimedSchemeIds.filter(id => id !== schemeId)
          : [...prev.claimedSchemeIds, schemeId]
      };
    });
  };

  const handleSave = () => {
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Citizen & Household Profiler</h2>
              <p className="text-xs text-slate-400">Configure parameters for precision eligibility matching and missed-benefit detection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-6 gap-2 overflow-x-auto text-xs py-2 scrollbar-none">
          <button
            onClick={() => setActiveFormTab('demographics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeFormTab === 'demographics'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Demographics & State
          </button>
          <button
            onClick={() => setActiveFormTab('income-housing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeFormTab === 'income-housing'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Income, Ration & Housing
          </button>
          <button
            onClick={() => setActiveFormTab('occupation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeFormTab === 'occupation'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Occupation & Cards
          </button>
          <button
            onClick={() => setActiveFormTab('family')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeFormTab === 'family'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Family Members ({formData.familyMembers.length})
          </button>
          <button
            onClick={() => setActiveFormTab('claimed-schemes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeFormTab === 'claimed-schemes'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5. Active Benefits ({formData.claimedSchemeIds.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-200 flex-1">
          
          {/* TAB 1: Demographics */}
          {activeFormTab === 'demographics' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleTextChange('fullName', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Age (Years)</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={formData.age}
                  onChange={(e) => handleTextChange('age', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleTextChange('gender', e.target.value as Gender)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Social Category / Caste</label>
                <select
                  value={formData.casteCategory}
                  onChange={(e) => handleTextChange('casteCategory', e.target.value as CasteCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="MINORITY">Minority (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)</option>
                  <option value="GENERAL">General / Unreserved</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">State / UT</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleTextChange('state', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {INDIAN_STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">District / City</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleTextChange('district', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Area Type</label>
                <select
                  value={formData.area}
                  onChange={(e) => handleTextChange('area', e.target.value as AreaType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Rural">Rural (Panchayat Village)</option>
                  <option value="Urban">Urban (Municipal Corporation / Municipality)</option>
                  <option value="Semi-Urban">Semi-Urban / Peri-urban</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Marital Status</label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => handleTextChange('maritalStatus', e.target.value as MaritalStatus)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Single">Single / Unmarried</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Deserted">Deserted / Abandoned</option>
                </select>
              </div>

              {/* Vulnerability flags */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-800 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isDifferentlyAbled}
                    onChange={(e) => handleTextChange('isDifferentlyAbled', e.target.checked)}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
                  />
                  <span>Differently Abled / Divyangjan (PwD)</span>
                </label>

                {formData.isDifferentlyAbled && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Disability %:</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.disabilityPercentage || 40}
                      onChange={(e) => handleTextChange('disabilityPercentage', parseInt(e.target.value) || 0)}
                      className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isSingleMotherOrWidow}
                    onChange={(e) => handleTextChange('isSingleMotherOrWidow', e.target.checked)}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
                  />
                  <span>Single Mother / Destitute Widow</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Income & Housing */}
          {activeFormTab === 'income-housing' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Annual Household Income (₹ INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₹</span>
                  <input
                    type="number"
                    value={formData.annualHouseholdIncome}
                    onChange={(e) => handleTextChange('annualHouseholdIncome', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Total combined yearly income from all sources</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Ration Card Category</label>
                <select
                  value={formData.rationCard}
                  onChange={(e) => handleTextChange('rationCard', e.target.value as RationCardType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="AAY">Antyodaya Anna Yojana (AAY - Yellow/Poorest)</option>
                  <option value="BPL_PHH">Priority Household (BPL / PHH - Pink/Red)</option>
                  <option value="APL_NPHH">Non-Priority (APL / NPHH - White)</option>
                  <option value="NONE">No Ration Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Dwelling / Housing Condition</label>
                <select
                  value={formData.housingType}
                  onChange={(e) => handleTextChange('housingType', e.target.value as HousingType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Kutcha">Kutcha (Mud / Thatched / Unplastered)</option>
                  <option value="Semi-Pucca">Semi-Pucca (Partial brick/tin roof)</option>
                  <option value="Pucca">Pucca (Reinforced concrete)</option>
                  <option value="Homeless">Homeless / Temporary Shelter</option>
                  <option value="Rented">Rented Room / Tenement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Agricultural Landholding (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.landholdingAcres}
                  onChange={(e) => handleTextChange('landholdingAcres', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Enter 0 if landless</p>
              </div>

              {/* Toggles */}
              <div className="sm:col-span-2 space-y-3 pt-3 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.hasBankDBTEnabled}
                    onChange={(e) => handleTextChange('hasBankDBTEnabled', e.target.checked)}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
                  />
                  <div>
                    <span className="font-semibold text-emerald-300">Aadhaar Bank NPCI DBT Enabled</span>
                    <p className="text-slate-400 text-[11px]">Bank account is mapped with NPCI for direct welfare cash transfers</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.hasLPGConnection}
                    onChange={(e) => handleTextChange('hasLPGConnection', e.target.checked)}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
                  />
                  <span>Has active LPG Gas cylinder connection</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.hasPuccaToilet}
                    onChange={(e) => handleTextChange('hasPuccaToilet', e.target.checked)}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
                  />
                  <span>Has individual household hygienic toilet</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: Occupation */}
          {activeFormTab === 'occupation' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Primary Occupation Category</label>
                <select
                  value={formData.occupation}
                  onChange={(e) => handleTextChange('occupation', e.target.value as OccupationType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Small / Marginal Farmer">Small / Marginal Farmer (Land &lt; 5 acres)</option>
                  <option value="Farmer">Farmer (Medium / Large)</option>
                  <option value="Agricultural Labourer">Agricultural Labourer (Landless)</option>
                  <option value="Traditional Artisan / Craftsperson">Traditional Artisan / Craftsperson (Carpenter, Potter, Weaver, etc.)</option>
                  <option value="Street Vendor">Street Vendor / Hawkers / Thela Cart</option>
                  <option value="Construction Worker">Construction Worker / Daily Wage</option>
                  <option value="Gig / Platform / Domestic Worker">Gig / Delivery / Domestic Worker / Driver</option>
                  <option value="Women Entrepreneur / SHG Member">Women Entrepreneur / Self-Help Group Member</option>
                  <option value="Student / Youth">Student / Pursuing Education</option>
                  <option value="Unemployed Youth">Unemployed Youth</option>
                  <option value="Senior Citizen / Retired">Senior Citizen / Retired</option>
                  <option value="Small Business Owner / MSME">Small Business Owner / Shopkeeper</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Other">Other Unorganized Trade</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Specific Trade (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Carpenter, Potter, Fruit Seller, Mason"
                  value={formData.specificTrade || ''}
                  onChange={(e) => handleTextChange('specificTrade', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Student specific fields */}
              {formData.occupation === 'Student / Youth' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Education Level</label>
                  <select
                    value={formData.educationLevel || 'Undergraduate'}
                    onChange={(e) => handleTextChange('educationLevel', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="School (1-8)">School (Class 1-8)</option>
                    <option value="Secondary (9-10)">Secondary (Class 9-10)</option>
                    <option value="Higher Secondary (11-12)">Higher Secondary (Class 11-12)</option>
                    <option value="Diploma/Polytechnic">Diploma / Polytechnic</option>
                    <option value="Undergraduate">Undergraduate (B.Tech, B.Sc, B.Com, B.A)</option>
                    <option value="Postgraduate">Postgraduate / Professional</option>
                  </select>
                </div>
              )}

              {/* Registrations check */}
              <div className="sm:col-span-2 space-y-3 pt-3 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.hasEshramCard}
                    onChange={(e) => handleTextChange('hasEshramCard', e.target.checked)}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
                  />
                  <span>Has registered e-Shram 12-digit UAN Card</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.hasKisanCreditCard}
                    onChange={(e) => handleTextChange('hasKisanCreditCard', e.target.checked)}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
                  />
                  <span>Has active Kisan Credit Card (KCC)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isShgMember}
                    onChange={(e) => handleTextChange('isShgMember', e.target.checked)}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
                  />
                  <span>Member of Women Self-Help Group (DAY-NRLM SHG)</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: Family Members */}
          {activeFormTab === 'family' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Adding family members enables the AI to detect child scholarships, girl child schemes (SSY), maternal benefits (PMMVY), and senior pensions.
                </p>
                <button
                  type="button"
                  onClick={handleAddFamilyMember}
                  className="flex items-center gap-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>

              {formData.familyMembers.length === 0 ? (
                <div className="p-8 text-center bg-slate-800/40 border border-dashed border-slate-700 rounded-xl text-slate-400 text-xs">
                  No family members added yet. Click &quot;Add Member&quot; to include spouse, children, or parents.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.familyMembers.map((member) => (
                    <div key={member.id} className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Member Name"
                          value={member.name}
                          onChange={(e) => handleFamilyMemberChange(member.id, 'name', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-medium flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFamilyMember(member.id)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400">Relationship</span>
                          <select
                            value={member.relationship}
                            onChange={(e) => handleFamilyMemberChange(member.id, 'relationship', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white mt-0.5"
                          >
                            <option value="Spouse">Spouse</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Son">Son</option>
                            <option value="Mother">Mother</option>
                            <option value="Father">Father</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Other Dependent">Other Dependent</option>
                          </select>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400">Age</span>
                          <input
                            type="number"
                            min={0}
                            max={120}
                            value={member.age}
                            onChange={(e) => handleFamilyMemberChange(member.id, 'age', parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white mt-0.5"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400">Gender</span>
                          <select
                            value={member.gender}
                            onChange={(e) => handleFamilyMemberChange(member.id, 'gender', e.target.value as Gender)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white mt-0.5"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Transgender">Transgender</option>
                          </select>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400">Status</span>
                          <div className="flex items-center gap-2 mt-1">
                            <label className="flex items-center gap-1 text-[11px]">
                              <input
                                type="checkbox"
                                checked={member.isStudent || false}
                                onChange={(e) => handleFamilyMemberChange(member.id, 'isStudent', e.target.checked)}
                                className="rounded text-emerald-600 bg-slate-900"
                              />
                              <span>Student</span>
                            </label>

                            {member.gender === 'Female' && member.age >= 18 && (
                              <label className="flex items-center gap-1 text-[11px]">
                                <input
                                  type="checkbox"
                                  checked={member.isPregnantOrLactating || false}
                                  onChange={(e) => handleFamilyMemberChange(member.id, 'isPregnantOrLactating', e.target.checked)}
                                  className="rounded text-emerald-600 bg-slate-900"
                                />
                                <span>Pregnant/New Mom</span>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Active Claimed Schemes */}
          {activeFormTab === 'claimed-schemes' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Check any schemes this household is <strong className="text-slate-200">already actively receiving</strong>. Unchecked eligible schemes will be flagged as <strong className="text-amber-400 font-bold">Unclaimed Missed Benefits</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {ALL_SCHEMES.map(scheme => {
                  const isChecked = formData.claimedSchemeIds.includes(scheme.id);
                  return (
                    <div
                      key={scheme.id}
                      onClick={() => toggleClaimedScheme(scheme.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div
                        className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-900 pointer-events-none"
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-white">{scheme.acronym || scheme.name}</div>
                        <div className="text-[11px] text-slate-400">{scheme.valueDisplay}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>

          <button
            type="button"
            id="btn-save-citizen-profile"
            onClick={handleSave}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply & Recalculate Missed Benefits</span>
          </button>
        </div>

      </div>
    </div>
  );
};
