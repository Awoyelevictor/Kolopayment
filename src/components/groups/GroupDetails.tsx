import { ArrowLeft, Settings, Loader2, UserPlus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [joining, setJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  const groupId = params?.groupId;

  const fetchGroupDetails = async () => {
    if (!groupId) return;
    try {
      const data = await api.getGroupDetails(groupId);
      setGroupData(data);
    } catch (err) {
      console.error('Failed to load group details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const handleJoin = async () => {
    if (!groupId) return;
    setJoining(true);
    try {
      await api.joinGroup(groupId);
      setJoinSuccess(true);
      setTimeout(() => {
        setJoinSuccess(false);
        fetchGroupDetails();
      }, 2000);
    } catch (err) {
      console.error('Failed to join group:', err);
      alert('Failed to join group. Please try again.');
    } finally {
      setJoining(false);
    }
  };

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
    <div className="min-h-screen pb-24 xl:pb-0 relative">
      <AnimatePresence>
        {joinSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-6 right-6 z-[60] bg-green-500 text-white p-4 rounded-2xl shadow-xl flex items-center justify-center gap-2"
          >
            <Check size={20} strokeWidth={3} />
            <span className="font-bold">Successfully joined the group!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white/50 backdrop-blur-xl px-6 pt-10 pb-6 border-b border-white/40 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('groups')} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-white/50">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            {!groupData.is_member && (
              <button 
                onClick={handleJoin}
                disabled={joining}
                className="bg-[#0052FF] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-70"
              >
                {joining ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
                Join Group
              </button>
            )}
            <button className="p-2 -mr-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-white/50">
              <Settings size={22} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">{groupData.name}</h1>
            <p className="text-xs font-medium text-slate-500">Group ID: #{groupData.id.toString().padStart(6, '0')} <span className="inline-block ml-1 opacity-50 cursor-pointer hover:opacity-100">📋</span></p>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${groupData.status === 'active' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20' : 'bg-amber-100 text-amber-600 border border-amber-200'}`}>
            {groupData.status}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/40 p-3 rounded-2xl border border-white/60">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Target</p>
            <p className="text-xs font-bold text-slate-900">{formatAmount(groupData.contribution_amount * groupData.max_members)}</p>
          </div>
          <div className="bg-white/40 p-3 rounded-2xl border border-white/60">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Weekly</p>
            <p className="text-xs font-bold text-slate-900">{formatAmount(groupData.contribution_amount)}</p>
          </div>
          <div className="bg-white/40 p-3 rounded-2xl border border-white/60">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Members</p>
            <p className="text-xs font-bold text-slate-900">{groupData.members_count} / {groupData.max_members}</p>
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
