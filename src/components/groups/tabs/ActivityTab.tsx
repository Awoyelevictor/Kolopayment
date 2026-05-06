import { motion } from 'motion/react';
import { ArrowUpRight, Plus, AlertCircle } from 'lucide-react';

export function ActivityTab({ groupData }: { groupData?: any }) {
  const activities = [
    { id: 1, type: 'payment', title: 'Goodluck E. paid ₦5,000', time: '10:30 AM', date: 'Today', icon: <ArrowUpRight size={16} className="text-[#22C55E]" />, bg: 'bg-[#22C55E]/10' },
    { id: 2, type: 'payment', title: 'Sarah A. paid ₦5,000', time: '08:45 AM', date: 'Today', icon: <ArrowUpRight size={16} className="text-[#22C55E]" />, bg: 'bg-[#22C55E]/10' },
    { id: 3, type: 'missed', title: 'John O. missed Week 1 payment', time: 'Yesterday', date: 'May 20', icon: <AlertCircle size={16} className="text-red-500" />, bg: 'bg-red-50' },
    { id: 4, type: 'join', title: 'Mary U. joined the group', time: 'May 16', date: 'May 16', icon: <Plus size={16} className="text-[#0052FF]" />, bg: 'bg-[#0052FF]/10' },
    { id: 5, type: 'create', title: `Group created${groupData?.created_at ? ' on ' + new Date(groupData.created_at).toLocaleDateString() : ''}`, time: 'System', date: 'May 15', icon: <Plus size={16} className="text-slate-600" />, bg: 'bg-white/40' },
  ];

  return (
    <div className="relative border-l-2 border-white/40 ml-4 pl-6 pb-4 space-y-8">
      {activities.map((item, idx) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative"
        >
          {/* Timeline Dot */}
          <div className={`absolute -left-[35px] h-8 w-8 rounded-full ${item.bg} backdrop-blur-sm flex items-center justify-center border-4 border-[#F8FAFC] shadow-sm`}>
            {item.icon}
          </div>
          
          <div className="bg-white/40 backdrop-blur-md p-3 rounded-2xl border border-white/60 shadow-sm inline-block min-w-[200px]">
            <h4 className="text-sm font-semibold text-slate-900 mb-0.5">{item.title}</h4>
            <p className="text-xs font-medium text-slate-400">{item.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
