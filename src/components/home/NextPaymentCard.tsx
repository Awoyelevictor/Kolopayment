import { motion } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';

interface NextPaymentCardProps {
  contribution: any;
}

export function NextPaymentCard({ contribution }: NextPaymentCardProps) {
  const { navigate } = useNavigation();

  const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(amount));
  };

  const dueDate = new Date(contribution.due_date);
  const diffDays = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/50 backdrop-blur-md p-5 rounded-[32px] border border-white/60 shadow-[0_4px_20px_-4px_rgba(0,82,255,0.08)] mb-4"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100">
             📅
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-0.5">{contribution.group_name || 'Group Ajo'}</h3>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${diffDays <= 2 ? 'text-red-500' : 'text-slate-500'}`}>
              {diffDays <= 0 ? 'Due Today' : `Due in ${diffDays} days`} • {dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-bold text-[#0052FF] text-lg block">{formatAmount(contribution.amount)}</span>
        </div>
      </div>
      <motion.button 
        onClick={() => navigate('payment-flow', { contribution })}
        whileTap={{ scale: 0.98 }}
        whileHover={{ translateY: -2 }}
        className="w-full mt-2 bg-[#0052FF] text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-200"
      >
        Pay Now
      </motion.button>
    </motion.div>
  );
}
