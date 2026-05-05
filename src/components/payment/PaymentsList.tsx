import { ArrowUpRight, ArrowDownLeft, Calendar, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';

export function PaymentsList() {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('completed');

  const transactions = [
    { id: 1, type: 'sent', group: 'CS Dept Ajo', amount: '₦5,000', date: '20 May, 2024', status: 'success' },
    { id: 2, type: 'received', group: 'NYSC Squad', amount: '₦20,000', date: '18 May, 2024', status: 'success' },
    { id: 3, type: 'sent', group: 'CS Dept Ajo', amount: '₦5,000', date: '13 May, 2024', status: 'success' },
    { id: 4, type: 'sent', group: 'NYSC Squad', amount: '₦2,000', date: '11 May, 2024', status: 'failed' },
  ];

  return (
    <div className="px-6 pt-10 pb-24 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments</h1>
        <button className="h-10 w-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
          <Search size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 mb-6 relative">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 font-medium text-sm transition-colors relative z-10 ${activeTab === 'upcoming' ? 'text-[#0052FF]' : 'text-slate-500'}`}
        >
          Upcoming
          {activeTab === 'upcoming' && (
            <motion.div layoutId="paymentTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052FF] rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`pb-3 font-medium text-sm transition-colors relative z-10 ${activeTab === 'completed' ? 'text-[#0052FF]' : 'text-slate-500'}`}
        >
          Completed
          {activeTab === 'completed' && (
            <motion.div layoutId="paymentTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052FF] rounded-t-full" />
          )}
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'completed' && transactions.map((t, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={t.id}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${t.type === 'sent' ? 'bg-orange-50 text-orange-500' : 'bg-[#22C55E]/10 text-[#22C55E]'}`}>
                {t.type === 'sent' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm mb-0.5">{t.group}</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar size={12} /> {t.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-bold block ${t.type === 'sent' ? 'text-slate-900' : 'text-[#22C55E]'}`}>
                {t.type === 'sent' ? '-' : '+'}{t.amount}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${t.status === 'success' ? 'text-[#22C55E]' : 'text-red-500'}`}>
                {t.status}
              </span>
            </div>
          </motion.div>
        ))}

        {activeTab === 'upcoming' && (
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-4">
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
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('payment-flow', { groupId: 'g1' })}
              className="w-full mt-2 bg-[#0052FF]/10 text-[#0052FF] font-semibold py-3.5 rounded-2xl hover:bg-[#0052FF]/15 transition-colors"
            >
              Pay Now
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
