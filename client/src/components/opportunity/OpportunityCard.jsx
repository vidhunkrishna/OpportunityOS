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
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative rounded-2xl p-6 border transition-all glass-panel flex flex-col justify-between space-y-4 ${
        isPriority
          ? 'border-amber-500/40 bg-gradient-to-br from-slate-900/90 via-[#0F172A]/90 to-amber-950/20 shadow-xl shadow-amber-950/20'
          : !isEligible
          ? 'border-rose-500/30 bg-slate-950/60 opacity-90'
          : 'border-slate-800/80 bg-slate-900/80 hover:border-indigo-500/40'
      }`}
    >
      <div className="space-y-3.5">
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
          <div className="flex-1 min-w-0 pr-1">
            <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors leading-snug">
              {opportunity.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{opportunity.organization}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{opportunity.location}</span>
              </span>
            </div>
          </div>

          {/* Match Score Display */}
          <div className="shrink-0">
            <ScoreRing score={matchScore} size={60} strokeWidth={5} label="MATCH" />
          </div>
        </div>

        {/* Ineligibility Reason Callout */}
        {!isEligible && eligibility?.eligibilityReasons?.length > 0 && (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200">
            <span className="font-bold block text-rose-300 mb-0.5">Ineligibility Reason:</span>
            {eligibility.eligibilityReasons[0]}
          </div>
        )}

        {/* Matched & Missing Skills Preview */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Required Skills:</span>
            {skillGap?.matchedRequired?.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {skill}
              </span>
            ))}
            {skillGap?.missingRequired?.slice(0, 1).map((skill, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/50 text-amber-300 border border-amber-500/30 text-[11px] font-medium">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Readiness Bar */}
        {readiness && (
          <div className="pt-1">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Opportunity Readiness</span>
              <span className="font-semibold text-white">{readiness.currentReadiness}% <span className="text-emerald-400 font-normal text-[11px]">(Potential: {readiness.potentialReadiness}%)</span></span>
            </div>
            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${readiness.currentReadiness}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3.5 border-t border-slate-800/70 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>Deadline: <strong className="text-slate-200">{daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}</strong></span>
        </div>

        <Link
          to={`/opportunities/${opportunity.id}`}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 group"
        >
          <span>View Match</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
