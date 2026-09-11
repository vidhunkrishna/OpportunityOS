import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Bookmark, 
  Kanban, 
  BrainCircuit, 
  BookOpenCheck, 
  UserCircle,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { isAdmin } = useAuth();

  const mainNavItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/saved', label: 'Saved', icon: Bookmark },
    { to: '/applications', label: 'Applications', icon: Kanban },
    { to: '/preparation', label: 'Preparation', icon: BookOpenCheck },
    { to: '/skill-gaps', label: 'Skill Gaps', icon: BrainCircuit },
  ];

  const secondaryNavItems = [
    { to: '/profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-[#090D1A]/90 border-r border-slate-800/80 min-h-[calc(100vh-61px)] p-4 select-none">
      <div className="space-y-6">
        
        {/* Core Navigation */}
        <div>
          <h3 className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
            Main Menu
          </h3>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div>
          <h3 className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
            Settings & Account
          </h3>
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {/* Admin portal link strictly for ADMIN role */}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20 border border-amber-400/30'
                      : 'text-amber-400 hover:text-amber-300 hover:bg-slate-900'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Portal</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* Core Product Loop Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold text-[11px]">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>OPPORTUNITYOS</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            DISCOVER → MATCH → EXPLAIN → IMPROVE → ACT
          </p>
        </div>

      </div>
    </aside>
  );
}
