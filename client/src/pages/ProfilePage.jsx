import React, { useState, useEffect } from 'react';
import { User, CheckCircle2, AlertCircle, Save, Sparkles } from 'lucide-react';
import { useDemoStudent } from '../context/DemoStudentContext';
import { useAuth } from '../context/AuthContext';
import { updateStudentProfileApi } from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import Badge from '../components/common/Badge';

export default function ProfilePage() {
  const { student, refreshStudent } = useDemoStudent();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [saving, setSaving] = useState(false);
  
  // Local state initialized from student / user
  const currentUser = student || user;

  const [name, setName] = useState(currentUser?.name || '');
  const [education, setEducation] = useState(currentUser?.education || 'B.Tech Computer Science');
  const [branch, setBranch] = useState(currentUser?.branch || 'Computer Science');
  const [academicYear, setAcademicYear] = useState(currentUser?.academicYear || 3);
  const [skillsStr, setSkillsStr] = useState(
    Array.isArray(currentUser?.skills) 
      ? currentUser.skills.join(', ') 
      : (typeof currentUser?.skillsJson === 'string' ? JSON.parse(currentUser.skillsJson || '[]').join(', ') : 'JavaScript, React, Node.js')
  );
  const [goalsStr, setGoalsStr] = useState(
    Array.isArray(currentUser?.careerGoals) 
      ? currentUser.careerGoals.join(', ') 
      : (typeof currentUser?.careerGoalsJson === 'string' ? JSON.parse(currentUser.careerGoalsJson || '[]').join(', ') : 'Full Stack Developer')
  );

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEducation(currentUser.education || 'B.Tech Computer Science');
      setBranch(currentUser.branch || 'Computer Science');
      setAcademicYear(currentUser.academicYear || 3);
      if (currentUser.skills) {
        setSkillsStr(Array.isArray(currentUser.skills) ? currentUser.skills.join(', ') : '');
      }
      if (currentUser.careerGoals) {
        setGoalsStr(Array.isArray(currentUser.careerGoals) ? currentUser.careerGoals.join(', ') : '');
      }
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const skillsArr = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      const goalsArr = goalsStr.split(',').map(g => g.trim()).filter(Boolean);

      const res = await updateStudentProfileApi({
        name,
        education,
        branch,
        academicYear: parseInt(academicYear),
        skills: skillsArr,
        careerGoals: goalsArr
      });

      if (res.student) {
        updateUser(res.student);
      }
      await refreshStudent();
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error('Update profile error:', err);
      addToast('Failed to update profile.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-400" />
          Student Profile & Career Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Your profile feeds directly into the 5-factor matching engine and eligibility checks.
        </p>
      </div>

      {/* Completion Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 font-black text-white text-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            {getInitials(currentUser?.name)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{currentUser?.name || 'Student Profile'}</h2>
            <p className="text-xs text-slate-400">{currentUser?.education || 'B.Tech CS'} • Year {currentUser?.academicYear || 3}</p>
          </div>
        </div>

        <div className="bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800 text-right min-w-[180px]">
          <span className="text-xs text-slate-400 font-medium block">Profile Completion</span>
          <span className="text-2xl font-black text-indigo-400">{student?.completionPercentage ?? user?.completionPercentage ?? 100}%</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3">Edit Profile Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Education Degree</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Branch / Discipline</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Academic Year (1-4)</label>
            <input
              type="number"
              min="1"
              max="4"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-400 font-medium mb-1.5">Technical Skills (Comma separated)</label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-400 font-medium mb-1.5">Career Goals (Comma separated)</label>
            <input
              type="text"
              value={goalsStr}
              onChange={(e) => setGoalsStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
