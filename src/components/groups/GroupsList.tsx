import { Plus, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { GroupListItem } from '../home/GroupListItem';
import { useNavigation } from '../../contexts/NavigationContext';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '../../context/FirebaseContext';

export function GroupsList() {
  const { navigate } = useNavigation();
  const { user } = useFirebase();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'memberships')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const g = snapshot.docs.map(doc => ({ id: doc.data().groupId, ...doc.data() }));
      setGroups(g);
      setIsLoading(false);
    }, (error) => {
      console.error("Memberships fetch error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredGroups = groups.filter(g => 
    activeTab === 'active' ? g.status === 'active' : g.status === 'completed'
  );

  return (
    <div className="px-6 pt-10 pb-12 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Groups</h1>
        <button className="h-10 w-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
          <Plus size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 mb-6 relative">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 font-medium text-sm transition-colors relative z-10 ${activeTab === 'active' ? 'text-[#0052FF]' : 'text-slate-500'}`}
        >
          Active (2)
          {activeTab === 'active' && (
            <motion.div layoutId="groupTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052FF] rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`pb-3 font-medium text-sm transition-colors relative z-10 ${activeTab === 'completed' ? 'text-[#0052FF]' : 'text-slate-500'}`}
        >
          Completed (3)
          {activeTab === 'completed' && (
            <motion.div layoutId="groupTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052FF] rounded-t-full" />
          )}
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[#0052FF]" size={32} />
          </div>
        ) : filteredGroups.length > 0 ? filteredGroups.map((group, idx) => (
          <div key={group.id} onClick={() => navigate('group-details', { groupId: group.id })} className="cursor-pointer">
            <GroupListItem 
              index={idx} 
              name={group.name} 
              amount={`₦${group.amount.toLocaleString()}`} 
              frequency={group.cycle} 
              membersCount={8} 
              maxMembers={group.maxMembers} 
              progress={0.4} 
            />
          </div>
        )) : (
          <div className="text-center py-10 text-sm text-slate-500 font-medium bg-slate-50 rounded-3xl border border-slate-100">
            No {activeTab} groups found.
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          whileHover={{ translateY: -2 }}
          onClick={() => navigate('join-group')}
          className="w-full bg-white text-[#0052FF] font-semibold py-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <Plus size={20} /> Join a Group
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.98 }}
          whileHover={{ translateY: -2 }}
          onClick={() => navigate('create-group')}
          className="w-full bg-[#0052FF]/10 text-[#0052FF] font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#0052FF]/15 transition-colors"
        >
          <Plus size={20} /> Create a New Group
        </motion.button>
      </div>
    </div>
  );
}
