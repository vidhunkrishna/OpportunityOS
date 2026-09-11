import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  BookOpenCheck, 
  Bookmark, 
  Flame,
  CheckSquare,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { 
  fetchOpportunityById, 
  generatePreparationPlanApi, 
  togglePreparationTaskApi, 
  updateApplicationStatusApi 
} from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import ScoreRing from '../components/common/ScoreRing';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';

export default function OpportunityDetailPage({ onOpenAI }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [prepPlan, setPrepPlan] = useState(null);
  const [prepProgress, setPrepProgress] = useState(0);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [appStatus, setAppStatus] = useState(null);

  const loadDetail = async () => {
    try {
      setLoading(true);
      const res = await fetchOpportunityById(id);
      setItem(res);
      setAppStatus(res.applicationStatus);
      if (res.preparationPlan) {
        setPrepPlan(res.preparationPlan);
        const completed = res.preparationPlan.tasks.filter(t => t.isCompleted).length;
        const total = res.preparationPlan.tasks.length;
        setPrepProgress(total > 0 ? Math.round((completed / total) * 100) : 0);
      }
    } catch (err) {
      console.error('Fetch detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  const handleGeneratePlan = async () => {
    try {
      setGeneratingPlan(true);
      const res = await generatePreparationPlanApi(id);
      setPrepPlan(res.plan);
      setPrepProgress(res.progressPercentage);
      setAppStatus('PREPARING');
      addToast('Personalized 7-Day Preparation Roadmap Created!', 'success');
    } catch (err) {
      console.error('Failed to generate plan:', err);
      addToast('Failed to generate plan.', 'warning');
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleToggleTask = async (taskId, currentCompleted) => {
    try {
      const res = await togglePreparationTaskApi(taskId, !currentCompleted);
      setPrepPlan(prev => {
        if (!prev) return null;
        const updatedTasks = prev.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !currentCompleted } : t);
        return { ...prev, tasks: updatedTasks };
      });
      setPrepProgress(res.progressPercentage);
      addToast(`Task ${!currentCompleted ? 'completed' : 'updated'}! Progress: ${res.progressPercentage}%`, 'info');
    } catch (err) {
      console.error('Task toggle error:', err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateApplicationStatusApi(id, newStatus);
      setAppStatus(newStatus);
      addToast(`Application status updated to ${newStatus}!`, 'success');
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!item) return <div className="text-slate-400 p-8 text-center">Opportunity details unavailable.</div>;

  const {
    opportunity,
    eligibility,
    matchScore,
    breakdown,
    priority,
    readiness,
    skillGap,
    whyMatches,
    daysRemaining
  } = item;

  const isEligible = eligibility?.eligible;
  const currentReadiness = readiness?.currentReadiness || 78;
  const potentialReadiness = readiness?.potentialReadiness || 86;
  const readinessGain = Math.max(0, potentialReadiness - currentReadiness);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 selection:bg-indigo-500 selection:text-white">
      
      {/* Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </button>

      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 lg:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6"
      >
        {/* Metadata Row */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
            <span>Source: <strong className="text-slate-200">{opportunity.source}</strong></span>
            <span>•</span>
            <span>Last Updated: <strong className="text-slate-200">{opportunity.lastUpdated}</strong></span>
            {opportunity.isVerified && (
              <>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ✓ Recently Verified
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="indigo">{opportunity.category}</Badge>
            <Badge variant="slate">{opportunity.mode}</Badge>
            {priority?.bucket === 'PRIORITY' && (
              <Badge variant="amber" className="font-bold">
                🔥 PRIORITY MATCH
              </Badge>
            )}
          </div>
        </div>

        {/* Title & Key Stats */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-2xl lg:text-3xl font-black text-white leading-tight">{opportunity.title}</h1>
            
            <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
              <span className="flex items-center gap-1 font-bold text-indigo-400">
                <Building className="w-4 h-4" />
                {opportunity.organization}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-4 h-4" />
                {opportunity.location}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-4 h-4 text-amber-400" />
                Deadline: {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
              </span>
            </div>
          </div>

          {/* 3 Prominent Indicators */}
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0 self-start lg:self-auto">
            
            {/* 1. MATCH SCORE */}
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Match Score</span>
              <span className="text-3xl font-black text-indigo-400">{matchScore}%</span>
            </div>

            <div className="w-px h-10 bg-slate-800" />

            {/* 2. ELIGIBILITY */}
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Eligibility</span>
              <Badge variant={isEligible ? 'emerald' : 'red'} className="mt-1">
                {isEligible ? 'ELIGIBLE' : 'INELIGIBLE'}
              </Badge>
            </div>

            <div className="w-px h-10 bg-slate-800" />

            {/* 3. CURRENT READINESS */}
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Current Readiness</span>
              <span className="text-3xl font-black text-white">{currentReadiness}%</span>
            </div>

          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusChange('SAVED')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                appStatus === 'SAVED' 
                  ? 'bg-amber-500 text-slate-950 font-bold' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {appStatus === 'SAVED' ? 'Saved in Watchlist' : 'Save Opportunity'}
            </button>

            <button
              onClick={() => handleStatusChange('APPLIED')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                appStatus === 'APPLIED' 
                  ? 'bg-emerald-600 text-white font-bold' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              {appStatus === 'APPLIED' ? 'Applied ✓' : 'Mark Applied'}
            </button>

            <button
              onClick={() => onOpenAI && onOpenAI(opportunity.id, opportunity.title)}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Ask AI Assistant
            </button>
          </div>

          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <span>Apply Official Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>

      {/* EXPLAINABILITY SECTION: WHY THIS OPPORTUNITY? */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
            Deterministic Explainability Engine
          </span>
          <h3 className="text-lg font-black text-white">Why This Opportunity Matches You</h3>
        </div>

        {/* Explainability Paragraph */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-slate-200 text-xs leading-relaxed">
          "You match this opportunity at <strong>{matchScore}%</strong> because your target career goal aligns with the role requirements, and your verified skills in <strong>{(skillGap.matchedRequired || []).slice(0, 3).join(', ') || 'web architecture'}</strong> satisfy core prerequisites."
        </div>

        {/* Bulleted match breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {whyMatches.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-300">{reason}</span>
            </div>
          ))}
        </div>

        {/* 5-FACTOR MATCH BREAKDOWN */}
        <div className="pt-6 border-t border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
              5-Factor Score Breakdown
            </h4>
            <span className="text-xs font-bold text-indigo-400">Total Formula Match: {matchScore}%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
            
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Skill Fit (35%)</span>
                <span className="font-bold text-white">{breakdown.skillFit}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${breakdown.skillFit}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Goal Relevance (25%)</span>
                <span className="font-bold text-white">{breakdown.goalRelevance}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${breakdown.goalRelevance}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Experience Fit (15%)</span>
                <span className="font-bold text-white">{breakdown.experienceFit}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${breakdown.experienceFit}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Interest Fit (15%)</span>
                <span className="font-bold text-white">{breakdown.interestFit}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${breakdown.interestFit}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Deadline (10%)</span>
                <span className="font-bold text-white">{breakdown.deadlinePriority}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${breakdown.deadlinePriority}%` }} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CONNECT SKILL GAP → READINESS → ACTION */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Readiness & Skill Gap Diagnosis
            </span>
            <h3 className="text-lg font-black text-white">Skill Gap → Potential Readiness Connection</h3>
          </div>

          {/* READINESS COMPARISON CALLOUT */}
          <div className="bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800 flex items-center gap-4 shrink-0">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-medium block">CURRENT READINESS</span>
              <span className="text-xl font-black text-white">{currentReadiness}%</span>
            </div>
            
            <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />

            <div className="text-left">
              <span className="text-[10px] text-emerald-400 font-bold block">POTENTIAL READINESS</span>
              <span className="text-xl font-black text-emerald-400">
                {potentialReadiness}%
                {readinessGain > 0 && <span className="text-xs font-semibold ml-1">(+{readinessGain}%)</span>}
              </span>
            </div>
          </div>
        </div>

        {/* SKILLS MATCHED VS MISSING */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Matched Skills */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Your Matched Skills (✓)</span>
            <div className="flex flex-wrap gap-2">
              {(skillGap.matchedRequired || []).map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Required Skills */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">What You're Missing — Required (⚠)</span>
            <div className="flex flex-wrap gap-2">
              {(skillGap.missingRequired || []).length > 0 ? (
                skillGap.missingRequired.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    ⚠ {skill} (Required)
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-400 font-medium">✓ No required skill gaps!</span>
              )}
            </div>
          </div>

          {/* Missing Preferred Skills */}
          <div className="space-y-2 md:col-span-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">What You're Missing — Preferred (○)</span>
            <div className="flex flex-wrap gap-2">
              {(skillGap.missingPreferred || []).map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 text-xs font-medium">
                  ○ {skill} (Preferred)
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* NEXT BEST ACTION BOX */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-bold text-xs text-amber-400 uppercase tracking-wider block mb-1">What Should You Do?</span>
            <p className="text-xs text-slate-200">{skillGap.nextBestAction || 'Build required skill readiness before submitting your application.'}</p>
          </div>

          {!prepPlan && (
            <button
              onClick={handleGeneratePlan}
              disabled={generatingPlan}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <BookOpenCheck className="w-4 h-4" />
              <span>{generatingPlan ? 'Generating Plan...' : 'BUILD PREPARATION PLAN'}</span>
            </button>
          )}
        </div>

      </div>

      {/* 7-DAY INTERACTIVE PREPARATION ROADMAP */}
      {prepPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 mb-1">
                <BookOpenCheck className="w-4 h-4" />
                <span>PERSONALIZED 7-DAY ROADMAP</span>
              </div>
              <h3 className="font-black text-xl text-white">{prepPlan.title}</h3>
            </div>

            <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <span className="text-xs text-slate-400 font-medium block">Roadmap Completion</span>
              <span className="text-lg font-black text-emerald-400">{prepProgress}% Completed</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${prepProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Tasks Checklist */}
          <div className="space-y-3">
            {prepPlan.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id, task.isCompleted)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  task.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                    : 'bg-slate-950 border-slate-800 hover:border-indigo-500/40 text-slate-200'
                }`}
              >
                <button className="mt-0.5 shrink-0 text-emerald-400">
                  {task.isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-md border-2 border-slate-600 hover:border-indigo-400 transition-colors" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-bold text-sm ${task.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      Day {task.day}: {task.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">{task.duration}</span>
                      <Badge variant={task.priority === 'HIGH' ? 'amber' : 'slate'}>{task.priority}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
}
