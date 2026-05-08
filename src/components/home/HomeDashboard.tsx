import { Bell, ArrowUpRight, BellRing, Plus, UserPlus, Users, Wallet } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { GroupListItem } from './GroupListItem';
import { NextPaymentCard } from './NextPaymentCard';
import { useNavigation } from '../../contexts/NavigationContext';
import { useState, useEffect } from 'react';
import { HomeDashboardSkeleton } from '../ui/SkeletonLoaders';
import { useFirebase } from '../../context/FirebaseContext';
import { collection, query, where, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export function HomeDashboard() {
  const { navigate } = useNavigation();
  const { user, userProfile } = useFirebase();
  const [isLoading, setIsLoading] = useState(true);
  const [activeGroups, setActiveGroups] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  useEffect(() => {
    if (!user) return;

    // Listen for groups the user is part of
    const groupsQuery = query(
      collection(db, 'users', user.uid, 'memberships'),
      limit(5)
    );

    const unsubscribeGroups = onSnapshot(groupsQuery, (snapshot) => {
      const groups = snapshot.docs.map(doc => ({ id: doc.data().groupId, ...doc.data() }));
      setActiveGroups(groups);
      setIsLoading(false);
    }, (error) => {
      console.error("Memberships fetch error:", error);
      setIsLoading(false);
    });

    // Listen for recent transactions
    const txQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribeTx = onSnapshot(txQuery, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentTransactions(txs);
    }, (error) => {
      console.error("Transactions fetch error:", error);
    });

    return () => {
      unsubscribeGroups();
      unsubscribeTx();
    };
  }, [user]);

  if (isLoading) {
    return <HomeDashboardSkeleton />;
  }

  const quickActions = [
    { icon: <Plus size={20} />, label: "Create Group", color: "bg-blue-600", route: "create-group" },
    { icon: <UserPlus size={20} />, label: "Join Group", color: "bg-green-600", route: "join-group" },
    { icon: <Wallet size={20} />, label: "Top-up Wallet", color: "bg-purple-600", route: "payment-flow" },
  ];

  return (
    <div className="px-6 pt-10 pb-12 w-full max-w-lg mx-auto xl:max-w-none relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Good morning,<br/>
            {userProfile?.firstName || 'User'}
          </h1>
        </div>
        <button onClick={() => navigate('notifications')} className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center relative text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
          <Bell size={22} className="text-slate-700" />
          <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
        </button>
      </div>

      {/* Balance Card */}
      <BalanceCard />

      {/* Quick Group Pay Button - Fast Payment to Group */}
      <div className="mt-8">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('payment-drawer')}
          className="w-full bg-[#0052FF] text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <ArrowUpRight size={20} />
          Group Fast Payment
        </motion.button>
      </div>

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
          {activeGroups.length > 0 ? activeGroups.map((group, idx) => (
            <div key={group.id} onClick={() => navigate('group-details', { groupId: group.id })} className="cursor-pointer">
              <GroupListItem index={idx} name={group.name} amount={`₦${group.amount.toLocaleString()}`} frequency={group.cycle} membersCount={8} maxMembers={group.maxMembers} progress={0.5} isNextPayout={idx === 0} />
            </div>
          )) : (
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center">
              <p className="text-slate-500 text-sm font-medium">You haven't joined any groups yet.</p>
              <button onClick={() => navigate('groups')} className="text-[#0052FF] text-sm font-bold mt-2">Explore Groups</button>
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
        
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 space-y-4">
          {recentTransactions.length > 0 ? recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors p-2 -mx-2 rounded-xl">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === 'topup' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-blue-50 text-blue-500'}`}>
                <ArrowUpRight size={20} className={tx.type === 'topup' ? 'rotate-[-90deg]' : 'rotate-0'} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {tx.type === 'topup' ? 'Wallet Top-up' : 'Group Contribution'}
                </p>
                <p className="text-xs text-slate-500">₦{tx.amount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-400">
                  {tx.timestamp?.toDate ? tx.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                </p>
              </div>
            </div>
          )) : (
            <div className="text-center py-4">
              <p className="text-xs text-slate-400">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button for Group Actions */}
      <div className="fixed bottom-28 right-6 z-50">
        <AnimatePresence>
          {showQuickActions && (
            <div className="absolute bottom-16 right-0 space-y-3 mb-2">
              {quickActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 justify-end whitespace-nowrap"
                >
                  <span className="bg-white px-3 py-1.5 rounded-lg shadow-md border border-slate-100 text-xs font-bold text-slate-700">{action.label}</span>
                  <button 
                    onClick={() => {
                      setShowQuickActions(false);
                      navigate(action.route);
                    }}
                    className={`h-12 w-12 rounded-full ${action.color} text-white flex items-center justify-center shadow-lg`}
                  >
                    {action.icon}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowQuickActions(!showQuickActions)}
          className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${showQuickActions ? 'bg-slate-800 rotate-45' : 'bg-[#0052FF]'}`}
        >
          <Plus size={28} />
        </motion.button>
      </div>

      {/* Overlay when Quick Actions are open */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickActions(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

