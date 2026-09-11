import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Compass, 
  Kanban, 
  BookOpenCheck,
  Building,
  MapPin,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { fetchRecommendedOpportunities, fetchPreparationPlans, fetchApplications } from '../services/apiClient';
import { useStudentProfile } from '../context/DemoStudentContext';
import OpportunityCard from '../components/opportunity/OpportunityCard';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import ScoreRing from '../components/common/ScoreRing';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { student } = useStudentProfile();
  
  const [data, setData] = useState(null);
  const [prepPlans, setPrepPlans] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllDashboardData() {
      try {
        setLoading(true);
        const [recRes, plansRes, appsRes] = await Promise.all([
          fetchRecommendedOpportunities(),
          fetchPreparationPlans().catch(() => []),
          fetchApplications().catch(() => [])
        ]);
        setData(recRes);
        setPrepPlans(plansRes || []);
        setApplications(appsRes || []);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  const topMatch = data?.topMatch;
  const recommended = data?.recommended || [];
  const studentName = student?.name || data?.studentSummary?.name || 'Student';
  const primaryGoal = student?.careerGoals?.[0] || data?.studentSummary?.goal || 'Full Stack Developer';
  const completionPct = student?.completionPercentage || 92;

  // Active preparation plan if any
  const activePlan = prepPlans.find(p => p.progressPercentage < 100) || prepPlans[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Welcome back,</span>
            <span className="text-xs font-black text-indigo-400">{studentName} 👋</span>
          </div>
          <h1 className="text-2xl font-black text-white">Your Career Action Dashboard</h1>
          <p className="text-xs text-slate-400">
            Target Goal: <strong className="text-white">{primaryGoal}</strong> • {student?.education || 'B.Tech CS'}
          </p>
        </div>

        {/* Profile Completion Widget */}
        <Link 
          to="/profile"
          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-colors shrink-0 group"
        >
          <div className="text-right text-xs">
            <span className="text-slate-400 font-medium block">Profile Completion</span>
            <span className="font-extrabold text-indigo-400 text-sm group-hover:underline">{completionPct}% Complete</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center font-black text-xs border border-indigo-500/30">
            {completionPct}%
          </div>
        </Link>
      </div>

      {/* 2. MAIN HERO: "Best Opportunity For You" */}
      {topMatch && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-6"
        >
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Best Opportunity For You
            </span>

            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Deadline: {topMatch.daysRemaining > 0 ? `${topMatch.daysRemaining} days left` : 'Closing soon'}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <h2 className="text-2xl lg:text-3xl font-black text-white">{topMatch.opportunity.title}</h2>
              
              <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
                <span className="font-semibold text-indigo-400 flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {topMatch.opportunity.organization}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {topMatch.opportunity.location} ({topMatch.opportunity.mode})
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {topMatch.skillGap?.nextBestAction || 'High alignment with your technical skills and target career path. Ready to review and apply.'}
              </p>
            </div>

            {/* Match & Readiness Badges */}
            <div className="flex items-center gap-6 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Match Score</span>
                <span className="text-2xl font-black text-indigo-400">{topMatch.matchScore}%</span>
              </div>

              <div className="w-px h-10 bg-slate-800" />

              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Eligibility</span>
                <Badge variant={topMatch.eligibility.eligible ? 'emerald' : 'red'}>
                  {topMatch.eligibility.eligible ? 'ELIGIBLE' : 'INELIGIBLE'}
                </Badge>
              </div>

              <div className="w-px h-10 bg-slate-800" />

              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Readiness</span>
                <span className="text-2xl font-black text-white">{topMatch.readiness?.currentReadiness || 78}%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-medium">
              Source: <strong className="text-slate-300">{topMatch.opportunity.source}</strong> • Verified ✓
            </span>

            <button
              onClick={() => navigate(`/opportunities/${topMatch.opportunity.id}`)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <span>Review Opportunity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* 3. YOUR ACTION QUEUE */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          Your Action Queue — "What Should I Do Next?"
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Priority Task 1: Skill Gap / Match Readiness */}
          <div 
            onClick={() => topMatch && navigate(`/opportunities/${topMatch.opportunity.id}`)}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className={`font-bold uppercase tracking-wider ${
                (topMatch?.skillGap?.missingRequired?.length || 0) > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {(topMatch?.skillGap?.missingRequired?.length || 0) > 0 ? '🔥 Priority Skill Gap' : '✓ High Skill Match'}
              </span>
              <span className="text-slate-500">
                {(topMatch?.skillGap?.missingRequired?.length || 0) > 0 ? 'Urgent' : 'Ready'}
              </span>
            </div>

            <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">
              {(topMatch?.skillGap?.missingRequired?.length || 0) > 0 
                ? `Complete ${topMatch.skillGap.missingRequired[0]} Preparation`
                : `Ready for ${topMatch?.opportunity?.organization || 'Role'}`}
            </h4>

            <p className="text-[11px] text-slate-400 leading-snug">
              {(topMatch?.skillGap?.missingRequired?.length || 0) > 0 
                ? `Boost your readiness score from ${topMatch?.readiness?.currentReadiness}% to ${topMatch?.readiness?.potentialReadiness}%.`
                : `You satisfy all core required skills! Current readiness: ${topMatch?.readiness?.currentReadiness || 91}%.`}
            </p>
          </div>

          {/* Priority Task 2: Applications */}
          <div 
            onClick={() => navigate('/applications')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-indigo-400 uppercase tracking-wider">⚠ Application Pipeline</span>
              <span className="text-slate-500">{applications.length} Tracked</span>
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">
              Review Saved Applications
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Track status from PREPARING to APPLIED for top roles.
            </p>
          </div>

          {/* Priority Task 3: 7-Day Roadmap */}
          <div 
            onClick={() => activePlan ? navigate('/preparation') : topMatch && navigate(`/opportunities/${topMatch.opportunity.id}`)}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-400 uppercase tracking-wider">✓ 7-Day Roadmap</span>
              <span className="text-slate-500">{activePlan ? `${activePlan.progressPercentage}%` : 'Not Started'}</span>
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">
              {activePlan 
                ? `Day ${activePlan.completedCount + 1}: ${activePlan.title}` 
                : 'Generate 7-Day Action Plan'}
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              {activePlan 
                ? `Continue active guided tasks for ${activePlan.opportunity?.title}.`
                : ((topMatch?.skillGap?.missingRequired?.length || 0) > 0 
                  ? `Follow guided daily steps to learn ${topMatch.skillGap.missingRequired[0]}.`
                  : `Review preferred skills like ${topMatch?.skillGap?.missingPreferred?.[0] || 'AWS'} to stand out.`)}
            </p>
          </div>

          {/* Priority Task 4 */}
          <div 
            onClick={() => navigate('/profile')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-purple-400 uppercase tracking-wider">🎯 Profile Goal</span>
              <span className="text-purple-300 font-bold">{completionPct}%</span>
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">
              Refine Target Career Goal
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Keep skills and preferences updated for maximum match accuracy.
            </p>
          </div>

        </div>
      </div>

      {/* 4. RECOMMENDED OPPORTUNITIES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              Top Recommended Opportunities
            </h3>
            <p className="text-xs text-slate-400">Ranked by 5-factor deterministic matching for your profile.</p>
          </div>

          <Link to="/discover" className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
            View All ({recommended.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.slice(0, 4).map((item) => (
            <OpportunityCard key={item.opportunity.id} item={item} />
          ))}
        </div>
      </div>

      {/* 5. PREPARATION PROGRESS & APPLICATIONS PIPELINE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PREPARATION PROGRESS SUMMARY */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-indigo-400" />
              Preparation Progress
            </h4>
            <Link to="/preparation" className="text-xs text-indigo-400 font-semibold hover:underline">
              View Roadmaps →
            </Link>
          </div>

          {activePlan ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{activePlan.title}</span>
                <span className="font-black text-emerald-400">{activePlan.progressPercentage}% Completed</span>
              </div>
              
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all"
                  style={{ width: `${activePlan.progressPercentage}%` }}
                />
              </div>

              <p className="text-slate-400 text-[11px]">
                Targeting: <strong className="text-slate-200">{activePlan.opportunity?.title}</strong>
              </p>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500 italic bg-slate-950 rounded-2xl">
              No active preparation roadmaps. Open an opportunity to generate a 7-day plan.
            </div>
          )}
        </div>

        {/* APPLICATIONS PIPELINE SUMMARY */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Kanban className="w-4 h-4 text-indigo-400" />
              Application Tracker Status
            </h4>
            <Link to="/applications" className="text-xs text-indigo-400 font-semibold hover:underline">
              Open Board →
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">SAVED</span>
              <span className="text-lg font-black text-white">
                {applications.filter(a => a.status === 'SAVED').length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-indigo-400 font-bold uppercase block">PREPARING</span>
              <span className="text-lg font-black text-indigo-300">
                {applications.filter(a => a.status === 'PREPARING').length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">APPLIED</span>
              <span className="text-lg font-black text-emerald-300">
                {applications.filter(a => a.status === 'APPLIED').length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-purple-400 font-bold uppercase block">COMPLETED</span>
              <span className="text-lg font-black text-purple-300">
                {applications.filter(a => a.status === 'COMPLETED').length}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
