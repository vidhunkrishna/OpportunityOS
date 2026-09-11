import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Code, 
  Target, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Briefcase,
  Layers,
  MapPin
} from 'lucide-react';
import { useStudentProfile } from '../context/DemoStudentContext';
import { useAuth } from '../context/AuthContext';
import { updateStudentProfileApi } from '../services/apiClient';
import { useToast } from '../context/ToastContext';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { student, refreshStudent } = useStudentProfile();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [college, setCollege] = useState(student?.college || 'National Institute of Technology');
  const [education, setEducation] = useState(student?.education || 'B.Tech Computer Science');
  const [branch, setBranch] = useState(student?.branch || 'Computer Science');
  const [academicYear, setAcademicYear] = useState(student?.academicYear || 3);

  const [skills, setSkills] = useState(['JavaScript', 'React', 'Node.js', 'REST APIs', 'Git']);
  const [newSkill, setNewSkill] = useState('');

  const [interests, setInterests] = useState(['Web Development', 'AI / Machine Learning', 'Cloud Computing']);
  const [newInterest, setNewInterest] = useState('');

  const [careerGoal, setCareerGoal] = useState('Full Stack Developer');
  const [preferredOppTypes, setPreferredOppTypes] = useState(['Internship', 'Hackathon', 'Job']);
  const [preferredLocations, setPreferredLocations] = useState(['Remote', 'Bangalore']);
  const [workMode, setWorkMode] = useState('Remote');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (itemToRemove) => {
    setInterests(interests.filter(i => i !== itemToRemove));
  };

  const toggleOppType = (type) => {
    if (preferredOppTypes.includes(type)) {
      setPreferredOppTypes(preferredOppTypes.filter(t => t !== type));
    } else {
      setPreferredOppTypes([...preferredOppTypes, type]);
    }
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      const res = await updateStudentProfileApi({
        name: user?.name || student?.name,
        education,
        branch,
        academicYear: Number(academicYear),
        skills,
        interests,
        careerGoals: [careerGoal],
        preferredOppTypes,
        preferredLocations
      });

      if (res.student) {
        updateUser(res.student);
      }
      await refreshStudent();
      addToast('Profile personalized! Welcome to OpportunityOS.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Onboarding finish error:', err);
      addToast('Failed to save onboarding data. Redirecting to dashboard...', 'warning');
      navigate('/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Education', icon: GraduationCap },
    { number: 2, title: 'Skills & Tools', icon: Code },
    { number: 3, title: 'Career Goal', icon: Target },
    { number: 4, title: 'Preferences', icon: Compass },
    { number: 5, title: 'Personalized!', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 flex flex-col items-center justify-center p-4 lg:p-8 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Step {step} of 5: Personalized Opportunity Setup</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Build Your Opportunity Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            OpportunityOS uses your academic level, skills, and goals to calculate exact match percentages and readiness scores.
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 rounded-2xl border border-slate-800">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.number;
            const isCurrent = step === s.number;

            return (
              <div key={s.number} className="flex items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted 
                      ? 'bg-emerald-600 text-white'
                      : isCurrent 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-xs font-semibold hidden md:inline ${isCurrent ? 'text-white' : 'text-slate-500'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Card Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden min-h-[400px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: EDUCATION */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                    Academic Background & Education
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your branch and academic year drive hard eligibility filtering across top roles.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">University / College Name</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. National Institute of Technology"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Degree Program</label>
                      <input
                        type="text"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="e.g. B.Tech Computer Science"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Branch / Major</label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Current Academic Year</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => setAcademicYear(year)}
                          className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                            academicYear === year
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Year {year}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: TECHNICAL SKILLS */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-400" />
                    Technical Skills & Tools
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Skill Fit carries 35% weight in your Opportunity OS match score calculations.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Add Technical Skill or Tool</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        placeholder="e.g. Docker, Python, AWS, SQL, React"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                      >
                        Add Skill
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-2">Your Verified Skills ({skills.length})</label>
                    <div className="flex flex-wrap gap-2 min-h-[100px] p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 text-xs font-semibold"
                        >
                          <span>✓ {skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-rose-400 text-slate-500 ml-1 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CAREER GOAL & INTERESTS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    Career Goal & Domain Interests
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Goal Relevance carries 25% weight in matching scores. Specify your primary target role.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Select Target Career Role</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        'Full Stack Developer',
                        'Backend Engineer',
                        'Frontend Engineer',
                        'AI / ML Engineer',
                        'DevOps Engineer',
                        'Data Scientist'
                      ].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setCareerGoal(role)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            careerGoal === role
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          🎯 {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Areas of Interest</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                        placeholder="e.g. Open Source, Cloud Security, FinTech"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={addInterest}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                      {interests.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeInterest(item)}
                            className="hover:text-rose-400 text-slate-500 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: PREFERENCES */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-indigo-400" />
                    Opportunity Preferences
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize the types of opportunities you want to discover first.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Target Opportunity Types</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['Internship', 'Job', 'Hackathon', 'Research', 'Scholarship', 'Competition'].map((type) => {
                        const isSelected = preferredOppTypes.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleOppType(type)}
                            className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                                ? 'bg-indigo-600 text-white' : ''
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : ''}{type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Work Mode Preference</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Remote', 'Hybrid', 'On-site'].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setWorkMode(mode)}
                          className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            workMode === mode
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: COMPLETION STATE */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center py-4"
              >
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">Your Profile is 100% Complete!</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    OpportunityOS has calibrated its 5-factor matching algorithm for <strong className="text-white">{user?.name || 'Student'}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-left text-xs max-w-md mx-auto">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Target Role:</span>
                    <span className="font-bold text-indigo-400">{careerGoal}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Academic Standing:</span>
                    <span className="font-bold text-slate-200">{education} (Year {academicYear})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Technical Skills:</span>
                    <span className="font-bold text-emerald-400">{skills.length} Verified Skills</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Opportunity Engine:</span>
                    <span className="font-bold text-amber-400">Ready to Match</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between mt-auto">
            {step > 1 && step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {step < 4 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <span>Finalize Profile</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}

            {step === 5 && (
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs transition-all shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? 'Launching Dashboard...' : 'Explore My Personalized Dashboard →'}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
