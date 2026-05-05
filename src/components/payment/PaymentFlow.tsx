import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';
import { ArrowLeft, Check, Smartphone, LayoutGrid, CreditCard } from 'lucide-react';

export function PaymentFlow() {
  const { navigate, activeGroupId } = useNavigation();
  const [step, setStep] = useState(1); // 1: Make Payment, 2: Success
  const [selectedMethod, setSelectedMethod] = useState('payaza');

  return (
    <div className="min-h-screen bg-black/60 flex flex-col justify-end xl:justify-center items-center fixed inset-0 z-50 p-0 xl:p-6 pb-0 xl:pb-6">
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-[480px] mx-auto bg-white min-h-[85vh] xl:min-h-[600px] rounded-t-[32px] xl:rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col mt-auto xl:mt-0"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="make-payment"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col px-6 py-6 absolute inset-0 overflow-y-auto hide-scrollbar pb-safe"
            >
              {/* Drawer Handle (Mobile only) */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 xl:hidden" />

              {/* Header */}
              <div className="flex items-center justify-between mb-8 flex-shrink-0">
                <button onClick={() => navigate('group-details', { groupId: activeGroupId })} className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <h1 className="font-semibold text-slate-900">Make Payment</h1>
                <div className="w-8" />
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6 flex items-start gap-4 flex-shrink-0">
                <div className="h-10 w-10 bg-white border border-slate-200 rounded-full flex items-center justify-center flex-shrink-0 text-lg shadow-sm">
                  🎯
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Paying for</p>
                  <h3 className="font-bold text-slate-900 leading-tight">CS Dept Ajo</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Week 3 Contribution</p>
                </div>
              </div>

              {/* Amount */}
              <div className="mb-8 flex-shrink-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Amount</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">₦5,000.00</span>
                </div>
                <div className="flex justify-between items-center bg-red-50 text-red-600 px-3 py-2 rounded-xl border border-red-100">
                  <span className="text-xs font-semibold">Due Date: 24 May, 2024</span>
                  <span className="text-[10px] uppercase font-bold tracking-wide bg-white px-2 py-1 rounded shadow-sm">2 days left</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex-1 flex-shrink-0 pb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Pay with</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setSelectedMethod('payaza')}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedMethod === 'payaza' ? 'border-[#0052FF] bg-[#0052FF]/5 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${selectedMethod === 'payaza' ? 'bg-[#0052FF] text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-500'}`}>
                        <Smartphone size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-slate-900">Payaza <span className="text-[10px] bg-[#22C55E]/10 text-[#22C55E] px-1.5 py-0.5 rounded font-bold ml-2 border border-green-200/50">Recommended</span></p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Instant transfer</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMethod === 'payaza' ? 'border-[#0052FF]' : 'border-slate-300'}`}>
                      {selectedMethod === 'payaza' && <motion.div layoutId="paymentMethodDot" className="h-2.5 w-2.5 rounded-full bg-[#0052FF]" />}
                    </div>
                  </button>

                  <button 
                    onClick={() => setSelectedMethod('bank')}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedMethod === 'bank' ? 'border-[#0052FF] bg-[#0052FF]/5 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${selectedMethod === 'bank' ? 'bg-white border-blue-200 text-[#0052FF] shadow-md shadow-blue-500/10' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <LayoutGrid size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-slate-900">Bank Transfer</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMethod === 'bank' ? 'border-[#0052FF]' : 'border-slate-300'}`}>
                      {selectedMethod === 'bank' && <motion.div layoutId="paymentMethodDot" className="h-2.5 w-2.5 rounded-full bg-[#0052FF]" />}
                    </div>
                  </button>

                  <button 
                    onClick={() => setSelectedMethod('card')}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedMethod === 'card' ? 'border-[#0052FF] bg-[#0052FF]/5 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${selectedMethod === 'card' ? 'bg-white border-blue-200 text-[#0052FF] shadow-md shadow-blue-500/10' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <CreditCard size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-slate-900">Card</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMethod === 'card' ? 'border-[#0052FF]' : 'border-slate-300'}`}>
                      {selectedMethod === 'card' && <motion.div layoutId="paymentMethodDot" className="h-2.5 w-2.5 rounded-full bg-[#0052FF]" />}
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-auto pt-6 bg-white shrink-0">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ translateY: -2 }}
                  onClick={() => setStep(2)}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/30"
                >
                  Pay ₦5,000.00
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center flex-1 py-12 absolute inset-0 px-6 pb-6 text-center overflow-y-auto hide-scrollbar pb-safe"
            >
              <div className="mb-8 mt-4 shrink-0">
                 <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment Successful!</h1>
                 <p className="text-sm font-medium text-slate-500 mt-2">You paid ₦5,000.00 to CS Dept Ajo</p>
                 <p className="text-xs font-medium text-slate-400 mt-1">Week 3 Contribution</p>
              </div>

              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
                className="w-24 h-24 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-10 relative shrink-0"
              >
                <div className="absolute inset-0 bg-[#22C55E]/20 rounded-full animate-ping opacity-20" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                >
                  <Check size={48} className="text-[#22C55E]" strokeWidth={3} />
                </motion.div>
              </motion.div>

              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 text-left text-sm space-y-4 shadow-inner shrink-0">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Amount</span>
                  <span className="font-bold text-slate-900">₦5,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Date</span>
                  <span className="font-bold text-slate-900">20 May, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Time</span>
                  <span className="font-bold text-slate-900">10:35 AM</span>
                </div>
                <div className="pt-4 border-t border-slate-200 border-dashed flex justify-between">
                  <span className="text-slate-500 font-medium">Transaction ID</span>
                  <span className="font-bold text-[#0052FF]">PYZ-38490238</span>
                </div>
              </div>

              <div className="w-full mt-auto space-y-3 shrink-0 pt-6">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ translateY: -2 }}
                  onClick={() => navigate('group-details', { groupId: activeGroupId })}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/30"
                >
                  Back to Group
                </motion.button>
                <button className="w-full text-[#0052FF] font-semibold py-3 hover:underline">
                  View Receipt
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
