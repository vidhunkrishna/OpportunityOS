import React from 'react';

export default function Badge({ children, variant = 'slate', className = '' }) {
  const variants = {
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700',
    indigo: 'bg-indigo-950/70 text-indigo-300 border-indigo-500/30',
    blue: 'bg-blue-950/70 text-blue-300 border-blue-500/30',
    emerald: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-950/70 text-amber-300 border-amber-500/30',
    red: 'bg-rose-950/70 text-rose-300 border-rose-500/30',
    purple: 'bg-purple-950/70 text-purple-300 border-purple-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.slate} ${className}`}>
      {children}
    </span>
  );
}
