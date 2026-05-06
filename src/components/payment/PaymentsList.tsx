import { ArrowUpRight, ArrowDownLeft, Calendar, Search, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { api } from '../../services/api';

export function PaymentsList() {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('completed');
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await api.getContributions();
        setContributions(data);
      } catch (err) {
        console.error('Failed to load contributions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(amount));
  };

  const completed = contributions.filter(c => c.status === 'paid');
  const upcoming = contributions.filter(c => c.status === 'pending');

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
          Upcoming ({upcoming.length})
          {activeTab === 'upcoming' && (
            <motion.div layoutId="paymentTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052FF] rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`pb-3 font-medium text-sm transition-colors relative z-10 ${activeTab === 'completed' ? 'text-[#0052FF]' : 'text-slate-500'}`}
        >
          Completed ({completed.length})
          {activeTab === 'completed' && (
            <motion.div layoutId="paymentTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052FF] rounded-t-full" />
          )}
        </button>
      </div>

      <div className="space-y-4 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <Loader2 className="animate-spin text-[#0052FF]" size={32} />
          </div>
        ) : (
          <>
            {activeTab === 'completed' && completed.map((t, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={t.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-orange-50 text-orange-500">
                    <ArrowUpRight size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-0.5">{t.group_name || 'Group Contribution'}</h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Calendar size={12} /> {new Date(t.paid_at || t.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold block text-slate-900">
                    -{formatAmount(t.amount)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#22C55E]">
                    Paid
                  </span>
                </div>
              </motion.div>
            ))}

            {activeTab === 'upcoming' && upcoming.map((t, idx) => (
              <div key={t.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{t.group_name || 'Group Contribution'}</h3>
                    <p className="text-xs font-medium text-slate-500">Due • {new Date(t.due_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#0052FF] text-lg block">{formatAmount(t.amount)}</span>
                  </div>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('payment-flow', { contribution: t })}
                  className="w-full mt-2 bg-[#0052FF] text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/20"
                >
                  Pay Now
                </motion.button>
              </div>
            ))}

            {((activeTab === 'completed' && completed.length === 0) || (activeTab === 'upcoming' && upcoming.length === 0)) && (
               <div className="text-center py-20">
                  <p className="text-slate-400 text-sm font-medium">No transactions found.</p>
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
