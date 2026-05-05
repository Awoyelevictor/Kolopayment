import { ArrowLeft, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { OverviewTab } from './tabs/OverviewTab';
import { MembersTab } from './tabs/MembersTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { ActivityTab } from './tabs/ActivityTab';

export function GroupDetails() {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Members' | 'Payments' | 'Activity'>('Overview');

  const tabs = ['Overview', 'Members', 'Payments', 'Activity'] as const;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 xl:pb-0">
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('groups')} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50">
            <ArrowLeft size={24} />
          </button>
          <button className="p-2 -mr-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50">
            <Settings size={22} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">CS Dept Ajo</h1>
            <p className="text-xs font-medium text-slate-500">Group ID: #674532 <span className="inline-block ml-1 opacity-50 cursor-pointer hover:opacity-100">📋</span></p>
          </div>
          <div className="bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Ongoing
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Target</p>
            <p className="font-bold text-slate-900">₦50,000</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Contribution</p>
            <p className="font-bold text-slate-900">₦5,000 <span className="text-xs font-medium text-slate-500 block">Weekly</span></p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Members</p>
            <p className="font-bold text-slate-900">10 / 10</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 border-b border-slate-200 overflow-x-auto hide-scrollbar bg-white sticky top-[210px] z-10 shadow-sm">
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
          {activeTab === 'Overview' && <OverviewTab />}
          {activeTab === 'Members' && <MembersTab />}
          {activeTab === 'Payments' && <PaymentsTab />}
          {activeTab === 'Activity' && <ActivityTab />}
        </motion.div>
      </div>
    </div>
  );
}
