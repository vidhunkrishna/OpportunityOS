import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  BrainCircuit, 
  BookOpenCheck, 
  Kanban, 
  Flame, 
  ShieldCheck,
  Building,
  MapPin
} from 'lucide-react';
import ScoreRing from '../components/common/ScoreRing';
import Badge from '../components/common/Badge';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Text */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Personalized Student Opportunity Engine &amp; Career Action Planner</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Find the right opportunity. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300">
              Understand your fit.
            </span> <br />
            Build what you're missing. <br />
            <span className="text-emerald-400">Take action.</span>
          </h1>

          <p className="text-base text-slate-400 leading-relaxed font-normal max-w-xl">
            An AI-powered student opportunity engine that replaces fragmented search with a personalized career action pipeline. Discover matches, diagnose skill gaps, and execute guided preparation plans.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2 group"
            >
              <span>GET STARTED FREE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/discover')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-sm transition-all"
            >
              EXPLORE OPPORTUNITIES
            </button>
          </div>

          {/* Flow Indicator Pill */}
          <div className="pt-4 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="text-indigo-400">DISCOVER</span> →
            <span className="text-blue-400">MATCH</span> →
            <span className="text-purple-400">EXPLAIN</span> →
            <span className="text-amber-400">IMPROVE</span> →
            <span className="text-emerald-400">ACT</span>
          </div>
        </motion.div>

        {/* Right Column Animated Interactive Product Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-6 relative"
        >
          <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-[#0B0F19] to-indigo-950/40 border border-slate-800 shadow-2xl shadow-indigo-500/10 space-y-5">
            
            {/* Header Mock */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Badge variant="amber" className="flex items-center gap-1 font-bold">
                  <Flame className="w-3 h-3 text-amber-400" />
                  🔥 PRIORITY MATCH
                </Badge>
                <Badge variant="emerald">ELIGIBLE</Badge>
              </div>
              <span className="text-xs text-slate-400 font-medium">Deadline in 3 days</span>
            </div>

            {/* Main Card Content */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-xl text-white">Full Stack Developer Intern</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    TechNova
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    Remote
                  </span>
                </div>
              </div>

              {/* Dynamic Score Ring Mock */}
              <ScoreRing score={92} size={70} strokeWidth={7} label="MATCH" />
            </div>

            {/* Explainable Match Point */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-indigo-400 block">Why OpportunityOS matches your profile:</span>
              <p className="text-slate-400">✓ React & Node.js skills match core role requirements.</p>
              <p className="text-slate-400">✓ Full Stack Developer career goal aligns with target positions.</p>
            </div>

            {/* Skill Gap & Action Mock */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-xs">
              <div>
                <span className="font-bold text-amber-300 block">Skill Gap Identified: Docker</span>
                <span className="text-slate-400 text-[11px]">Current Readiness: 78% → Potential: 91%</span>
              </div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-sm"
              >
                7-Day Prep Plan
              </button>
            </div>

          </div>
        </motion.div>

      </section>

      {/* How It Works Section */}
      <section className="border-t border-slate-800/80 py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-2xl lg:text-3xl font-black text-center text-white mb-12">
          How OpportunityOS Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
          
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center font-bold">1</div>
            <h4 className="font-bold text-sm text-white">Discover</h4>
            <p className="text-xs text-slate-400">Aggregates opportunities across portals into one feed.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 mx-auto flex items-center justify-center font-bold">2</div>
            <h4 className="font-bold text-sm text-white">Match</h4>
            <p className="text-xs text-slate-400">Evaluates eligibility & 5-factor weighted fit formula (0-100%).</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 mx-auto flex items-center justify-center font-bold">3</div>
            <h4 className="font-bold text-sm text-white">Explain</h4>
            <p className="text-xs text-slate-400">Transparently breaks down why opportunities match your profile.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 mx-auto flex items-center justify-center font-bold">4</div>
            <h4 className="font-bold text-sm text-white">Improve</h4>
            <p className="text-xs text-slate-400">Diagnoses skill gaps and generates 7-day preparation roadmaps.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 mx-auto flex items-center justify-center font-bold">5</div>
            <h4 className="font-bold text-sm text-white">Act</h4>
            <p className="text-xs text-slate-400">Tracks applications across Kanban states from SAVED to APPLIED.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>OpportunityOS — Personalized Student Opportunity Engine &amp; Career Action Planner</p>
      </footer>
    </div>
  );
}
