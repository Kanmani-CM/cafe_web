import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Coffee, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminLoginPageProps {
  navigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ navigate }) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('admin@auroracafe.com');
  const [password, setPassword] = useState('AdminPassword123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      showToast('Authenticated successfully. Welcome back to Aurora Management.', 'success', 'Welcome');
      navigate('/admin');
    } catch (err: any) {
      const msg = err.message || 'Invalid email or password credentials.';
      setError(msg);
      showToast(msg, 'error', 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 max-w-md mx-auto px-4 sm:px-6 text-left">
      <div className="bg-[#F5EFE6] rounded-3xl p-8 sm:p-10 border border-[#ECE2D0] shadow-xl space-y-6">
        {/* Brand Icon */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#261611] text-[#DE9B56] flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#261611]">
            Staff & Admin Sign In
          </h1>
          <p className="text-xs text-[#734E41]">
            Access the Aurora Café management console to update menu, reservations, and guest inquiries.
          </p>
        </div>

        {/* Demo Hint Banner */}
        <div className="p-3.5 bg-[#FAF7F2] border border-[#E0D3BE] rounded-2xl text-xs space-y-1 text-[#52352B]">
          <div className="flex items-center gap-1.5 font-semibold text-[#261611]">
            <Info className="w-3.5 h-3.5 text-[#C47D3C]" />
            <span>Default Seed Credentials:</span>
          </div>
          <p className="text-[11px] font-mono text-[#734E41]">
            Email: <strong>admin@auroracafe.com</strong><br />
            Password: <strong>AdminPassword123!</strong>
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#734E41] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@auroracafe.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#734E41] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#261611] text-[#FAF7F2] hover:bg-[#38221B] font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#DE9B56]" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#734E41] hover:text-[#261611] hover:underline"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
