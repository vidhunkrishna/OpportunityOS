import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Building, 
  MapPin, 
  CheckCircle2, 
  X, 
  Search, 
  Layers, 
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { 
  fetchAdminOpportunitiesApi, 
  createOpportunityAdminApi, 
  updateOpportunityAdminApi, 
  deleteOpportunityAdminApi 
} from '../services/apiClient';
import { useToast } from '../context/ToastContext';

export default function AdminDashboardPage() {
  const { addToast } = useToast();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    category: 'Internship',
    description: '',
    requiredSkills: 'JavaScript, React, Node.js',
    preferredSkills: 'AWS, Docker',
    location: 'Bangalore / Remote',
    mode: 'Remote',
    applicationUrl: 'https://careers.company.com/apply'
  });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminOpportunitiesApi();
      setOpportunities(res.opportunities || []);
    } catch (err) {
      console.error('Failed to load admin opportunities:', err);
      addToast('Failed to load admin opportunities.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleOpenModal = (opp = null) => {
    if (opp) {
      setEditingId(opp.id);
      setFormData({
        title: opp.title,
        organization: opp.organization,
        category: opp.category,
        description: opp.description,
        requiredSkills: Array.isArray(JSON.parse(opp.requiredSkillsJson || '[]')) 
          ? JSON.parse(opp.requiredSkillsJson || '[]').join(', ') 
          : '',
        preferredSkills: Array.isArray(JSON.parse(opp.preferredSkillsJson || '[]')) 
          ? JSON.parse(opp.preferredSkillsJson || '[]').join(', ') 
          : '',
        location: opp.location,
        mode: opp.mode,
        applicationUrl: opp.applicationUrl
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        organization: '',
        category: 'Internship',
        description: '',
        requiredSkills: 'JavaScript, React, Node.js',
        preferredSkills: 'AWS, Docker',
        location: 'Remote',
        mode: 'Remote',
        applicationUrl: 'https://careers.google.com/jobs/results/'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        organization: formData.organization,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        mode: formData.mode,
        applicationUrl: formData.applicationUrl,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        preferredSkills: formData.preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
        eligibility: { minYear: 1, maxYear: 4, branches: ['all'], academicLevel: 'Undergraduate' }
      };

      if (editingId) {
        await updateOpportunityAdminApi(editingId, payload);
        addToast('Opportunity updated successfully', 'success');
      } else {
        await createOpportunityAdminApi(payload);
        addToast('New opportunity published!', 'success');
      }

      setIsModalOpen(false);
      loadAdminData();
    } catch (err) {
      console.error('Failed to save opportunity:', err);
      addToast(err.response?.data?.error || 'Failed to save opportunity', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteOpportunityAdminApi(id);
      addToast(`Deleted "${title}"`, 'info');
      loadAdminData();
    } catch (err) {
      console.error('Failed to delete opportunity:', err);
      addToast('Failed to delete opportunity', 'error');
    }
  };

  const filteredOpps = opportunities.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl font-black text-white">Admin Management Portal</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage verified opportunities, publish listings, and control platform access.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Opportunity</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400 text-xs font-medium">Total Listings</span>
          <div className="text-2xl font-black text-white mt-1">{opportunities.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400 text-xs font-medium">Verified Opportunities</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {opportunities.filter(o => o.isVerified).length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400 text-xs font-medium">Categories Active</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">
            {new Set(opportunities.map(o => o.category)).size}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter opportunities by title or organization..."
          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Admin Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Opportunity</th>
                <th className="p-4">Category</th>
                <th className="p-4">Mode &amp; Location</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Loading admin dataset...</td>
                </tr>
              ) : filteredOpps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No opportunities match search filter.</td>
                </tr>
              ) : (
                filteredOpps.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{opp.title}</div>
                      <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3 h-3 text-indigo-400" />
                        <span>{opp.organization}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-semibold text-[11px]">
                        {opp.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-200">{opp.mode}</div>
                      <div className="text-slate-400 text-[11px]">{opp.location}</div>
                    </td>
                    <td className="p-4">
                      {opp.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-amber-400 font-medium">Unverified</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(opp)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(opp.id, opp.title)}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-lg text-white">
                {editingId ? 'Edit Opportunity' : 'Publish New Opportunity'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full Stack Developer Intern"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Organization</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. TechNova"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Competition">Competition</option>
                    <option value="Job">Job</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bangalore / Remote"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  placeholder="JavaScript, React, Node.js"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Preferred Skills (Comma separated)</label>
                <input
                  type="text"
                  value={formData.preferredSkills}
                  onChange={(e) => setFormData({ ...formData, preferredSkills: e.target.value })}
                  placeholder="AWS, Docker"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Opportunity role details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Application URL</label>
                <input
                  type="url"
                  value={formData.applicationUrl}
                  onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                  placeholder="https://company.com/apply"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  {editingId ? 'Update Opportunity' : 'Publish Opportunity'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
