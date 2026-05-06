import { ArrowLeft, Bell, BellRing, CheckCircle2, ShieldAlert, Users, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';

export function NotificationsList() {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'all' | 'payments' | 'groups' | 'system'>('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'payments', label: 'Payments' },
    { id: 'groups', label: 'Groups' },
    { id: 'system', label: 'System' },
  ] as const;

  const notifications = [
    { 
      id: 1, 
      category: 'payments', 
      type: 'success', 
      title: 'Payment successful', 
      desc: 'You paid ₦5,000 to CS Dept Ajo', 
      time: '10:30 AM', 
      read: false 
    },
    { 
      id: 2, 
      category: 'payments', 
      type: 'warning', 
      title: 'Payment reminder', 
      desc: 'Week 2 payment due tomorrow', 
      time: 'Yesterday', 
      read: true 
    },
    { 
      id: 3, 
      category: 'payments', 
      type: 'error', 
      title: 'John O. missed a payment', 
      desc: 'Week 1 payment is overdue', 
      time: 'May 20', 
      read: true 
    },
    { 
      id: 4, 
      category: 'groups', 
      type: 'info', 
      title: 'You were added to CS Dept Ajo', 
      desc: 'By Sarah A.', 
      time: 'May 18', 
      read: true 
    },
    { 
      id: 5, 
      category: 'groups', 
      type: 'info', 
      title: 'Mary U. joined the group', 
      desc: 'CS Dept Ajo', 
      time: 'May 16', 
      read: true 
    },
    { 
      id: 6, 
      category: 'system', 
      type: 'success', 
      title: 'Account verified successfully', 
      desc: 'Your BVN has been verified', 
      time: 'May 15', 
      read: true 
    },
    { 
      id: 7, 
      category: 'system', 
      type: 'warning', 
      title: 'Security alert', 
      desc: 'New login detected on your account', 
      time: 'May 14', 
      read: true 
    },
  ];

  const filteredNotifs = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === activeTab);

  const getIcon = (type: string, category: string) => {
    if (category === 'groups') return <Users size={20} className="text-[#0052FF]" />;
    if (type === 'success') return <CheckCircle2 size={20} className="text-[#22C55E]" />;
    if (type === 'warning' && category === 'system') return <ShieldAlert size={20} className="text-red-500" />;
    if (type === 'warning') return <BellRing size={20} className="text-orange-500" />;
    if (type === 'error') return <XCircle size={20} className="text-red-500" />;
    return <Bell size={20} className="text-slate-500" />;
  };

  const getIconBg = (type: string, category: string) => {
    if (category === 'groups') return 'bg-[#0052FF]/10 border-white/60';
    if (type === 'success') return 'bg-[#22C55E]/10 border-white/60';
    if (type === 'warning' && category === 'system') return 'bg-red-50 border-white/60';
    if (type === 'warning') return 'bg-orange-50 border-white/60';
    if (type === 'error') return 'bg-red-50 border-white/60';
    return 'bg-white/60 border-white/80 backdrop-blur-sm';
  };

  return (
    <div className="min-h-screen pb-24 xl:pb-0">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-xl px-6 pt-10 pb-4 border-b border-white/40 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-white/50">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
        </div>

        {/* Tabs Navigation */}
        <div className="overflow-x-auto hide-scrollbar pt-2">
          <div className="flex gap-6 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-medium text-sm transition-colors relative z-10 ${activeTab === tab.id ? 'text-[#0052FF]' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="notifTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052FF] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 w-full max-w-2xl mx-auto">
        <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_2px_16px_-4px_rgba(0,82,255,0.06)] overflow-hidden mb-6">
          <div className="divide-y divide-white/40">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((notif, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={notif.id}
                  className={`p-5 flex items-start gap-4 transition-all ${!notif.read ? 'bg-[#0052FF]/5 shadow-inner' : 'hover:bg-white/40'}`}
                >
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 border-[3px] shadow-sm ${getIconBg(notif.type, notif.category)}`}>
                    {getIcon(notif.type, notif.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-0.5">
                      <h3 className={`font-semibold text-sm truncate pr-2 ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h3>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-500">{notif.desc}</p>
                  </div>
                  {!notif.read && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#0052FF] mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(0,82,255,0.5)]" />
                  )}
                </motion.div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-500 text-sm font-medium">
                No notifications to display.
              </div>
            )}
          </div>
        </div>

        {filteredNotifs.length > 0 && (
          <button className="w-full text-center text-[#0052FF] font-semibold text-sm hover:underline p-2">
            View all notifications
          </button>
        )}
      </div>
    </div>
  );
}
