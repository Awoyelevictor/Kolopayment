import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft, ShieldCheck, Mail, Lock, User, Phone, Users, Wallet, TrendingUp, Loader2 } from 'lucide-react';
import { Logo } from '../common/Logo';
import { payazaService } from '../../services/payazaService';
import { auth, db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

type Step = 'intro' | 'welcome' | 'create' | 'login' | 'bvn' | 'success';

export function AuthFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>('intro');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    bvn: ''
  });

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Demo credentials
      await signInWithEmailAndPassword(auth, 'demo@kolopay.com', 'password123');
      onComplete();
    } catch (err: any) {
      // If demo account doesn't exist, create it for the first time
      if (err.code === 'auth/user-not-found') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, 'demo@kolopay.com', 'password123');
          const user = userCredential.user;
          await setDoc(doc(db, 'users', user.uid), {
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@kolopay.com',
            phone: '+234 800 000 0000',
            walletBalance: 25000,
            isVerified: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          onComplete();
        } catch (createErr: any) {
          console.error('Demo Creation Error:', createErr);
          if (createErr.code === 'auth/operation-not-allowed') {
            setError('Email login is disabled in Firebase Console.');
          } else {
            setError('Failed to initialize demo account');
          }
        }
      } else {
        let message = err.message || 'Demo login failed';
        if (err.code === 'auth/operation-not-allowed') {
          message = 'Email login is disabled. Please enable it in the Firebase Console.';
        }
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'intro') {
      const timer = setTimeout(() => {
        setStep('welcome');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSignUp = async () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Create Firestore Profile
      const userProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        walletBalance: 0,
        isVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userProfile);
        setStep('bvn');
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }
    } catch (err: any) {
      console.error('Signup Error:', err);
      let message = err.message || 'Signup failed';
      if (err.code === 'auth/operation-not-allowed') {
        message = 'Email signup is disabled. Please enable "Email/Password" in your Firebase Authentication settings.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Connection failed. Please check your internet or disable ad-blockers.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // FirebaseContext listener will handle the app redirect
      onComplete();
    } catch (err: any) {
      console.error('Login Error:', err);
      let message = err.message || 'Login failed';
      if (err.code === 'auth/operation-not-allowed') {
        message = 'Email login is disabled. Please enable "Email/Password" in your Firebase Authentication settings.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Connection failed. Please check your internet or disable ad-blockers.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyBvn = async () => {
    if (!formData.bvn) {
      setError('Please enter your BVN');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError('Session expired. Please log in again.');
      setStep('login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Real Payaza BVN Verification Call
      const result = await payazaService.verifyBvn({
        bvn: formData.bvn,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      console.log('BVN Verification Result:', result);

      // Update Firestore with verification status
      try {
        await setDoc(doc(db, 'users', currentUser.uid), {
          bvn: formData.bvn,
          isVerified: true,
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        setStep('success');
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    } catch (err: any) {
      console.error('BVN Verification Error:', err);
      setError(err.response?.data?.message || 'Verification failed. Please check your BVN.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className={`flex-1 flex flex-col relative overflow-y-auto hide-scrollbar ${step === 'welcome' ? '' : 'px-6 pb-8'}`}>
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
                <div className="pt-8 pb-4 px-6 w-full flex flex-col items-center">
                  <motion.div layoutId="logo-container" className="mb-4 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 z-10 relative">
                    <Logo className="w-10 h-10" />
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold tracking-tight text-slate-900 mb-1"
                  >
                    Welcome to KoloPay
                  </motion.h1>
                </div>
                
                <div className="flex-1 w-full relative flex flex-col items-center justify-center px-6">
                  {/* Live Character Output */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <motion.div 
                      animate={{ y: [0, -12, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="relative w-28 h-28 bg-gradient-to-tr from-[#0052FF] to-blue-400 rounded-3xl shadow-xl shadow-blue-500/30 flex items-center justify-center border-b-[6px] border-blue-600 mb-8 z-10"
                    >
                       {/* Drop Shadow */}
                       <div className="absolute -bottom-8 w-20 h-4 bg-slate-200 rounded-full blur-[2px]" />
                       
                       {/* Eyes */}
                       <div className="flex gap-4 absolute top-8">
                          <motion.div
                            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                            transition={{ repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] }}
                            className="w-4 h-6 bg-white rounded-full"
                          />
                          <motion.div
                            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                            transition={{ repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] }}
                            className="w-4 h-6 bg-white rounded-full"
                          />
                       </div>
                       {/* Cheeks */}
                       <div className="absolute top-12 -left-2 w-4 h-3 bg-pink-400/50 rounded-full blur-[2px]" />
                       <div className="absolute top-12 -right-2 w-4 h-3 bg-pink-400/50 rounded-full blur-[2px]" />
                       
                       {/* Coin slot */}
                       <div className="absolute top-0 w-10 h-1.5 bg-black/20 rounded-full" />
                    </motion.div>
                  </motion.div>

                  {/* Features */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full space-y-4 max-w-[280px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0052FF] flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 leading-none mb-1">Secure Ajo Savings</h3>
                        <p className="text-[11px] text-slate-500 leading-tight">Your funds are safe and protected.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <Users size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 leading-none mb-1">Group Management</h3>
                        <p className="text-[11px] text-slate-500 leading-tight">Track members and automatic payouts.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                        <TrendingUp size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 leading-none mb-1">Build Trust & Grow</h3>
                        <p className="text-[11px] text-slate-500 leading-tight">Increase your trust score over time.</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full px-6 pb-8 pt-6 relative bg-white mt-auto"
                >
                  <button 
                    onClick={() => setStep('login')}
                    className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mb-3 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setStep('create')}
                    className="w-full bg-slate-50 text-slate-800 font-semibold py-4 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    Sign Up
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
                className="flex-1 flex flex-col bg-white"
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">Create Account</h1>
                  <p className="text-slate-500 text-sm">Join the community and start saving.</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <User className="absolute left-4 top-4 text-slate-400" size={20} />
                      <input 
                        type="text" 
                        placeholder="First Name" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" 
                      />
                    </div>
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        placeholder="Last Name" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" 
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" 
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input 
                      type="password" 
                      placeholder="Create Password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" 
                    />
                  </div>
                  
                  <div className="pt-2 flex items-start gap-3">
                     <input type="checkbox" defaultChecked className="mt-1 flex-shrink-0" />
                     <p className="text-xs text-slate-500 leading-relaxed">I agree to the Terms & Conditions and Privacy Policy.</p>
                  </div>
                  {error && <p className="text-red-500 text-xs mt-2 font-medium bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  onClick={handleSignUp}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-auto shadow-sm hover:bg-blue-700 transition-all disabled:bg-blue-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Continue'}
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
                className="flex-1 flex flex-col bg-white"
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">Welcome Back</h1>
                  <p className="text-slate-500 text-sm">Log in to manage your savings groups.</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" 
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="text-[#0052FF] text-sm font-semibold">Forgot Password?</button>
                  </div>
                  {error && <p className="text-red-500 text-xs mt-2 font-medium bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
                </div>

                <div className="mt-auto space-y-3">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    onClick={handleLogin}
                    className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl shadow-sm hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Log In'}
                  </motion.button>
                  
                  <button 
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                    className="w-full bg-slate-50 text-slate-600 font-semibold py-4 rounded-2xl border border-dashed border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                  >
                    Login as Demo User
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'bvn' && (
               <motion.div 
                key="bvn"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-1 bg-white"
              >
                <div className="mb-8 text-center pt-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Verify Your Identity</h1>
                  <p className="text-slate-500 text-sm px-4">We use BVN to verify your identity and keep your account secure.</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Enter BVN</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="•••• •••• ••••" 
                        maxLength={11}
                        value={formData.bvn}
                        onChange={(e) => setFormData({...formData, bvn: e.target.value.replace(/\D/g, '')})}
                        className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors text-lg tracking-[0.2em] font-medium" 
                      />
                      <ShieldCheck className="absolute right-4 top-4 text-slate-400" size={24} />
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
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
                  disabled={isLoading}
                  onClick={handleVerifyBvn}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-auto shadow-sm hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin" size={20} /> Verifying...</>
                  ) : (
                    'Verify BVN'
                  )}
                </motion.button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center flex-1 text-center py-12 bg-white"
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

