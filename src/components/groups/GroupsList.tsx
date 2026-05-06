import { Plus, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { GroupListItem } from '../home/GroupListItem';
import { useNavigation } from '../../contexts/NavigationContext';
import { api } from '../../services/api';

export function GroupsList() {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await api.getGroups();
        // Assuming API returns an array or { results: [] } for paginated data
        const groupsList = Array.isArray(data) ? data : data.results || [];
        setGroups(groupsList);
      } catch (err) {
        console.error('Failed to load groups:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(amount));
  };

  const activeGroups = groups.filter(g => g.status === 'ACTIVE' || g.status === 'FORMING');
  const completedGroups = groups.filter(g => g.status === 'COMPLETED');

  return (
    <div className="px-6 pt-10 pb-12 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Groups</h1>
        <button className="h-10 w-10 bg-white/60 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06)]">
          <Plus size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-white/40 mb-6 relative">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 font-medium text-sm transition-colors relative z-10 ${activeTab === 'active' ? 'text-[#0052FF]' : 'text-slate-500'}`}
        >
          Active ({activeGroups.length})
          {activeTab === 'active' && (
            <motion.div layoutId="groupTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052FF] rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`pb-3 font-medium text-sm transition-colors relative z-10 ${activeTab === 'completed' ? 'text-[#0052FF]' : 'text-slate-500'}`}
        >
          Completed ({completedGroups.length})
          {activeTab === 'completed' && (
            <motion.div layoutId="groupTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052FF] rounded-t-full" />
          )}
        </button>
      </div>

      {/* List */}
      <div className="space-y-4 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <Loader2 className="animate-spin text-[#0052FF]" size={32} />
          </div>
        ) : (
          <>
            {activeTab === 'active' && activeGroups.map((group, idx) => (
              <div key={group.id} onClick={() => navigate('group-details', { groupId: group.id })} className="cursor-pointer">
                <GroupListItem 
                  index={idx} 
                  name={group.name} 
                  amount={formatAmount(group.contribution_amount)} 
                  frequency={group.contribution_frequency} 
                  membersCount={group.current_members} 
                  maxMembers={group.max_members} 
                  progress={group.current_members / group.max_members} 
                  isNextPayout={false} 
                />
              </div>
            ))}
            {activeTab === 'active' && activeGroups.length === 0 && (
              <div className="text-center py-10 text-sm text-slate-500 font-medium">
                You don't have any active groups yet.
              </div>
            )}
            
            {activeTab === 'completed' && completedGroups.map((group, idx) => (
              <div key={group.id} onClick={() => navigate('group-details', { groupId: group.id })} className="cursor-pointer">
                <GroupListItem 
                  index={idx} 
                  name={group.name} 
                  amount={formatAmount(group.contribution_amount)} 
                  frequency={group.contribution_frequency} 
                  membersCount={group.current_members} 
                  maxMembers={group.max_members} 
                  progress={1} 
                  isNextPayout={false} 
                />
              </div>
            ))}
            {activeTab === 'completed' && completedGroups.length === 0 && (
              <div className="text-center py-10 text-sm text-slate-500 font-medium">
                No completed groups yet.
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          whileHover={{ translateY: -2 }}
          className="w-full bg-white/50 backdrop-blur-md text-[#0052FF] font-semibold py-4 rounded-2xl border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,82,255,0.06)] flex items-center justify-center gap-2 hover:bg-white/70 transition-all"
        >
          <Plus size={20} /> Join a Group
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.98 }}
          whileHover={{ translateY: -2 }}
          className="w-full bg-[#0052FF]/10 backdrop-blur-md text-[#0052FF] font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#0052FF]/15 transition-all border border-[#0052FF]/10"
        >
          <Plus size={20} /> Create a New Group
        </motion.button>
      </div>
    </div>
  );
}
