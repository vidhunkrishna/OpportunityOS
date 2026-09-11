import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Kanban, ArrowRight, Building, CheckCircle2, Bookmark, Clock, ChevronRight } from 'lucide-react';
import { fetchApplications, updateApplicationStatusApi } from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import { Link } from 'react-router-dom';

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApplications();
      setApps(res);
    } catch (err) {
      console.error('Applications load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (opportunityId, newStatus) => {
    try {
      await updateApplicationStatusApi(opportunityId, newStatus);
      setApps(prev => prev.map(a => a.opportunityId === opportunityId ? { ...a, status: newStatus } : a));
      addToast(`Application status moved to ${newStatus}!`, 'success');
    } catch (err) {
      console.error('Status change error:', err);
    }
  };

  const columns = [
    { key: 'SAVED', title: '1. SAVED', subtitle: 'Bookmarked opportunities', color: 'border-slate-800 bg-slate-900/60' },
    { key: 'PREPARING', title: '2. PREPARING', subtitle: '7-Day roadmap active', color: 'border-indigo-500/40 bg-indigo-950/20' },
    { key: 'APPLIED', title: '3. APPLIED', subtitle: 'Application submitted', color: 'border-emerald-500/40 bg-emerald-950/20' },
    { key: 'COMPLETED', title: '4. COMPLETED', subtitle: 'Accepted or finalized', color: 'border-purple-500/40 bg-purple-950/20' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 selection:bg-indigo-500 selection:text-white">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Kanban className="w-6 h-6 text-indigo-400" />
          Application Lifecycle Tracker
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Lifecycle: <strong className="text-white">SAVED → PREPARING → APPLIED → COMPLETED / REJECTED</strong>
        </p>
      </div>

      {/* Progress Flow Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs font-semibold">
        <span className="text-slate-400 shrink-0">Lifecycle Pipeline:</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">SAVED</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-3 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/30">PREPARING</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30">APPLIED</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-3 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-500/30">COMPLETED</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {columns.map(col => {
            const colApps = apps.filter(a => a.status === col.key);
            return (
              <div key={col.key} className={`p-4 rounded-3xl border ${col.color} min-w-[240px] flex flex-col`}>
                <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
                  <div>
                    <span className="font-extrabold text-xs text-white tracking-wider block">{col.title}</span>
                    <span className="text-[10px] text-slate-500">{col.subtitle}</span>
                  </div>
                  <span className="w-6 h-6 rounded-xl bg-slate-950 text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-800">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 mt-2">
                  {colApps.map(app => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 space-y-3 shadow-md"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{app.opportunity.category}</span>
                        <span className="text-[11px] font-extrabold text-emerald-400">{app.matchScore}% Match</span>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-white leading-snug">{app.opportunity.title}</h4>
                        <p className="text-[11px] text-slate-400">{app.opportunity.organization}</p>
                      </div>

                      {/* Status Selector */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.opportunityId, e.target.value)}
                          className="bg-slate-950 text-[10px] font-bold text-slate-300 border border-slate-700 rounded-lg px-2 py-1.5 focus:outline-none"
                        >
                          <option value="SAVED">SAVED</option>
                          <option value="PREPARING">PREPARING</option>
                          <option value="APPLIED">APPLIED</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>

                        <Link
                          to={`/opportunities/${app.opportunityId}`}
                          className="text-[11px] font-bold text-indigo-400 hover:underline flex items-center gap-0.5"
                        >
                          View
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}

                  {colApps.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-950/40 rounded-2xl border border-slate-800/60">
                      No applications in {col.title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
