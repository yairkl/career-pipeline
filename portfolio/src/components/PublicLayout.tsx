import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, UserCircle, Menu, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToSection } from '../utils/scroll';
import { GithubIcon, LinkedinIcon } from './BrandIcons';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { profile } = usePortfolioData();
  const { theme, toggleTheme } = useTheme();

  const name = profile?.name || "PORTFOLIO";
  const email = profile?.email || "email@example.com";

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToSection(id);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen selection:bg-primary/20 transition-colors duration-500 font-body">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant"
      >
        <nav className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-20 md:h-24">
          <Link to="/" className="flex items-center gap-4 group" onClick={(e) => handleScroll(e as any, 'home')}>
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-soft group-hover:scale-105 transition-transform duration-300">
              <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Brand Logo" className="w-full h-full object-cover" />
            </div>
            <div className="text-xl font-display font-bold tracking-tight text-primary uppercase group-hover:opacity-80 transition-opacity">{name}</div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <a className="font-label text-xs uppercase tracking-[0.2em] font-bold text-primary border-b-2 border-primary pb-1 cursor-pointer" onClick={(e) => handleScroll(e, 'home')}>Home</a>
            <a className="font-label text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant hover:text-primary transition-all hover:-translate-y-0.5" href="#about" onClick={(e) => handleScroll(e, 'about')}>About</a>
            <a className="font-label text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant hover:text-primary transition-all hover:-translate-y-0.5" href="#projects" onClick={(e) => handleScroll(e, 'projects')}>Projects</a>
            
            <div className="flex items-center gap-6 pl-8 border-l border-outline-variant">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-surface-variant/50 hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-all hover:scale-110 active:scale-95"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              
              <Link to="/admin" className="p-2.5 rounded-xl bg-surface-variant/50 hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-all hover:scale-110 active:scale-95" title="Admin Portal">
                <UserCircle className="w-5 h-5" />
              </Link>
              
              <a className="bg-primary text-on-primary px-8 py-3.5 rounded-xl text-xs font-label font-bold uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all" href="#contact" onClick={(e) => handleScroll(e, 'contact')}>Connect</a>
            </div>
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-xl bg-surface-variant text-primary hover:scale-105 transition-transform"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-b border-outline-variant overflow-hidden"
            >
              <div className="flex flex-col p-8 gap-6">
                <a className="font-label text-sm uppercase tracking-widest font-bold text-on-surface" onClick={(e) => handleScroll(e, 'home')}>Home</a>
                <a className="font-label text-sm uppercase tracking-widest font-bold text-on-surface" onClick={(e) => handleScroll(e, 'about')}>About</a>
                <a className="font-label text-sm uppercase tracking-widest font-bold text-on-surface" onClick={(e) => handleScroll(e, 'projects')}>Projects</a>
                <a className="font-label text-sm uppercase tracking-widest font-bold text-on-surface" onClick={(e) => handleScroll(e, 'contact')}>Connect</a>
                <div className="flex items-center gap-4 pt-6 border-t border-outline-variant">
                  <button onClick={toggleTheme} className="p-3 rounded-xl bg-surface-variant text-primary">
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </button>
                  <Link to="/admin" className="p-3 rounded-xl bg-surface-variant text-primary">
                    <UserCircle className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="pt-20 md:pt-24">
        {children}
      </main>

      <footer className="bg-surface border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-soft">
              <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Brand Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-primary uppercase leading-tight">{name}</div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant mt-1">Creative Technologist</p>
            </div>
          </div>
          
          <div className="flex gap-10 items-center">
            {[
              { icon: LinkedinIcon, href: profile?.linkedin, label: 'LinkedIn' },
              { icon: GithubIcon, href: profile?.github, label: 'GitHub' },
              { icon: Mail, href: `mailto:${email}`, label: 'Email' }
            ].map((social) => (
              <a 
                key={social.label}
                aria-label={social.label} 
                className="text-on-surface-variant hover:text-primary transition-all hover:scale-125 active:scale-95" 
                href={social.href || "#"}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
          
          <div className="text-right">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">© {new Date().getFullYear()} PORTFOLIO ARCHIVE</p>
            <p className="font-label text-[8px] uppercase tracking-[0.3em] text-primary mt-2">Designed for Excellence</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

