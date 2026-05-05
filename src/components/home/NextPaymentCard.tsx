import { motion } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';

export function NextPaymentCard() {
  const { navigate } = useNavigation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-4"
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
        className="w-full mt-2 bg-[#0052FF]/10 text-[#0052FF] font-semibold py-3.5 rounded-2xl hover:bg-[#0052FF]/15 transition-colors"
      >
        Pay ₦5,000.00
      </motion.button>
    </motion.div>
  );
}
