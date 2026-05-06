import { Home, Users, Plus, CreditCard, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';

export function ResponsiveNav({ isDesktop }: { isDesktop: boolean }) {
  const { currentRoute, navigate } = useNavigation();

  const navItems = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'groups', icon: <Users size={24} />, label: 'Groups' },
    { id: 'add', icon: <Plus size={24} className="text-white" />, label: 'Add', isPrimary: true },
    { id: 'payment', icon: <CreditCard size={24} />, label: 'Payments' },
    { id: 'profile', icon: <User size={24} />, label: 'Profile' },
  ];

  if (isDesktop) {
    return (
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item, idx) => {
          if (item.isPrimary) {
            return (
              <motion.button 
                key={idx}
                onClick={() => navigate('group-action', { goBackTo: currentRoute })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 flex items-center justify-center gap-2 bg-[#0052FF] text-white p-3 rounded-xl font-medium shadow-[0_4px_14px_0_rgba(0,82,255,0.3)]"
              >
                <Plus size={20} /> Create Group
              </motion.button>
            )
          }
          const isActive = currentRoute === item.id;
          return (
            <button 
              key={idx}
              onClick={() => navigate(item.id as any)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#0052FF]/10 text-[#0052FF] font-semibold backdrop-blur-md' : 'text-slate-500 hover:bg-white/50'}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    );
  }

  // Mobile Nav
  return (
    <nav className="flex items-center justify-between px-6 py-3 max-w-md mx-auto">
      {navItems.map((item, idx) => {
        if (item.isPrimary) {
          return (
            <motion.button
              key={idx}
              onClick={() => navigate('group-action', { goBackTo: currentRoute })}
              whileTap={{ scale: 0.9 }}
              className="bg-[#0052FF] p-4 rounded-full shadow-[0_4px_20px_0_rgba(0,82,255,0.4)] transform -translate-y-4 text-white"
            >
              <Plus size={24} />
            </motion.button>
          )
        }
        const isActive = currentRoute === item.id || (currentRoute === 'group-details' && item.id === 'groups');
        return (
          <button 
            key={idx}
            onClick={() => navigate(item.id as any)}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#0052FF]' : 'text-slate-400'}`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        )
      })}
    </nav>
  );
}
