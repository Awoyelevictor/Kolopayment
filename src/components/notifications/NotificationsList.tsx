import { ArrowLeft, Bell, BellRing, CheckCircle2, ShieldAlert, Users, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useFirebase } from '../../context/FirebaseContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function NotificationsList() {
  const { navigate } = useNavigation();
  const { user } = useFirebase();
  const [activeTab, setActiveTab] = useState<'all' | 'payments' | 'groups' | 'system'>('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const n = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(n);
      setIsLoading(false);
    }, (error) => {
      console.error("Notifications fetch error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'payments', label: 'Payments' },
    { id: 'groups', label: 'Groups' },
    { id: 'system', label: 'System' },
  ] as const;

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
    if (category === 'groups') return 'bg-[#0052FF]/10 border-white';
    if (type === 'success') return 'bg-[#22C55E]/10 border-white';
    if (type === 'warning' && category === 'system') return 'bg-red-50 border-white';
    if (type === 'warning') return 'bg-orange-50 border-white';
    if (type === 'error') return 'bg-red-50 border-white';
    return 'bg-slate-100 border-white';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#0052FF]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 xl:pb-0">
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-4 border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50">
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
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
          <div className="divide-y divide-slate-100">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((notif, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={notif.id}
                  className={`p-5 flex items-start gap-4 transition-colors ${!notif.read ? 'bg-[#0052FF]/[0.02]' : 'hover:bg-slate-50'}`}
                >
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 border-[3px] shadow-sm ${getIconBg(notif.type, notif.category)}`}>
                    {getIcon(notif.type, notif.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-0.5">
                      <h3 className={`font-semibold text-sm truncate pr-2 ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h3>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                        {notif.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Now'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{notif.desc || notif.message}</p>
                  </div>
                  {!notif.read && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#0052FF] mt-2 flex-shrink-0 shadow-sm shadow-blue-500/30" />
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
      </div>
    </div>
  );
}
