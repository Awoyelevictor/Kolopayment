import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft, ShieldCheck, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { Logo } from '../common/Logo';
import { api } from '../../services/api';

type Step = 'intro' | 'welcome' | 'create' | 'login' | 'bvn' | 'success';

export function AuthFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>('intro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    bvn: ''
  });

  useEffect(() => {
    if (step === 'intro') {
      const timer = setTimeout(() => {
        setStep('welcome');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const goBack = () => {
    setError(null);
    if (step === 'create' || step === 'login') setStep('welcome');
    if (step === 'bvn') setStep('create');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleRegister = async () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const [firstName, ...lastNames] = formData.fullName.split(' ');
      await api.register({
        first_name: firstName,
        last_name: lastNames.join(' '),
        phone_number: formData.phoneNumber,
        email: formData.email,
        password: formData.password
      });
      setStep('bvn');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.email && !formData.phoneNumber) {
      setError("Please enter your email or phone number");
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.login({
        username: formData.email || formData.phoneNumber,
        password: formData.password
      });
      
      const profile = await api.getProfile();
      if (!profile.is_bvn_verified) {
        setStep('bvn');
      } else {
        onComplete();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleBvnVerify = async () => {
    if (formData.bvn.length !== 11) {
      setError("BVN must be 11 digits");
      return;
    }
    
    setLoading(true);
    try {
      await api.verifyBvn(formData.bvn);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'BVN verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center sm:justify-center overflow-hidden transition-colors duration-700 ${step === 'intro' ? 'bg-[#0052FF]' : 'bg-gradient-to-br from-[#F0F5FF] via-[#DBEAFE] to-[#F8FAFC] pt-10 px-6 sm:pt-0'}`}>
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div 
              layoutId="logo-container"
              className="bg-white p-6 rounded-3xl shadow-2xl relative z-10"
            >
              <Logo className="w-24 h-24" />
            </motion.div>
            
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0, 0.1, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -left-32 w-96 h-96 bg-white rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0, 0.15, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-32 -right-32 w-96 h-96 bg-white rounded-full blur-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        className={`w-full max-w-[393px] mx-auto min-h-[660px] rounded-3xl shadow-[0_8px_32px_rgba(0,82,255,0.08)] border border-white/60 overflow-hidden relative flex flex-col transition-all duration-500 z-10 ${step === 'intro' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 bg-white/40 backdrop-blur-2xl'}`}
      >
        
        {/* Header with Progress Dots */}
        {(step === 'create' || step === 'login' || step === 'bvn') && (
          <div className="flex items-center justify-between p-6 z-10 relative bg-transparent">
            <button onClick={goBack} className="p-2 -ml-2 text-slate-500 hover:text-[#0052FF] transition-colors rounded-full hover:bg-white/50" disabled={loading}>
              <ArrowLeft size={20} />
            </button>
            
            {step !== 'login' && (
              <div className="flex gap-2">
                {['create', 'bvn', 'success'].map((s, i) => {
                  const currentIndex = ['create', 'bvn', 'success'].indexOf(step);
                  return (
                    <div 
                      key={s} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-[#0052FF]' : i < currentIndex ? 'w-2 bg-[#0052FF]' : 'w-2 bg-[#0052FF]/20'}`} 
                    />
                  );
                })}
              </div>
            )}
            <div className="w-8" />
          </div>
        )}

        {/* Content area */}
        <div className={`flex-1 flex flex-col relative overflow-y-auto hide-scrollbar ${step === 'welcome' ? '' : 'px-6 pb-8'}`}>
          <AnimatePresence mode="wait">
            
            {step === 'welcome' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col h-full relative z-0 bg-transparent"
              >
                <div className="pt-12 pb-6 px-6 w-full flex flex-col items-center">
                  <motion.div layoutId="logo-container" className="mb-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    <Logo className="w-12 h-12" />
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold tracking-tight text-slate-900 mb-2"
                  >
                    Welcome to KoloPay
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-500 text-sm max-w-[260px] text-center"
                  >
                    The smart way to save and grow together.
                  </motion.p>
                </div>
                
                <div className="flex-1 w-full relative flex items-center justify-center py-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="relative w-full px-8 flex items-center justify-center"
                  >
                    <img src="/saving_illustration.png" alt="Saving together" className="w-full h-auto mix-blend-multiply" />
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full px-6 pb-8 pt-6 relative"
                >
                  <button 
                    onClick={() => { setError(null); setStep('create'); }}
                    className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mb-3 hover:bg-[#003BBA] transition-colors shadow-[0_4px_14px_0_rgba(0,82,255,0.39)]"
                  >
                    Sign Up
                  </button>
                  <button 
                    onClick={() => { setError(null); setStep('login'); }}
                    className="w-full bg-white/60 text-[#0052FF] font-semibold py-4 rounded-2xl border border-white/80 hover:bg-white/80 backdrop-blur-md transition-colors shadow-sm"
                  >
                    Log In
                  </button>
                </motion.div>
              </motion.div>
            )}

            {step === 'create' && (
              <motion.div 
                key="create"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col bg-transparent"
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">Create Account</h1>
                  <p className="text-slate-500 text-sm">Join the community and start saving.</p>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="space-y-4 flex-1">
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white/80 transition-colors" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white/80 transition-colors" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address (Optional)" className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white/80 transition-colors" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Create Password" className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white/80 transition-colors" />
                  </div>
                  
                  <div className="pt-2 flex items-start gap-3">
                     <input type="checkbox" defaultChecked className="mt-1 flex-shrink-0" />
                     <p className="text-xs text-slate-500 leading-relaxed">I agree to the Terms &amp; Conditions and Privacy Policy.</p>
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-6 shadow-[0_4px_14px_0_rgba(0,82,255,0.39)] hover:bg-[#003BBA] flex items-center justify-center disabled:opacity-70 backdrop-blur-md"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : 'Continue'}
                </motion.button>
              </motion.div>
            )}

            {step === 'login' && (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col bg-transparent"
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">Welcome Back</h1>
                  <p className="text-slate-500 text-sm">Log in to manage your savings groups.</p>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="space-y-4 flex-1">
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="text" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email or Phone" className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white/80 transition-colors" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white/80 transition-colors" />
                  </div>
                  <div className="flex justify-end">
                    <button className="text-[#0052FF] text-sm font-semibold">Forgot Password?</button>
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-6 shadow-[0_4px_14px_0_rgba(0,82,255,0.39)] hover:bg-[#003BBA] flex items-center justify-center disabled:opacity-70 backdrop-blur-md"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : 'Log In'}
                </motion.button>
              </motion.div>
            )}

            {step === 'bvn' && (
               <motion.div 
                key="bvn"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-1 bg-transparent"
              >
                <div className="mb-8 text-center pt-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Verify Your Identity</h1>
                  <p className="text-slate-500 text-sm px-4">We use BVN to verify your identity and keep your account secure.</p>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Enter BVN</label>
                    <div className="relative">
                      <input type="text" name="bvn" value={formData.bvn} onChange={handleInputChange} maxLength={11} placeholder="•••••••••••" className="w-full pl-4 pr-12 py-4 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white/80 transition-colors text-lg tracking-[0.2em] font-medium" />
                      <ShieldCheck className="absolute right-4 top-4 text-slate-400" size={24} />
                    </div>
                  </div>

                  <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl mt-6 border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
                    <ul className="space-y-3 text-sm text-slate-600 font-medium">
                      <li className="flex items-center gap-3"><Check size={18} className="text-[#0052FF]" /> Your information is secure</li>
                      <li className="flex items-center gap-3"><Check size={18} className="text-[#0052FF]" /> Used for verification only</li>
                      <li className="flex items-center gap-3"><Check size={18} className="text-[#0052FF]" /> 100% confidential</li>
                    </ul>
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBvnVerify}
                  disabled={loading}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-6 shadow-[0_4px_14px_0_rgba(0,82,255,0.39)] hover:bg-[#003BBA] flex justify-center disabled:opacity-70 backdrop-blur-md"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : 'Verify BVN'}
                </motion.button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center flex-1 text-center py-12 bg-transparent"
              >
                <div className="mb-12 mt-12">
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Success!</h1>
                </div>

                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
                  className="w-28 h-28 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-10 relative"
                >
                  <div className="absolute inset-0 bg-[#22C55E]/20 rounded-full animate-ping opacity-20" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                  >
                    <Check size={56} className="text-[#22C55E]" strokeWidth={3} />
                  </motion.div>
                </motion.div>

                <p className="text-slate-500 mb-12 max-w-[240px] font-medium leading-relaxed">
                  Your account has been verified successfully.
                </p>

                <div className="w-full mt-auto">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={onComplete}
                    className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl shadow-[0_4px_14px_0_rgba(0,82,255,0.39)] hover:bg-[#003BBA] backdrop-blur-md"
                  >
                    Continue to App
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}


