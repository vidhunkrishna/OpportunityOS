import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Search, Filter, AlertTriangle, CheckCircle2, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { fetchDiscoverOpportunities } from '../services/apiClient';
import OpportunityCard from '../components/opportunity/OpportunityCard';
import Skeleton from '../components/common/Skeleton';

export default function DiscoverPage() {
  const [data, setData] = useState({ eligible: [], ineligible: [], all: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('eligible'); // 'eligible' or 'ineligible'
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [mode, setMode] = useState('All');
  const [sortBy, setSortBy] = useState('matchScore'); // 'matchScore', 'deadline', 'title'

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchDiscoverOpportunities({ search, category, mode });
      setData(res);
    } catch (err) {
      console.error('Discover error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, category, mode]);

  const categories = ['All', 'Internship', 'Job', 'Hackathon', 'Research', 'Scholarship', 'Competition', 'Fellowship'];
  const modes = ['All', 'Remote', 'Hybrid', 'On-site'];

  // Sorting logic
  const sortList = (list) => {
    const arr = [...list];
    if (sortBy === 'matchScore') {
      return arr.sort((a, b) => b.matchScore - a.matchScore);
    }
    if (sortBy === 'deadline') {
      return arr.sort((a, b) => a.daysRemaining - b.daysRemaining);
    }
    if (sortBy === 'title') {
      return arr.sort((a, b) => a.opportunity.title.localeCompare(b.opportunity.title));
    }
    return arr;
  };

  const rawList = activeTab === 'eligible' ? data.eligible : data.ineligible;
  const displayedList = sortList(rawList);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-16 selection:bg-indigo-500 selection:text-white">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
          <Compass className="w-7 h-7 text-indigo-400" />
          Opportunity Discovery Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Real-time matched student opportunities filtered dynamically against your authenticated profile.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role title, company, or required skills (e.g. React, Docker)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Type:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-400">
            <span>Mode:</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {modes.map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="matchScore" className="bg-slate-900">Best Match %</option>
              <option value="deadline" className="bg-slate-900">Deadline Priority</option>
              <option value="title" className="bg-slate-900">Alphabetical</option>
            </select>
          </div>

        </div>
      </div>

      {/* Tab Switcher: Eligible vs Ineligible */}
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setActiveTab('eligible')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'eligible'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Eligible Opportunities ({data.eligible.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ineligible')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'ineligible'
              ? 'bg-rose-950 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Currently Ineligible ({data.ineligible.length})</span>
        </button>
      </div>

      {/* Opportunity Cards Grid (Spacious 3 Columns) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      ) : displayedList.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/90 border border-slate-800 text-slate-400 text-sm italic">
          No opportunities found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedList.map((item) => (
            <OpportunityCard key={item.opportunity.id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
}
