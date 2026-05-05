import { ArrowLeft, ChevronRight, Key, Laptop, Lock, Shield, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';

export function SecuritySettings() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 xl:pb-0 flex flex-col items-center">
      <div className="w-full max-w-[420px] bg-white min-h-screen xl:min-h-[85vh] xl:mt-8 xl:rounded-[32px] xl:shadow-sm xl:border border-slate-100 flex flex-col">
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

              <motion.button whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 bg-slate-50 p-2 rounded-full border border-slate-100">
                    <Key size={18} />
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">Transaction PIN</span>
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
      </div>
    </div>
  );
}
