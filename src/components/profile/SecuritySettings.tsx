import { ArrowLeft, ChevronRight, Key, Laptop, Lock, Shield, Trash2, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useState } from 'react';
import { useFirebase } from '../../context/FirebaseContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function SecuritySettings() {
  const { navigate } = useNavigation();
  const { user, userProfile } = useFirebase();
  const [showPinForm, setShowPinForm] = useState(false);
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  });

  const handleSavePin = async () => {
    if (!user) return;
    if (formData.newPin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }
    if (formData.newPin !== formData.confirmPin) {
      setError("PINs do not match");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // In a real app, we would verify current PIN first via backend
      // Here we just update the user profile
      await updateDoc(doc(db, 'users', user.uid), {
        transactionPin: formData.newPin,
        hasPin: true,
        updatedAt: new Date().toISOString()
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowPinForm(false);
        setFormData({ currentPin: '', newPin: '', confirmPin: '' });
      }, 2000);
    } catch (err: any) {
      console.error("Save PIN Error:", err);
      setError("Failed to save PIN. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 xl:pb-0 flex flex-col items-center">
      <div className="w-full max-w-[420px] bg-white min-h-screen xl:min-h-[85vh] xl:mt-8 xl:rounded-[32px] xl:shadow-sm xl:border border-slate-100 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          {!showPinForm ? (
            <motion.div 
              key="settings-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col flex-1"
            >
              {/* Header */}
              <div className="flex items-center px-6 pt-10 pb-6 border-b border-slate-100">
                <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50">
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 ml-2">Security Settings</h1>
              </div>

              <div className="flex-1 px-6 py-6">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                  <div className="divide-y divide-slate-100">
                    <motion.button whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-slate-400 bg-slate-50 p-2 rounded-full border border-slate-100">
                          <Lock size={18} />
                        </div>
                        <span className="font-semibold text-slate-700 text-sm">Change Password</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </motion.button>

                    <motion.button 
                      whileTap={{ scale: 0.98 }} 
                      onClick={() => setShowPinForm(true)}
                      className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-slate-400 bg-slate-50 p-2 rounded-full border border-slate-100">
                          <Key size={18} />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700 text-sm block text-left">Transaction PIN</span>
                          <span className="text-[10px] text-slate-400 block text-left">{userProfile?.hasPin ? 'PIN is active' : 'Not set up'}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </motion.button>

                    <div className="w-full flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <div className="text-slate-400 bg-slate-50 p-2 rounded-full border border-slate-100">
                          <Shield size={18} />
                        </div>
                        <span className="font-semibold text-slate-700 text-sm">Two-Factor Authentication</span>
                      </div>
                      {/* Custom Toggle */}
                      <div className="w-11 h-6 bg-[#0052FF] rounded-full relative cursor-pointer shadow-inner">
                         <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>

                    <motion.button whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-slate-400 bg-slate-50 p-2 rounded-full border border-slate-100">
                          <Laptop size={18} />
                        </div>
                        <span className="font-semibold text-slate-700 text-sm">Login Devices</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-400">3 devices</span>
                        <ChevronRight size={18} className="text-slate-300" />
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Destructive Action */}
                <div className="bg-white rounded-3xl border border-red-100 shadow-sm overflow-hidden border-dashed">
                  <motion.button whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-between p-5 hover:bg-red-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="text-red-500 bg-red-50 p-2 rounded-full border border-red-100">
                        <Trash2 size={18} />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold text-red-600 text-sm block mb-0.5">Delete Account</span>
                        <span className="text-xs text-slate-500 leading-tight block">Permanently delete your account and all data.</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="pin-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col flex-1"
            >
              {/* Header */}
              <div className="flex items-center px-6 pt-10 pb-6 border-b border-slate-100">
                <button onClick={() => setShowPinForm(false)} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50">
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 ml-2">Transaction PIN</h1>
              </div>

              <div className="flex-1 px-6 py-6">
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  Protect your transactions with a 4-digit PIN. This will be required for withdrawals and contributions.
                </p>

                <div className="space-y-5">
                  {userProfile?.hasPin && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Current PIN</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPin ? "text" : "password"}
                          maxLength={4}
                          value={formData.currentPin}
                          onChange={(e) => setFormData({...formData, currentPin: e.target.value.replace(/\D/g, '')})}
                          placeholder="••••"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-mono text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:bg-white transition-all"
                        />
                        <button 
                          onClick={() => setShowCurrentPin(!showCurrentPin)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2"
                        >
                          {showCurrentPin ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">New PIN</label>
                    <div className="relative">
                      <input 
                        type={showNewPin ? "text" : "password"}
                        maxLength={4}
                        value={formData.newPin}
                        onChange={(e) => setFormData({...formData, newPin: e.target.value.replace(/\D/g, '')})}
                        placeholder="••••"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-mono text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:bg-white transition-all"
                      />
                      <button 
                        onClick={() => setShowNewPin(!showNewPin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2"
                      >
                        {showNewPin ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm New PIN</label>
                    <input 
                      type="password"
                      maxLength={4}
                      value={formData.confirmPin}
                      onChange={(e) => setFormData({...formData, confirmPin: e.target.value.replace(/\D/g, '')})}
                      placeholder="••••"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-mono text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:bg-white transition-all"
                    />
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-medium ml-1">
                      {error}
                    </motion.p>
                  )}
                </div>

                <div className="mt-10">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSavePin}
                    disabled={isSaving || success || formData.newPin.length !== 4 || formData.confirmPin.length !== 4}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                      success ? 'bg-green-500 text-white' : 'bg-[#0052FF] text-white disabled:bg-slate-200'
                    }`}
                  >
                    {isSaving ? (
                      <Loader2 size={22} className="animate-spin" />
                    ) : success ? (
                      <><CheckCircle2 size={22} /> PIN Saved!</>
                    ) : (
                      'Save PIN'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

