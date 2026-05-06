import { Eye, EyeOff, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { AddMoneyModal } from '../payment/AddMoneyModal';

export function BalanceCard() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0052FF] via-[#0047E0] to-[#003BBA] p-6 text-white shadow-[0_8px_32px_-4px_rgba(0,82,255,0.35)]"
      >
        {/* Glassmorphism decorative elements */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-sm font-medium">Total Savings Balance</p>
            <button 
              onClick={() => setIsVisible(!isVisible)}
              className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
            >
              {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          
          <div className="mb-6">
            <h2 className={`text-4xl font-bold tracking-tight mb-1 transition-all duration-300 ${isVisible ? '' : 'blur-md select-none opacity-80'}`}>
              ₦52,600.00
            </h2>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-white/15">
            <div>
              <p className="text-white/70 text-xs font-medium mb-1">Available Balance</p>
              <p className={`font-semibold text-lg tracking-tight transition-all duration-300 ${isVisible ? '' : 'blur-md select-none opacity-80'}`}>
                ₦12,600.00
              </p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddMoneyOpen(true)}
              className="h-12 w-12 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-white/20"
            >
              <Plus size={24} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AddMoneyModal isOpen={isAddMoneyOpen} onClose={() => setIsAddMoneyOpen(false)} />
    </>
  );
}
