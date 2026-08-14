import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  HelpCircle, 
  Layers,
  Sparkles
} from 'lucide-react';
import { GovernmentScheme, EvaluationResult, SchemeCategory, BenefitType } from '../types';
import { ALL_SCHEMES } from '../data/schemesDatabase';
import { SchemeCard } from './SchemeCard';

interface SchemeCatalogTabProps {
  evaluations: EvaluationResult[];
  onOpenSchemeDetails: (scheme: GovernmentScheme) => void;
  onToggleClaimed: (schemeId: string) => void;
  onAskAIAboutScheme: (scheme: GovernmentScheme) => void;
}

export const SchemeCatalogTab: React.FC<SchemeCatalogTabProps> = ({
  evaluations,
  onOpenSchemeDetails,
  onToggleClaimed,
  onAskAIAboutScheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedBenefitType, setSelectedBenefitType] = useState<string>('ALL');

  const categories: SchemeCategory[] = [
    'Health & Insurance',
    'Agriculture & Farmers',
    'Housing & Sanitation',
    'Financial & Livelihoods',
    'Education & Scholarships',
    'Women & Child Welfare',
    'Social Security & Pensions',
    'Skill & Entrepreneurship'
  ];

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(e => {
      // Search
      const text = `${e.scheme.name} ${e.scheme.hindiName || ''} ${e.scheme.acronym || ''} ${e.scheme.ministry} ${e.scheme.summary}`.toLowerCase();
      if (searchQuery && !text.includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && e.scheme.category !== selectedCategory) {
        return false;
      }

      // Status
      if (selectedStatus === 'MISSED' && e.status !== 'ELIGIBLE_UNCLAIMED') return false;
      if (selectedStatus === 'CLAIMED' && e.status !== 'ALREADY_RECEIVING') return false;
      if (selectedStatus === 'PARTIAL' && e.status !== 'PARTIALLY_ELIGIBLE') return false;
      if (selectedStatus === 'ELIGIBLE' && (e.status !== 'ELIGIBLE_UNCLAIMED' && e.status !== 'ALREADY_RECEIVING')) return false;

      // Benefit Type
      if (selectedBenefitType !== 'ALL' && e.scheme.benefitType !== selectedBenefitType) {
        return false;
      }

      return true;
    });
  }, [evaluations, searchQuery, selectedCategory, selectedStatus, selectedBenefitType]);

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, acronym, ministry, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none text-xs">
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedStatus === 'ALL'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Schemes ({evaluations.length})
            </button>

            <button
              onClick={() => setSelectedStatus('MISSED')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                selectedStatus === 'MISSED'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-amber-300 hover:bg-slate-700'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Missed ({evaluations.filter(e => e.status === 'ELIGIBLE_UNCLAIMED').length})</span>
            </button>

            <button
              onClick={() => setSelectedStatus('CLAIMED')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                selectedStatus === 'CLAIMED'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-900 text-emerald-300 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Claimed ({evaluations.filter(e => e.status === 'ALREADY_RECEIVING').length})</span>
            </button>

            <button
              onClick={() => setSelectedStatus('PARTIAL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                selectedStatus === 'PARTIAL'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-900 text-indigo-300 hover:bg-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Partial ({evaluations.filter(e => e.status === 'PARTIALLY_ELIGIBLE').length})</span>
            </button>
          </div>

        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-700/60 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition ${
              selectedCategory === 'ALL'
                ? 'bg-slate-200 text-slate-900 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-slate-400">
            Showing <strong className="text-slate-200">{filteredEvaluations.length}</strong> welfare schemes
          </div>
        </div>

        {filteredEvaluations.length === 0 ? (
          <div className="p-12 text-center bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl text-slate-400 text-xs">
            No schemes found matching the selected filters or search terms. Try clearing filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvaluations.map((evaluation) => (
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
