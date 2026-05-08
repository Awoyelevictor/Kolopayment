import { motion } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useFirebase } from '../../context/FirebaseContext';
import { useState, useEffect } from 'react';
import { collection, query, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function NextPaymentCard() {
  const { navigate } = useNavigation();
  const { user } = useFirebase();
  const [nextGroup, setNextGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'memberships'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setNextGroup({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Next payment fetch error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (isLoading || !nextGroup) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-4"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-1">{nextGroup.name}</h3>
          <p className="text-xs font-medium text-slate-500">Upcoming contribution • {nextGroup.cycle}</p>
        </div>
        <div className="text-right">
          <span className="font-bold text-[#0052FF] text-lg block">₦{nextGroup.amount.toLocaleString()}</span>
        </div>
      </div>
      <motion.button 
        onClick={() => navigate('payment-drawer', { groupId: nextGroup.id, goBackTo: 'home' })}
        whileTap={{ scale: 0.98 }}
        whileHover={{ translateY: -2 }}
        className="w-full mt-2 bg-[#0052FF]/10 text-[#0052FF] font-semibold py-3.5 rounded-2xl hover:bg-[#0052FF]/15 transition-colors"
      >
        Pay ₦{nextGroup.amount.toLocaleString()}
      </motion.button>
    </motion.div>
  );
}
