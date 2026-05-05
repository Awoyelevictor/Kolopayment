import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { GroupListItem } from '../home/GroupListItem';
import { useNavigation } from '../../contexts/NavigationContext';

export function GroupsList() {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const activeGroups = [
    {
      id: 'g1',
      name: "CS Dept Ajo",
      amount: "₦5,000",
      frequency: "weekly",
      membersCount: 10,
      maxMembers: 10,
      progress: 0.3,
      isNextPayout: true,
    },
    {
      id: 'g2',
      name: "NYSC Squad",
      amount: "₦2,000",
      frequency: "weekly",
      membersCount: 6,
      maxMembers: 8,
      progress: 0.75,
    }
  ];

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
        {activeTab === 'active' && activeGroups.map((group, idx) => (
          <div key={group.id} onClick={() => navigate('group-details', { groupId: group.id })} className="cursor-pointer">
            <GroupListItem index={idx} {...group} />
          </div>
        ))}
        {activeTab === 'completed' && (
          <div className="text-center py-10 text-sm text-slate-500 font-medium">
            No completed groups yet.
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          whileHover={{ translateY: -2 }}
          className="w-full bg-white text-[#0052FF] font-semibold py-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <Plus size={20} /> Join a Group
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.98 }}
          whileHover={{ translateY: -2 }}
          className="w-full bg-[#0052FF]/10 text-[#0052FF] font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#0052FF]/15 transition-colors"
        >
          <Plus size={20} /> Create a New Group
        </motion.button>
      </div>
    </div>
  );
}
