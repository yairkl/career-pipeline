import React from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Eye, LayoutDashboard, History, GraduationCap, Code2, Search, UserCircle } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/profile', icon: UserCircle, label: 'Profile' },
    { to: '/admin/projects', icon: LayoutDashboard, label: 'Projects' },
    { to: '/admin/experience', icon: History, label: 'Experience' },
    { to: '/admin/education', icon: GraduationCap, label: 'Education' },
    { to: '/admin/skills', icon: Code2, label: 'Skills' },
  ];

  return (
    <div className="min-h-screen bg-background flex text-on-surface transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-surface border-r border-outline-variant flex flex-col py-10 z-50">
        <div className="px-8 mb-12 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-soft">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Brand Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-primary tracking-tight leading-none">Career</h1>
            <p className="font-label text-[8px] uppercase tracking-[0.2em] text-on-surface-variant mt-1 font-bold">Pipeline Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          <div className="px-4 mb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Management</p>
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-label text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-8 px-4 mb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Application</p>
          </div>
          <NavLink
            to="/"
            className="flex items-center px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-all duration-200 group"
          >
            <Eye className="w-5 h-5 mr-3" />
            <span className="font-label text-sm font-medium">Public View</span>
          </NavLink>
        </nav>

        <div className="px-6 mt-auto space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between gap-2 bg-surface-variant/50 hover:bg-surface-variant p-3 rounded-xl transition-all border border-outline-variant group"
          >
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="font-label text-xs font-semibold uppercase tracking-wider">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-outline'}`}>
              <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-5' : 'left-1'}`} />
            </div>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-outline-variant py-3 px-4 font-label text-xs font-semibold tracking-widest uppercase hover:bg-primary hover:text-on-primary hover:border-primary transition-all rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-12 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl font-bold text-on-surface">Workspace</h2>
            <span className="text-outline text-xl">/</span>
            <span className="text-on-surface-variant text-sm font-medium capitalize">
              {location.pathname.split('/').pop()?.replace(/-/g, ' ')}
            </span>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="relative hidden lg:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input 
                className="bg-surface-variant/50 border border-outline-variant rounded-full pl-10 pr-4 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 placeholder:text-on-surface-variant/50 transition-all" 
                placeholder="Search resources..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-on-surface leading-none">Admin User</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Curator</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary-container flex items-center justify-center overflow-hidden border border-outline-variant shadow-soft">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </header>
        <main className="p-12 min-h-[calc(100vh-5rem)] relative overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

