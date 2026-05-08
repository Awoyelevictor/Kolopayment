import { motion } from 'motion/react';
import { useFirebase } from '../../../context/FirebaseContext';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useNavigation } from '../../../contexts/NavigationContext';
import { Loader2, LogOut, ArrowRightCircle } from 'lucide-react';

export function OverviewTab({ group }: { group: any }) {
  const { navigate } = useNavigation();
  const { user } = useFirebase();
  const [memberInfo, setMemberInfo] = useState<any>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  
  useEffect(() => {
    if (!user || !group) return;
    
    const fetchMemberInfo = async () => {
      const q = query(
        collection(db, 'groups', group.id, 'members'),
        where('uid', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setMemberInfo(snapshot.docs[0].data());
      }
    };
    
    fetchMemberInfo();
  }, [user, group]);

  const handleLeaveGroup = async () => {
    if (!user || !group) return;
    if (!window.confirm("Are you sure you want to leave this group?")) return;

    setIsLeaving(true);
    try {
      // 1. Remove from group members
      await deleteDoc(doc(db, 'groups', group.id, 'members', user.uid));
      // 2. Remove from user memberships
      await deleteDoc(doc(db, 'users', user.uid, 'memberships', group.id));
      
      navigate('groups');
    } catch (err) {
      console.error("Leave Group Error:", err);
      alert("Failed to leave group. Please try again.");
    } finally {
      setIsLeaving(false);
    }
  };

  const payoutOrder = Array.from({ length: group.maxMembers }, (_, i) => ({
    number: i + 1,
    status: i < 2 ? 'paid' : i === 2 ? 'current' : 'pending',
    isYou: memberInfo?.position === i + 1
  }));

  return (
    <div className="space-y-8 pb-10">
      {/* Payout Order */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 tracking-tight">Payout Order</h3>
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
          {payoutOrder.map((pos, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div 
                className={`h-12 w-12 rounded-full flex items-center justify-center font-bold relative
                  ${pos.status === 'paid' ? 'bg-slate-100 text-slate-400' : 
                    pos.status === 'current' ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/30' : 
                    'border-2 border-slate-100 bg-white text-slate-500'}`}
              >
                {pos.number}
                {pos.isYou && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
                )}
              </div>
              {pos.isYou && <span className="text-[10px] font-bold text-[#0052FF]">You</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Group Progress */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Group Progress</h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">Week 2 of {group.maxMembers}</span>
        </div>
        
        <p className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">20% <span className="text-sm font-medium text-slate-500">Complete</span></p>
        
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '20%' }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-[#0052FF] rounded-full"
          />
        </div>
      </div>

      {/* Your Position Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Your Position</p>
          <p className="text-xl font-bold text-[#0052FF]">Week {memberInfo?.position || '?'}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Expected Date</p>
          <p className="text-sm font-bold text-slate-900 mt-1">Calculating...</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-3">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('payment-drawer', { groupId: group.id })}
          className="w-full bg-[#0052FF] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
        >
          <ArrowRightCircle size={22} />
          Fast Payment to Group
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleLeaveGroup}
          disabled={isLeaving}
          className="w-full border border-red-100 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {isLeaving ? <Loader2 size={22} className="animate-spin" /> : <LogOut size={22} />}
          Leave Group
        </motion.button>
      </div>
    </div>
  );
}

