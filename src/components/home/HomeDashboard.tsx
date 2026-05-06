import { Bell, ArrowUpRight, BellRing, Loader2 } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { GroupListItem } from './GroupListItem';
import { NextPaymentCard } from './NextPaymentCard';
import { useNavigation } from '../../contexts/NavigationContext';
import { useState, useEffect } from 'react';
import { HomeDashboardSkeleton } from '../ui/SkeletonLoaders';
import { api } from '../../services/api';

export function HomeDashboard() {
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [activeGroups, setActiveGroups] = useState<any[]>([]);
  const [nextPayment, setNextPayment] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, groupsData, contributions] = await Promise.all([
          api.getProfile(),
          api.getGroups(),
          api.getContributions().catch(() => [])
        ]);

        setUserData(profile);
        
        const groupsList = Array.isArray(groupsData) ? groupsData : groupsData.results || [];
        setActiveGroups(groupsList.filter((g: any) => g.status === 'ACTIVE' || g.status === 'FORMING').slice(0, 3));

        // Find the earliest pending contribution
        const pending = contributions
          .filter((c: any) => c.status === 'pending')
          .sort((a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
        
        setNextPayment(pending);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(amount));
  };

  if (isLoading) {
    return <HomeDashboardSkeleton />;
  }

  return (
    <div className="px-6 pt-10 pb-12 w-full max-w-lg mx-auto xl:max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Good morning,<br/>{userData?.first_name || userData?.username || 'User'}
          </h1>
        </div>
        <button onClick={() => navigate('notifications')} className="h-12 w-12 rounded-full bg-white/60 backdrop-blur-md border border-white/60 flex items-center justify-center relative text-slate-600 hover:bg-white/80 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06)] transition-colors">
          <Bell size={22} className="text-slate-700" />
          <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
        </button>
      </div>

      {/* Balance Card */}
      <BalanceCard trustScore={userData?.trust_score} />

      {/* Next Payment Section */}
      <div className="mt-10 mb-8">
        <h2 className="text-[15px] font-semibold text-slate-900 mb-4 tracking-tight">Next Payment Due</h2>
        {nextPayment ? (
          <NextPaymentCard contribution={nextPayment} />
        ) : (
          <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/60 text-center">
             <p className="text-sm text-slate-500">No upcoming payments. Join a group to start saving!</p>
          </div>
        )}
      </div>

      {/* Active Groups Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">Active Groups</h2>
          <button onClick={() => navigate('groups')} className="text-[#0052FF] text-xs font-semibold hover:underline">View all</button>
        </div>
        
        <div className="space-y-4">
          {activeGroups.length > 0 ? (
            activeGroups.map((group, idx) => (
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
            ))
          ) : (
            <div className="py-6 text-center text-sm text-slate-400">
               No active groups found.
            </div>
          )}
        </div>
      </div>

      {/* User Activity Section */}
      <div className="mt-10 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">Recent Activity</h2>
          <button className="text-[#0052FF] text-xs font-semibold hover:underline">View all</button>
        </div>
        
        <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_2px_16px_-4px_rgba(0,82,255,0.06)] p-4 space-y-4">
          <div className="flex items-start gap-4 cursor-pointer hover:bg-white/40 transition-colors p-2 -mx-2 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0 text-[#22C55E]">
              <ArrowUpRight size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">Registration Successful</p>
              <p className="text-xs text-slate-500">Welcome to KoloPay community</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-400">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
