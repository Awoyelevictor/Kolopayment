import { Plus, ShieldCheck, ShieldAlert, Star, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useFirebase } from '../../../context/FirebaseContext';

export function MembersTab({ group }: { group: any }) {
  const { user } = useFirebase();
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!group) return;

    const unsubscribe = onSnapshot(collection(db, 'groups', group.id, 'members'), (snapshot) => {
      const m = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(m);
      setIsLoading(false);
    }, (error) => {
      console.error("Members fetch error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [group]);

  const renderStars = (score: number = 5) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={12} 
            className={star <= score ? "text-amber-400 fill-amber-400" : "text-slate-200"} 
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#0052FF]" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="divide-y divide-slate-100">
        {members.map((member, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={member.id} 
            className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 text-center text-xs font-semibold text-slate-400">
                {idx + 1}
              </div>
              <div className="h-10 w-10 bg-[#0052FF]/10 text-[#0052FF] rounded-full flex items-center justify-center font-bold text-sm shadow-inner relative">
                U
                {member.uid === group.adminId && (
                  <div className="absolute -bottom-1 -right-1 bg-[#0052FF] text-white text-[8px] px-1 rounded-sm font-bold shadow-sm">
                    A
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                  UID: {member.uid?.substring(0, 5)} 
                  {member.uid === user?.uid && <span className="text-[10px] text-slate-400 font-normal">(You)</span>}
                  <ShieldCheck size={14} className="text-emerald-500" />
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {renderStars(5)}
                  <span className="text-[10px] text-slate-500 font-medium">5.0</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
               <span className="text-xs font-medium text-slate-400">Position</span>
               <span className="text-sm font-bold text-slate-900">#{member.position}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-4 bg-slate-50/50">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => navigator.clipboard.writeText(group.joinCode)}
          className="w-full bg-white border border-dashed border-slate-300 text-[#0052FF] font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#0052FF]/5 hover:border-[#0052FF]/30 transition-colors shadow-sm"
        >
          <Plus size={18} /> Invite (Copy Code: {group.joinCode})
        </motion.button>
      </div>
    </div>
  );
}
