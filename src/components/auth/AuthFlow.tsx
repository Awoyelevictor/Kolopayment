import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft, ShieldCheck, Mail, Lock, User, Phone } from 'lucide-react';
import { Logo } from '../common/Logo';

type Step = 'intro' | 'welcome' | 'create' | 'login' | 'bvn' | 'success';

export function AuthFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>('intro');

  useEffect(() => {
    if (step === 'intro') {
      const timer = setTimeout(() => {
        setStep('welcome');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const goBack = () => {
    if (step === 'create' || step === 'login') setStep('welcome');
    if (step === 'bvn') setStep('create');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center sm:justify-center overflow-hidden transition-colors duration-700 ${step === 'intro' ? 'bg-[#0052FF]' : 'bg-[#F8FAFC] pt-10 px-6 sm:pt-0'}`}>
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
        className={`w-full max-w-[393px] mx-auto bg-white min-h-[660px] rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative flex flex-col transition-opacity duration-500 z-10 ${step === 'intro' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
      >
        
        {/* Header with Progress Dots */}
        {(step === 'create' || step === 'login' || step === 'bvn') && (
          <div className="flex items-center justify-between p-6 z-10 relative bg-white">
            <button onClick={goBack} className="p-2 -ml-2 text-slate-500 hover:text-[#0052FF] transition-colors rounded-full hover:bg-slate-50">
              <ArrowLeft size={20} />
            </button>
            
            {step !== 'login' && (
              <div className="flex gap-2">
                {['create', 'bvn', 'success'].map((s, i) => {
                  const currentIndex = ['create', 'bvn', 'success'].indexOf(step);
                  return (
                    <div 
                      key={s} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-[#0052FF]' : i < currentIndex ? 'w-2 bg-[#0052FF]' : 'w-2 bg-slate-200'}`} 
                    />
                  );
                })}
              </div>
            )}
            <div className="w-8" />
          </div>
        )}

        {/* Content area */}
        <div className={`flex-1 flex flex-col relative overflow-hidden ${step === 'welcome' ? '' : 'px-6 pb-8'}`}>
          <AnimatePresence mode="wait">
            
            {step === 'welcome' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col h-full bg-white relative z-0"
              >
                <div className="pt-12 pb-6 px-6 w-full flex flex-col items-center">
                  <motion.div layoutId="logo-container" className="mb-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
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
                
                <div className="flex-1 w-full relative flex items-center justify-center">
                  {/* Flat minimalist illustration to replace blurry shapes */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="relative w-64 h-56 flex items-end justify-center pb-4"
                  >
                    {/* Background Arc */}
                    <div className="absolute inset-0 bg-[#0052FF]/5 rounded-t-full border-t border-x border-[#0052FF]/10" />
                    
                    {/* Abstract Users/Community */}
                    <div className="flex items-end gap-2 z-10 relative">
                      <div className="w-12 h-20 bg-blue-100 rounded-t-full flex flex-col items-center justify-start py-3 drop-shadow-sm border border-white">
                        <div className="w-5 h-5 rounded-full bg-blue-200" />
                      </div>
                      <div className="w-16 h-28 bg-[#0052FF] rounded-t-full flex flex-col items-center justify-start py-4 drop-shadow-lg border-2 border-white z-20">
                        <div className="w-7 h-7 rounded-full bg-white/20" />
                      </div>
                      <div className="w-12 h-24 bg-orange-100 rounded-t-full flex flex-col items-center justify-start py-3 drop-shadow-sm border border-white">
                        <div className="w-5 h-5 rounded-full bg-orange-200" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full px-6 pb-8 pt-6 relative bg-white"
                >
                  <button 
                    onClick={() => setStep('create')}
                    className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mb-3 hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Sign Up
                  </button>
                  <button 
                    onClick={() => setStep('login')}
                    className="w-full bg-slate-50 text-slate-800 font-semibold py-4 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors"
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
                className="flex-1 flex flex-col absolute inset-0 px-6 pb-8 top-[80px] bg-white relative z-0"
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">Create Account</h1>
                  <p className="text-slate-500 text-sm">Join the community and start saving.</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="text" placeholder="Full Name" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="tel" placeholder="Phone Number" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="password" placeholder="Create Password" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" />
                  </div>
                  
                  <div className="pt-2 flex items-start gap-3">
                     <input type="checkbox" defaultChecked className="mt-1 flex-shrink-0" />
                     <p className="text-xs text-slate-500 leading-relaxed">I agree to the Terms & Conditions and Privacy Policy.</p>
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('bvn')}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-6 shadow-sm hover:bg-blue-700"
                >
                  Continue
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
                className="flex-1 flex flex-col absolute inset-0 px-6 pb-8 top-[80px] bg-white relative z-0"
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">Welcome Back</h1>
                  <p className="text-slate-500 text-sm">Log in to manage your savings groups.</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="email" placeholder="Email Address" defaultValue="goodluck@gmail.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input type="password" placeholder="Password" defaultValue="••••••••" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" />
                  </div>
                  <div className="flex justify-end">
                    <button className="text-[#0052FF] text-sm font-semibold">Forgot Password?</button>
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={onComplete}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-6 shadow-sm hover:bg-blue-700"
                >
                  Log In
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
                className="flex flex-col flex-1 absolute inset-0 px-6 pb-8 top-[80px] bg-white relative z-0"
              >
                <div className="mb-8 text-center pt-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Verify Your Identity</h1>
                  <p className="text-slate-500 text-sm px-4">We use BVN to verify your identity and keep your account secure.</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Enter BVN</label>
                    <div className="relative">
                      <input type="text" placeholder="•••• •••• ••••" className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors text-lg tracking-[0.2em] font-medium" />
                      <ShieldCheck className="absolute right-4 top-4 text-slate-400" size={24} />
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] p-4 rounded-2xl mt-6 border border-slate-100">
                    <ul className="space-y-3 text-sm text-slate-600 font-medium">
                      <li className="flex items-center gap-3"><Check size={18} className="text-[#0052FF]" /> Your information is secure</li>
                      <li className="flex items-center gap-3"><Check size={18} className="text-[#0052FF]" /> Used for verification only</li>
                      <li className="flex items-center gap-3"><Check size={18} className="text-[#0052FF]" /> 100% confidential</li>
                    </ul>
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('success')}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-6 shadow-sm hover:bg-blue-700"
                >
                  Verify BVN
                </motion.button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center flex-1 text-center py-12 absolute inset-0 px-6 pb-8 top-0 bg-white relative z-0"
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
                    className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl shadow-sm hover:bg-blue-700"
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

