import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, CreditCard, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VirtualAccount {
  account_number: string;
  bank_name: string;
  account_name: string;
}

export function AddMoneyModal({ isOpen, onClose }: AddMoneyModalProps) {
  const [copied, setCopied] = useState(false);
  const [account, setAccount] = useState<VirtualAccount | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchVirtualAccount();
    }
  }, [isOpen]);

  const fetchVirtualAccount = async () => {
    setLoading(true);
    try {
      const data = await api.getVirtualAccount();
      setAccount(data);
    } catch (err) {
      console.error('Failed to fetch virtual account:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!account) return;
    navigator.clipboard.writeText(account.account_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardTopup = () => {
    // In a real Payaza integration, this would open the Checkout URL
    alert("This will open Payaza Checkout for instant card payment.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-2xl overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#0052FF]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Add Money</h2>
                <button 
                  onClick={onClose}
                  className="p-2 -mr-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100/50"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-blue-50 text-[#0052FF] rounded-full flex items-center justify-center">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Bank Transfer</h3>
                      <p className="text-xs text-slate-500">Payaza Dynamic Account</p>
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="animate-spin text-[#0052FF]" size={24} />
                    </div>
                  ) : account ? (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-500">{account.bank_name}</span>
                        <span className="text-xs font-medium text-slate-900 truncate ml-2">{account.account_name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-slate-900 text-lg tracking-wider">{account.account_number}</span>
                        <button 
                          onClick={handleCopy}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#0052FF] bg-[#0052FF]/10 px-2 py-1 rounded-lg hover:bg-[#0052FF]/20 transition-colors"
                        >
                          {copied ? (
                            <><CheckCircle2 size={14} /> Copied</>
                          ) : (
                            <><Copy size={14} /> Copy</>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-red-500 text-center py-2">Failed to load account details.</p>
                  )}
                  
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-400">
                    <CheckCircle2 size={10} className="text-green-500" />
                    Powered by Payaza Staq
                  </div>
                </div>

                <button 
                  onClick={handleCardTopup}
                  className="w-full bg-white/60 p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:bg-white transition-colors group"
                >
                  <div className="h-10 w-10 bg-slate-50 group-hover:bg-blue-50 group-hover:text-[#0052FF] text-slate-600 rounded-full flex items-center justify-center transition-colors">
                    <CreditCard size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-slate-900 text-sm group-hover:text-[#0052FF] transition-colors">Top up with Card</h3>
                    <p className="text-xs text-slate-500">Payaza Checkout</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
