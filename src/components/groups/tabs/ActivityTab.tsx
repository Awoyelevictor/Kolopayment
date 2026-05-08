import { motion } from 'motion/react';
import { ArrowUpRight, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export function ActivityTab({ group }: { group: any }) {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!group) return;

    // Listen for transactions related to this group
    const q = query(
      collection(db, 'transactions'),
      where('groupId', '==', group.id),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: 'payment',
          title: `Contribution: ₦${data.amount.toLocaleString()}`,
          time: data.timestamp?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Recent',
          icon: <ArrowUpRight size={16} className="text-[#22C55E]" />,
          bg: 'bg-[#22C55E]/10'
        };
      });

      // Add a "created" event
      const createdEvent = {
        id: 'created-' + group.id,
        type: 'create',
        title: 'Group created',
        time: group.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently',
        icon: <Plus size={16} className="text-slate-600" />,
        bg: 'bg-slate-100'
      };

      setActivities([...txs, createdEvent]);
      setIsLoading(false);
    }, (error) => {
      console.error("Activity fetch error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [group]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#0052FF]" size={32} />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-slate-100 ml-4 pl-6 pb-4 space-y-8">
      {activities.map((item, idx) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative"
        >
          {/* Timeline Dot */}
          <div className={`absolute -left-[35px] h-8 w-8 rounded-full ${item.bg} flex items-center justify-center border-4 border-white shadow-sm`}>
            {item.icon}
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-0.5">{item.title}</h4>
            <p className="text-xs font-medium text-slate-400">{item.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
