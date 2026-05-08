import { ArrowUpRight, ArrowDownLeft, Calendar, Search, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useFirebase } from '../../context/FirebaseContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function PaymentsList() {
  const { navigate } = useNavigation();
  const { user } = useFirebase();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('completed');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const t = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(t);
      setIsLoading(false);
    }, (error) => {
      console.error("Transactions fetch error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#0052FF]" size={40} />
      </div>
    );
  }

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
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${t.type === 'contribution' ? 'bg-orange-50 text-orange-500' : 'bg-[#22C55E]/10 text-[#22C55E]'}`}>
                {t.type === 'contribution' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm mb-0.5">{t.description || (t.type === 'topup' ? 'Wallet Topup' : 'Contribution')}</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar size={12} /> {t.timestamp?.toDate?.()?.toLocaleDateString() || 'Today'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-bold block ${t.type === 'contribution' ? 'text-slate-900' : 'text-[#22C55E]'}`}>
                {t.type === 'contribution' ? '-' : '+'}₦{t.amount?.toLocaleString()}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${t.status === 'completed' || t.status === 'success' ? 'text-[#22C55E]' : 'text-yellow-500'}`}>
                {t.status}
              </span>
            </div>
          </motion.div>
        ))}

        {activeTab === 'completed' && transactions.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium">No transactions yet</p>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium">No upcoming payments</p>
          </div>
        )}
      </div>
    </div>
  );
}
