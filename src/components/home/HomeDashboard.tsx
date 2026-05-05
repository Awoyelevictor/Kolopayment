import { Bell, ArrowUpRight, BellRing } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { GroupListItem } from './GroupListItem';
import { NextPaymentCard } from './NextPaymentCard';
import { useNavigation } from '../../contexts/NavigationContext';
import { useState, useEffect } from 'react';
import { HomeDashboardSkeleton } from '../ui/SkeletonLoaders';

export function HomeDashboard() {
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const activeGroups = [
    {
      id: 'g1',
      name: "CS Dept Ajo",
      amount: "₦5,000",
      frequency: "weekly",
      membersCount: 10,
      maxMembers: 10,
      progress: 0.3, // 3/10 members payout complete for instance
      isNextPayout: true,
    },
    {
      id: 'g2',
      name: "NYSC Squad",
      amount: "₦2,000",
      frequency: "weekly",
      membersCount: 6,
      maxMembers: 8,
      progress: 0.75, // 6/8
    }
  ];

  if (isLoading) {
    return <HomeDashboardSkeleton />;
  }

  return (
    <div className="px-6 pt-10 pb-12 w-full max-w-lg mx-auto xl:max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">Good morning,<br/>Goodluck</h1>
        </div>
        <button onClick={() => navigate('notifications')} className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center relative text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
          <Bell size={22} className="text-slate-700" />
          <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
        </button>
      </div>

      {/* Balance Card */}
      <BalanceCard />

      {/* Next Payment Section */}
      <div className="mt-10 mb-8">
        <h2 className="text-[15px] font-semibold text-slate-900 mb-4 tracking-tight">Next Payment Due</h2>
        <NextPaymentCard />
      </div>

      {/* Active Groups Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">Active Groups</h2>
          <button onClick={() => navigate('groups')} className="text-[#0052FF] text-xs font-semibold hover:underline">View all</button>
        </div>
        
        <div className="space-y-4">
          {activeGroups.map((group, idx) => (
            <div key={group.id} onClick={() => navigate('group-details', { groupId: group.id })} className="cursor-pointer">
              <GroupListItem index={idx} name={group.name} amount={group.amount} frequency={group.frequency} membersCount={group.membersCount} maxMembers={group.maxMembers} progress={group.progress} isNextPayout={group.isNextPayout} />
            </div>
          ))}
        </div>
      </div>

      {/* User Activity Section */}
      <div className="mt-10 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">Recent Activity</h2>
          <button className="text-[#0052FF] text-xs font-semibold hover:underline">View all</button>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 space-y-4">
          <div className="flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors p-2 -mx-2 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0 text-[#22C55E]">
              <ArrowUpRight size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">You paid ₦5,000</p>
              <p className="text-xs text-slate-500">CS Dept Ajo</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-400">Today</p>
              <p className="text-xs text-slate-400">10:30 AM</p>
            </div>
          </div>
          <div className="h-px bg-slate-50"></div>
          <div className="flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors p-2 -mx-2 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500">
              <BellRing size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">Payment Reminder</p>
              <p className="text-xs text-slate-500">Week 2 payment due tomorrow</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-400">Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
