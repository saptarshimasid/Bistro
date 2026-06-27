import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Key, Mail, ShieldAlert, UtensilsCrossed, Zap } from 'lucide-react';
import { UserRole, UserProfile, SystemSettings } from '../types';
import { INITIAL_STAFF } from '../data/mockData';

interface LoginViewProps {
  onLogin: (user: UserProfile) => void;
  settings: SystemSettings;
}

export default function LoginView({ onLogin, settings }: LoginViewProps) {
  const [email, setEmail] = useState('admin@dineflow.com');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick-fill credentials based on role selection
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    
    switch (role) {
      case 'Admin':
        setEmail('admin@dineflow.com');
        setPassword('dineflowadmin');
        break;
      case 'Manager':
        setEmail('manager@dineflow.com');
        setPassword('dineflowmanager');
        break;
      case 'Chef':
        setEmail('chef.rossi@dineflow.com');
        setPassword('dineflowchef');
        break;
      case 'Waiter':
        setEmail('waiter.sarah@dineflow.com');
        setPassword('dineflowwaiter');
        break;
      case 'Cashier':
        setEmail('cashier.marcus@dineflow.com');
        setPassword('dineflowcashier');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate authenticating
    setTimeout(() => {
      setIsLoading(false);
      
      // Find matching staff member to copy profile, or generate fallback
      const matchingStaff = INITIAL_STAFF.find(
        (s) => s.role === selectedRole && s.attendanceStatus === 'Present'
      );
      
      const userProfile: UserProfile = {
        id: matchingStaff?.id || `u_${selectedRole.toLowerCase()}`,
        name: matchingStaff?.name || `Demo ${selectedRole}`,
        role: selectedRole,
        email: email,
        avatar: matchingStaff?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      };

      onLogin(userProfile);
    }, 1200);
  };

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'Admin', label: 'Admin', desc: 'Full System Control' },
    { role: 'Manager', label: 'Manager', desc: 'Roster & Settings' },
    { role: 'Chef', label: 'Chef', desc: 'Kitchen KDS Display' },
    { role: 'Waiter', label: 'Waiter', desc: 'Orders & Tables' },
    { role: 'Cashier', label: 'Cashier', desc: 'Billing & Reports' },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden font-sans">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 pointer-events-none opacity-45">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-orange-600/25 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-amber-600/15 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      {/* Decorative Rotating Geometric Border */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/[0.02] rounded-full pointer-events-none animate-spin-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-gold-500/[0.03] border-dashed rounded-full pointer-events-none" />

      {/* Main Login Card Wrapper */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
        id="login-container"
      >
        {/* Left Side: Branding & Role Fast-Select */}
        <div className="lg:col-span-5 flex flex-col justify-between text-left space-y-8" id="login-brand-side">
          <div className="space-y-4">
            {settings.brandLogo && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 p-1 flex items-center justify-center shadow-lg shadow-gold-500/5 mb-2"
              >
                <img src={settings.brandLogo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </motion.div>
            )}
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-medium text-amber-400">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>{settings.restaurantName} v1.0 Standard Edition</span>
            </div>
            
            <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-amber-400 to-orange-500">Perfect Dining</span> Workflows
            </h1>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              The premium, high-fidelity restaurant management suite. Experience fluid coordination across host, kitchen, cashier, and management.
            </p>
          </div>

          {/* Quick-fill Role Select Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Demo Portal Fast-Login
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {rolesList.map((item) => {
                const isActive = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleRoleSelect(item.role)}
                    className={`group w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-300 ${
                      isActive 
                        ? 'bg-amber-500/10 border-gold-500 text-white shadow-lg shadow-gold-500/5' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors duration-300 ${
                        isActive ? 'bg-gold-500 text-black' : 'bg-white/5 group-hover:bg-white/10 text-gray-400'
                      }`}>
                        <UtensilsCrossed className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{item.desc}</p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-ping mr-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-gray-600 font-mono">
            Protected under Bistro high-security sandbox.
          </div>
        </div>

        {/* Right Side: Glassmorphism Login Form */}
        <div className="lg:col-span-7 flex items-center justify-center" id="login-form-side">
          <div className="w-full glass-card glow-gold p-8 lg:p-10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl" />
            
            <div className="mb-8 space-y-1">
              <h2 className="font-display text-2xl font-bold text-white">Sign In</h2>
              <p className="text-xs text-gray-400">Enter credentials or select a role to automatically generate details.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 transition-all duration-300 font-sans"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Security Password</label>
                  <button 
                    type="button" 
                    onClick={() => alert(`Your demo password for ${selectedRole} is: dineflow${selectedRole.toLowerCase()}`)}
                    className="text-xs text-gold-500 hover:text-gold-600 hover:underline transition-all"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 transition-all duration-300 font-sans font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-gray-400 hover:text-gray-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 bg-white/5 text-amber-500 focus:ring-0 focus:ring-offset-0 w-4 h-4"
                  />
                  <span className="text-xs">Remember role selection</span>
                </label>
                <span className="text-[11px] text-gray-500 font-mono">Role: {selectedRole}</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 disabled:from-gray-700 disabled:to-gray-800 text-black font-semibold rounded-xl text-sm transition-all duration-300 shadow-lg shadow-gold-500/10 active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Portal...</span>
                  </div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Enter {selectedRole} Dashboard</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
