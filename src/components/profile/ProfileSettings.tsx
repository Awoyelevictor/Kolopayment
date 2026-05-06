import { User, CreditCard, Shield, Bell, HelpCircle, Info, LogOut, ChevronRight, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';

export function ProfileSettings() {
  const { navigate } = useNavigation();

  const menuItems = [
    { id: 'profile', icon: <User size={20} />, label: 'Personal Information', action: () => navigate('edit-profile') },
    { id: 'payment', icon: <CreditCard size={20} />, label: 'Payment Methods' },
    { id: 'security', icon: <Shield size={20} />, label: 'Security', action: () => navigate('security') },
    { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications', action: () => navigate('notifications') },
    { id: 'help', icon: <HelpCircle size={20} />, label: 'Help & Support' },
    { id: 'about', icon: <Info size={20} />, label: 'About KoloPay' },
  ];

  return (
    <div className="px-6 pt-10 pb-24 w-full max-w-lg mx-auto">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">Settings</h1>
      
      {/* Profile Header */}
      <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-[0_2px_16px_-4px_rgba(0,82,255,0.06)] flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 bg-white/60 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600 shadow-sm border border-white/80">
              GE
            </div>
            <button className="absolute -bottom-1 -right-1 bg-[#0052FF] text-white p-1.5 rounded-full border-2 border-white shadow-sm">
              <Edit2 size={12} />
            </button>
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900 leading-tight mb-0.5">Goodluck E.</h2>
            <p className="text-xs font-medium text-slate-500 mb-0.5">+234 901 234 5678</p>
            <p className="text-xs text-slate-400">goodluck@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_2px_16px_-4px_rgba(0,82,255,0.06)] overflow-hidden mb-6">
        <div className="divide-y divide-white/40">
          {menuItems.map((item, idx) => (
            <motion.button
              key={idx}
              onClick={item.action}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-5 hover:bg-white/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-slate-400 bg-white/60 p-2 rounded-xl border border-white/80 shadow-sm">
                  {item.icon}
                </div>
                <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 p-5 bg-red-50/50 backdrop-blur-md text-red-600 rounded-2xl font-semibold text-sm hover:bg-red-50 transition-colors border border-red-100/40"
      >
        <LogOut size={18} />
        Log Out
      </motion.button>
    </div>
  );
}
