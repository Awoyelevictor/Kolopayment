import { Check, ReceiptText } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';

export function PaymentSuccess() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Confetti-like shapes */}
      <motion.div 
         animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
         transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
         className="absolute top-[20%] left-[15%] w-4 h-4 bg-yellow-400 rounded-full blur-[1px]"
      />
      <motion.div 
         animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
         transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
         className="absolute bottom-[25%] right-[20%] w-6 h-6 bg-[#0052FF]/40 rounded-lg blur-[1px] transform rotate-45"
      />
      
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="bg-white rounded-[32px] p-8 w-full max-w-[360px] shadow-xl shadow-blue-500/10 flex flex-col items-center text-center relative z-10 border border-slate-100"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 150, delay: 0.1 }}
          className="w-24 h-24 bg-[#22C55E]/10 text-[#22C55E] rounded-full flex items-center justify-center mb-6"
        >
          <div className="w-16 h-16 bg-[#22C55E] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#22C55E]/30">
            <Check size={36} strokeWidth={3} />
          </div>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Success!</h1>
          <p className="text-slate-500 mb-8">Your payment of ₦5,000 for Week 3 has been received.</p>
        </motion.div>
        
        <div className="w-full space-y-3">
          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-700 font-semibold py-4 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <ReceiptText size={20} /> View Receipt
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('home')}
            className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
