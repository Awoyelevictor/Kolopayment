import { Eye, EyeOff, Plus, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { AddMoneyModal } from '../payment/AddMoneyModal';

interface BalanceCardProps {
  trustScore?: number;
  balance?: number | string;
}

export function BalanceCard({ trustScore = 100, balance = 0 }: BalanceCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);

  const formatAmount = (amount: string | number) => {
    const parts = Number(amount).toFixed(2).split('.');
    return {
      whole: new Intl.NumberFormat('en-NG').format(Number(parts[0])),
      decimal: parts[1]
    };
  };

  const amountParts = formatAmount(balance);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0052FF] via-[#0047E0] to-[#003BBA] p-6 text-white shadow-[0_20px_40px_-12px_rgba(0,82,255,0.3)]"
      >
        {/* Glassmorphism decorative elements */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-200" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Trust Score: {trustScore}</span>
            </div>
            <button 
              onClick={() => setIsVisible(!isVisible)}
              className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
            >
              {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          
          <div className="mb-8">
            <p className="text-white/70 text-xs font-medium mb-1 tracking-wide uppercase">Total Savings</p>
            <h2 className={`text-4xl font-bold tracking-tight mb-1 transition-all duration-300 ${isVisible ? '' : 'blur-md select-none opacity-80'}`}>
              ₦{amountParts.whole}.<span className="text-2xl opacity-60">{amountParts.decimal}</span>
            </h2>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-white/10">
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Available to Withdraw</p>
              <p className={`font-bold text-lg tracking-tight transition-all duration-300 ${isVisible ? '' : 'blur-md select-none opacity-80'}`}>
                ₦{amountParts.whole}.{amountParts.decimal}
              </p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddMoneyOpen(true)}
              className="h-12 w-12 bg-white text-[#0052FF] rounded-full flex items-center justify-center shadow-lg transition-colors border border-white"
            >
              <Plus size={24} strokeWidth={3} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AddMoneyModal isOpen={isAddMoneyOpen} onClose={() => setIsAddMoneyOpen(false)} />
    </>
  );
}
