import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant p-12 shadow-soft">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Brand Logo" className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">Curator Access</h1>
          <p className="font-body text-sm text-on-surface-variant italic">Enter your credentials to manage the archives</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-error-container text-on-error-container p-4 text-xs font-label uppercase tracking-widest border-l-4 border-error">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border-b border-outline outline-none p-4 focus:border-primary transition-colors font-body"
              placeholder="curator@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border-b border-outline outline-none p-4 focus:border-primary transition-colors font-body"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-on-primary py-5 rounded-default font-label font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all text-xs shadow-soft disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4 text-outline-variant">
          <div className="h-px flex-1 bg-current"></div>
          <span className="font-label text-[10px] uppercase tracking-widest">or</span>
          <div className="h-px flex-1 bg-current"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="mt-8 w-full flex items-center justify-center gap-3 border border-outline-variant py-4 px-6 font-label text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-low transition-colors rounded-default"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
          Continue with Google
        </button>

        <div className="mt-10 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-primary font-label text-[10px] uppercase tracking-widest font-bold hover:underline"
          >
            ← Return to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};
