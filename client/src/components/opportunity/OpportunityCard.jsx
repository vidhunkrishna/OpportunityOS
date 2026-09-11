import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Building, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, Flame } from 'lucide-react';
import Badge from '../common/Badge';
import ScoreRing from '../common/ScoreRing';

export default function OpportunityCard({ item, onSave, onQuickPrep }) {
  if (!item) return null;

  const {
    opportunity,
    eligibility,
    matchScore,
    priority,
    readiness,
    skillGap,
    daysRemaining
  } = item;

  const isEligible = eligibility?.eligible;
  const isPriority = priority?.bucket === 'PRIORITY';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between space-y-5 ${
        isPriority
          ? 'border-amber-500/40 bg-gradient-to-br from-slate-900/95 via-[#0F172A]/95 to-amber-950/20 shadow-xl shadow-amber-950/20 hover:border-amber-500/60'
          : !isEligible
          ? 'border-rose-500/30 bg-slate-950/70 opacity-90 hover:border-rose-500/50'
          : 'border-slate-800/90 bg-slate-900/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10'
      }`}
    >
      <div className="space-y-4">
        {/* Top Badges Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="indigo">{opportunity.category}</Badge>
            <Badge variant="slate">{opportunity.mode}</Badge>
            
            {/* Priority Badge */}
            {isPriority && (
              <Badge variant="amber" className="flex items-center gap-1 font-bold">
                <Flame className="w-3 h-3 text-amber-400" />
                PRIORITY
              </Badge>
            )}

            {/* Eligibility Badge */}
            {isEligible ? (
              <Badge variant="emerald" className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ELIGIBLE
              </Badge>
            ) : (
              <Badge variant="red" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                INELIGIBLE
              </Badge>
            )}
          </div>

          {/* Verification indicator */}
          {opportunity.isVerified && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
        </div>

        {/* Title, Company & Score Ring */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex-1 min-w-0 pr-1 space-y-1">
            <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-indigo-400 transition-colors leading-snug">
              {opportunity.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap pt-0.5">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate max-w-[140px]">{opportunity.organization}</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate max-w-[100px]">{opportunity.location}</span>
              </span>
            </div>
          </div>

          {/* Match Score Display */}
          <div className="shrink-0 pt-0.5">
            <ScoreRing score={matchScore} size={58} strokeWidth={5} label="MATCH" />
          </div>
        </div>

        {/* Ineligibility Reason Callout */}
        {!isEligible && eligibility?.eligibilityReasons?.length > 0 && (
          <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-200 space-y-1">
            <span className="font-bold text-rose-300 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Ineligibility Reason:
            </span>
            <p className="text-[11px] text-rose-200/90 leading-relaxed">{eligibility.eligibilityReasons[0]}</p>
          </div>
        )}

        {/* Matched & Missing Skills Preview */}
        <div className="pt-1 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Key Skill Requirements</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {skillGap?.matchedRequired?.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {skill}
              </span>
            ))}
            {skillGap?.missingRequired?.slice(0, 2).map((skill, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Readiness Bar */}
        {readiness && (
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Readiness Score</span>
              <span className="font-bold text-white">
                {readiness.currentReadiness}% 
                <span className="text-emerald-400 font-medium text-[11px] ml-1">(Potential: {readiness.potentialReadiness}%)</span>
              </span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500" 
                style={{ width: `${readiness.currentReadiness}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>Deadline: <strong className="text-slate-200">{daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}</strong></span>
        </div>

        <Link
          to={`/opportunities/${opportunity.id}`}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-md shadow-indigo-600/25 flex items-center gap-1.5 group"
        >
          <span>View Match</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
