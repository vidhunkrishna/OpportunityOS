import React, { useEffect, useState } from 'react';
import { Bookmark, Compass } from 'lucide-react';
import { fetchApplications } from '../services/apiClient';
import OpportunityCard from '../components/opportunity/OpportunityCard';
import Skeleton from '../components/common/Skeleton';
import { Link } from 'react-router-dom';

export default function SavedPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetchApplications();
        setApps(res.filter(a => a.status === 'SAVED'));
      } catch (err) {
        console.error('Saved apps error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-amber-400" />
          Saved Opportunities Watchlist
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Opportunities saved for evaluation and preparation planning.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : apps.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-w-lg mx-auto my-12">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Saved Opportunities Yet</h3>
          <p className="text-xs text-slate-400">Save opportunities you are interested in while browsing and they will appear in your watchlist here.</p>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>EXPLORE OPPORTUNITIES</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app) => (
            <OpportunityCard key={app.id} item={app} />
          ))}
        </div>
      )}
    </div>
  );
}
