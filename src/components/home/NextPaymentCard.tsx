import { motion } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';

export function NextPaymentCard() {
  const { navigate } = useNavigation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/50 backdrop-blur-md p-5 rounded-3xl border border-white/60 shadow-[0_2px_16px_-4px_rgba(0,82,255,0.06)] mb-4"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">CS Dept Ajo</h3>
          <p className="text-xs font-medium text-slate-500">Due in 2 days • 24 May, 2024</p>
        </div>
        <div className="text-right">
          <span className="font-bold text-[#0052FF] text-lg block">₦5,000.00</span>
        </div>
      </div>
      <motion.button 
        onClick={() => navigate('payment-drawer', { groupId: 'g1', goBackTo: 'home' })}
        whileTap={{ scale: 0.98 }}
        whileHover={{ translateY: -2 }}
        className="w-full mt-2 bg-[#0052FF]/10 text-[#0052FF] font-semibold py-3.5 rounded-2xl hover:bg-[#0052FF]/15 transition-all duration-200 backdrop-blur-md"
      >
        Pay ₦5,000.00
      </motion.button>
    </motion.div>
  );
}
