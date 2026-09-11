import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import DiscoverPage from './pages/DiscoverPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import SavedPage from './pages/SavedPage';
import ApplicationsPage from './pages/ApplicationsPage';
import SkillGapsPage from './pages/SkillGapsPage';
import PreparationPage from './pages/PreparationPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import OpportunityAIAssistantDrawer from './components/ai/OpportunityAIAssistantDrawer';
import { AuthProvider } from './context/AuthContext';
import { StudentProvider } from './context/DemoStudentContext';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/onboarding';

  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [selectedOppForAI, setSelectedOppForAI] = useState({ id: null, title: '' });

  const handleOpenAI = (oppId = null, oppTitle = '') => {
    setSelectedOppForAI({ id: oppId, title: oppTitle });
    setAiDrawerOpen(true);
  };

  return (
    <ToastProvider>
      <AuthProvider>
        <StudentProvider>
          <div className="min-h-screen bg-[#060811] text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col">
            
            {/* Top Navbar */}
            <Navbar onOpenAI={() => handleOpenAI()} />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

              {/* Protected Student Routes */}
              <Route
                path="/*"
                element={
                  <div className="flex-1 flex w-full">
                    <Sidebar />
                    <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full">
                      <Routes>
                        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
                        <Route path="/opportunities/:id" element={<ProtectedRoute><OpportunityDetailPage onOpenAI={handleOpenAI} /></ProtectedRoute>} />
                        <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
                        <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
                        <Route path="/skill-gaps" element={<ProtectedRoute><SkillGapsPage /></ProtectedRoute>} />
                        <Route path="/preparation" element={<ProtectedRoute><PreparationPage /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                        
                        {/* Protected Admin Route */}
                        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboardPage /></ProtectedRoute>} />
                      </Routes>
                    </main>
                  </div>
                }
              />
            </Routes>

            {/* OpportunityOS AI Assistant Slide-over Drawer */}
            <OpportunityAIAssistantDrawer
              isOpen={aiDrawerOpen}
              onClose={() => setAiDrawerOpen(false)}
              selectedOpportunityId={selectedOppForAI.id}
              opportunityTitle={selectedOppForAI.title}
            />
          </div>
        </StudentProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
