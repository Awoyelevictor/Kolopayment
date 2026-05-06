import { ArrowLeft, Settings, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { OverviewTab } from './tabs/OverviewTab';
import { MembersTab } from './tabs/MembersTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { ActivityTab } from './tabs/ActivityTab';
import { api } from '../../services/api';

export function GroupDetails() {
  const { navigate, params } = useNavigation();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Members' | 'Payments' | 'Activity'>('Overview');
  const [groupData, setGroupData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const groupId = params?.groupId || 1; // Fallback to 1 for testing if no param

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const data = await api.getGroupDetails(groupId);
        setGroupData(data);
      } catch (err) {
        console.error('Failed to load group details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupDetails();
  }, [groupId]);

  const tabs = ['Overview', 'Members', 'Payments', 'Activity'] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#0052FF] mb-4" size={40} />
        <p className="text-slate-500 font-medium">Loading group details...</p>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Group Not Found</h2>
        <p className="text-slate-500 mb-6">We couldn't find the group you're looking for.</p>
        <button 
          onClick={() => navigate('groups')}
          className="bg-[#0052FF] text-white px-6 py-3 rounded-xl font-semibold shadow-sm"
        >
          Back to Groups
        </button>
      </div>
    );
  }

  const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(amount));
  };

  return (
    <div className="min-h-screen pb-24 xl:pb-0">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-xl px-6 pt-10 pb-6 border-b border-white/40 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('groups')} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-white/50">
            <ArrowLeft size={24} />
          </button>
          <button className="p-2 -mr-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-white/50">
            <Settings size={22} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">{groupData.name}</h1>
            <p className="text-xs font-medium text-slate-500">Group ID: #{groupData.id.toString().padStart(6, '0')} <span className="inline-block ml-1 opacity-50 cursor-pointer hover:opacity-100">📋</span></p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${groupData.status === 'ACTIVE' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-orange-100 text-orange-600'}`}>
            {groupData.status}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Target</p>
            <p className="font-bold text-slate-900">{formatAmount(groupData.target_amount || (groupData.contribution_amount * groupData.max_members))}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Contribution</p>
            <p className="font-bold text-slate-900">{formatAmount(groupData.contribution_amount)} <span className="text-xs font-medium text-slate-500 block capitalize">{groupData.contribution_frequency}</span></p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Members</p>
            <p className="font-bold text-slate-900">{groupData.current_members} / {groupData.max_members}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 border-b border-white/40 overflow-x-auto hide-scrollbar bg-white/40 backdrop-blur-xl sticky top-[210px] z-10 shadow-sm">
        <div className="flex gap-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 pt-4 font-medium text-sm transition-colors relative z-10 ${activeTab === tab ? 'text-[#0052FF]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="groupDetailsTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052FF] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-6 max-w-2xl mx-auto">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.2 }}
        >
          {activeTab === 'Overview' && <OverviewTab groupData={groupData} />}
          {activeTab === 'Members' && <MembersTab groupData={groupData} />}
          {activeTab === 'Payments' && <PaymentsTab groupData={groupData} />}
          {activeTab === 'Activity' && <ActivityTab groupData={groupData} />}
        </motion.div>
      </div>
    </div>
  );
}
