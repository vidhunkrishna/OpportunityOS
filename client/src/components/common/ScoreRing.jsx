import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScoreRing({ score = 0, size = 120, strokeWidth = 10, label = 'MATCH' }) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to actual value over 1 second
    const timer = setTimeout(() => {
      setCurrentScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  // Determine color theme based on score
  let ringColor = 'stroke-indigo-500';
  let textColor = 'text-indigo-400';
  let bgGradient = 'from-indigo-500/10 to-blue-500/5';

  if (score >= 90) {
    ringColor = 'stroke-emerald-400';
    textColor = 'text-emerald-400';
    bgGradient = 'from-emerald-500/10 to-teal-500/5';
  } else if (score >= 75) {
    ringColor = 'stroke-blue-400';
    textColor = 'text-blue-400';
    bgGradient = 'from-blue-500/10 to-indigo-500/5';
  } else if (score < 50) {
    ringColor = 'stroke-amber-400';
    textColor = 'text-amber-400';
    bgGradient = 'from-amber-500/10 to-orange-500/5';
  }

  // Dynamic font scaling according to size
  let scoreFontClass = 'text-3xl';
  let labelFontClass = 'text-[11px]';
  if (size <= 70) {
    scoreFontClass = 'text-xs';
    labelFontClass = 'text-[7px]';
  } else if (size <= 90) {
    scoreFontClass = 'text-lg';
    labelFontClass = 'text-[9px]';
  } else if (size <= 100) {
    scoreFontClass = 'text-2xl';
    labelFontClass = 'text-[10px]';
  }

  return (
    <div 
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br ${bgGradient} shadow-md border border-white/10 shrink-0`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90 block">
        {/* Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-800/80"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Fill Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>

      {/* Score Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-0.5 pointer-events-none select-none">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`font-black leading-tight ${scoreFontClass} ${textColor}`}
        >
          {score}%
        </motion.span>
        {label && (
          <span className={`font-bold tracking-widest text-slate-400 uppercase leading-none mt-0.5 ${labelFontClass}`}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
