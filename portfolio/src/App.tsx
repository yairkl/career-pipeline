import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';
import { PublicPortfolio } from './pages/PublicPortfolio';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import { ProfileSettings } from './components/ProfileSettings';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { usePortfolioData } from './hooks/usePortfolioData';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setChecking(false);
        return;
      }
      
      try {
        const configRef = doc(db, 'config', 'system');
        const configSnap = await getDoc(configRef);
        
        if (!configSnap.exists()) {
          setSetupRequired(true);
        } else {
          const data = configSnap.data();
          if (data.ownerUid !== user.uid) {
            setAccessDenied(true);
          }
        }
      } catch (err) {
        console.error("Error checking access:", err);
      }
      
      setChecking(false);
    };

    if (!loading) {
      checkAccess();
    }
  }, [user, loading]);

  const handleClaim = async () => {
    if (!user) return;
    setClaiming(true);
    try {
      await setDoc(doc(db, 'config', 'system'), {
        ownerUid: user.uid,
        claimedAt: new Date()
      });
      setSetupRequired(false);
    } catch (err) {
      console.error("Error claiming portfolio:", err);
      alert("Failed to claim portfolio. See console for details.");
    } finally {
      setClaiming(false);
    }
  };

  if (loading || checking) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant p-12 shadow-soft text-center">
          <h1 className="text-3xl font-display font-bold text-error mb-4">Access Denied</h1>
          <p className="font-body text-sm text-on-surface-variant mb-8">
            This portfolio has already been claimed by another user. You do not have administrative privileges.
          </p>
          <button 
            onClick={() => signOut(auth)}
            className="w-full bg-surface border border-outline hover:bg-surface-variant text-on-surface py-4 rounded-default font-label font-bold uppercase tracking-widest transition-colors text-xs"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (setupRequired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant p-12 shadow-soft text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-4">Welcome Curator</h1>
          <p className="font-body text-sm text-on-surface-variant mb-8">
            It looks like this is a fresh installation. Claim this portfolio now to securely lock the database and become its sole owner.
          </p>
          <button 
            onClick={handleClaim}
            disabled={claiming}
            className="w-full bg-primary text-on-primary py-4 rounded-default font-label font-bold uppercase tracking-widest hover:opacity-90 transition-all text-xs shadow-soft disabled:opacity-50"
          >
            {claiming ? 'Securing...' : 'Claim Portfolio'}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

function ThemeApplier() {
  const { profile } = usePortfolioData();
  
  useEffect(() => {
    const root = window.document.documentElement;
    // Remove existing theme classes (start with theme-)
    const themeClasses = Array.from(root.classList).filter(cls => cls.startsWith('theme-'));
    themeClasses.forEach(cls => root.classList.remove(cls));
    
    // Add new theme class if present and not default
    if (profile?.theme && profile.theme !== 'default') {
      root.classList.add(`theme-${profile.theme}`);
    }
  }, [profile?.theme]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <ThemeApplier />
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicLayout>
                <PublicPortfolio />
              </PublicLayout>
            } />
            
            {/* Admin Login */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/profile" replace />} />
              <Route path="projects" element={<AdminDashboard activeTab="projects" />} />
              <Route path="experience" element={<AdminDashboard activeTab="experience" />} />
              <Route path="education" element={<AdminDashboard activeTab="education" />} />
              <Route path="skills" element={<AdminDashboard activeTab="skills" />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
}

export default App;
