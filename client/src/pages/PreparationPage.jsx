import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenCheck, CheckSquare, ArrowRight, Building, Sparkles, TrendingUp } from 'lucide-react';
import { fetchPreparationPlans, togglePreparationTaskApi } from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/common/Skeleton';
import Badge from '../components/common/Badge';
import { Link } from 'react-router-dom';

export default function PreparationPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await fetchPreparationPlans();
      setPlans(res);
    } catch (err) {
      console.error('Fetch plans error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleToggleTask = async (planId, taskId, currentCompleted) => {
    try {
      const res = await togglePreparationTaskApi(taskId, !currentCompleted);
      setPlans(prev => prev.map(plan => {
        if (plan.id === planId) {
          const updatedTasks = plan.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !currentCompleted } : t);
          const completedCount = updatedTasks.filter(t => t.isCompleted).length;
          const totalCount = updatedTasks.length;
          return {
            ...plan,
            tasks: updatedTasks,
            completedCount,
            progressPercentage: Math.round((completedCount / totalCount) * 100)
          };
        }
        return plan;
      }));
      addToast(`Task marked ${!currentCompleted ? 'completed' : 'incomplete'}!`, 'info');
    } catch (err) {
      console.error('Toggle task error:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 selection:bg-indigo-500 selection:text-white">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6 text-indigo-400" />
          Personalized 7-Day Preparation Roadmaps
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Guided step-by-step action plans to containerize missing technical skills and boost application readiness.
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-64 rounded-3xl" />
      ) : plans.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-w-md mx-auto my-12">
          <BookOpenCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Active Preparation Plans</h3>
          <p className="text-xs text-slate-400">
            Open any opportunity details page and click 'BUILD PREPARATION PLAN' to generate a personalized 7-day action roadmap.
          </p>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-lg shadow-indigo-600/30"
          >
            <span>DISCOVER OPPORTUNITIES →</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {plans.map(plan => {
            const completedCount = plan.completedCount || plan.tasks.filter(t => t.isCompleted).length;
            const totalCount = plan.tasks.length;
            const progress = plan.progressPercentage || (totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 lg:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1 mb-1">
                      <Building className="w-3.5 h-3.5" />
                      {plan.opportunity?.organization || 'Opportunity Role'}
                    </span>
                    <h3 className="font-black text-xl text-white">{plan.title}</h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Completion Rate</span>
                      <span className="text-base font-black text-emerald-400">
                        {completedCount} / {totalCount} completed ({progress}%)
                      </span>
                    </div>

                    <Link
                      to={`/opportunities/${plan.opportunityId}`}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Role</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Task Checklist */}
                <div className="space-y-3">
                  {plan.tasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(plan.id, task.id, task.isCompleted)}
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
                          <span className={`font-bold text-xs sm:text-sm ${task.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                            Day {task.day}: {task.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-medium">{task.duration}</span>
                            <Badge variant={task.isCompleted ? 'emerald' : (task.priority === 'HIGH' ? 'amber' : 'slate')}>
                              {task.isCompleted ? 'Complete ✓' : task.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
