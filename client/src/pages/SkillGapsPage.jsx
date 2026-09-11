import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, AlertTriangle, CheckCircle2, BookOpenCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchRecommendedOpportunities, fetchStudentProfile } from '../services/apiClient';
import { useStudentProfile } from '../context/DemoStudentContext';
import Skeleton from '../components/common/Skeleton';
import Badge from '../components/common/Badge';

export default function SkillGapsPage() {
  const navigate = useNavigate();
  const { student } = useStudentProfile();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchRecommendedOpportunities();
        setData(res);
      } catch (err) {
        console.error('Skill gaps load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <Skeleton className="h-96 rounded-3xl max-w-5xl mx-auto" />;
  }

  const studentSkills = student?.skills || ['JavaScript', 'React', 'Node.js', 'REST APIs'];
  const topMatch = data?.topMatch;
  const recommended = data?.recommended || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 selection:bg-indigo-500 selection:text-white">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-indigo-400" />
          Skill Gap Analysis & Opportunity Requirements
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct side-by-side comparison of your verified skills against top opportunity requirements.
        </p>
      </div>

      {/* Primary Comparison Matrix */}
      {topMatch && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Target Role Benchmark: {topMatch.opportunity.organization}
              </span>
              <h2 className="text-xl font-black text-white">{topMatch.opportunity.title} ({topMatch.matchScore}% Match)</h2>
            </div>

            <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <span className="text-[11px] text-slate-400 font-medium block">Current Readiness</span>
              <span className="text-lg font-black text-white">{topMatch.readiness?.currentReadiness || 78}%</span>
            </div>
          </div>

          {/* Side by Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: YOUR SKILLS */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                YOUR VERIFIED SKILLS ({studentSkills.length})
              </h3>
              
              <div className="space-y-2">
                {studentSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-xs text-slate-200 border border-slate-800">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      {skill}
                    </span>
                    <Badge variant="emerald">Verified</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: OPPORTUNITY REQUIREMENTS */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                OPPORTUNITY REQUIREMENTS
              </h3>

              <div className="space-y-2">
                {/* Matched Required Skills */}
                {(topMatch.skillGap?.matchedRequired || []).map((skill, idx) => (
                  <div key={`m-${idx}`} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-xs text-slate-200 border border-slate-800">
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      {skill}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">MATCHED</span>
                  </div>
                ))}

                {/* Missing Required Skills */}
                {(topMatch.skillGap?.missingRequired || []).map((skill, idx) => (
                  <div key={`req-${idx}`} className="flex items-center justify-between p-2.5 rounded-xl bg-amber-950/40 text-xs text-amber-200 border border-amber-500/30">
                    <span className="font-bold flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ⚠ {skill} — Required
                    </span>
                    <button
                      onClick={() => navigate(`/opportunities/${topMatch.opportunity.id}`)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition-colors"
                    >
                      Prepare this skill →
                    </button>
                  </div>
                ))}

                {/* Missing Preferred Skills */}
                {(topMatch.skillGap?.missingPreferred || []).map((skill, idx) => (
                  <div key={`pref-${idx}`} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-xs text-slate-400 border border-slate-800">
                    <span className="font-medium flex items-center gap-2">
                      <span>○</span>
                      {skill} — Preferred
                    </span>
                    <span className="text-[10px] text-slate-500">OPTIONAL</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action CTA */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-xs text-indigo-300 uppercase tracking-wider block mb-1">Recommended Next Action</span>
              <p className="text-xs text-slate-200">
                {(topMatch.skillGap?.missingRequired?.length || 0) > 0 ? (
                  <>Building readiness for <strong>{topMatch.skillGap.missingRequired[0]}</strong> unlocks readiness gain across {recommended.length} matched roles.</>
                ) : (topMatch.skillGap?.missingPreferred?.length || 0) > 0 ? (
                  <>Learning preferred skill <strong>{topMatch.skillGap.missingPreferred[0]}</strong> enhances your competitive edge for {topMatch.opportunity.organization}.</>
                ) : (
                  <>You satisfy all core skill requirements for <strong>{topMatch.opportunity.organization}</strong>! Your profile is highly competitive.</>
                )}
              </p>
            </div>

            <Link
              to={`/opportunities/${topMatch.opportunity.id}`}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <BookOpenCheck className="w-4 h-4" />
              <span>Prepare This Skill Now</span>
            </Link>
          </div>

        </motion.div>
      )}

    </div>
  );
}
