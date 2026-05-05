import { motion } from 'motion/react';
import { Users } from 'lucide-react';

interface GroupListItemProps {
  name: string;
  amount: string;
  frequency: string;
  membersCount: number;
  maxMembers: number;
  progress: number; // 0 to 1
  isNextPayout?: boolean;
  index: number;
}

export function GroupListItem({ name, amount, frequency, membersCount, maxMembers, progress, isNextPayout, index }: GroupListItemProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 mb-3"
    >
      <div className="h-12 w-12 rounded-full bg-[#F8FAFC] border border-slate-100 flex items-center justify-center flex-shrink-0 text-[#0052FF]">
        {/* Placeholder for group avatars. Usually it's an image or avatars stack. Using icon for now */}
        <Users size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-900 truncate">{name}</h3>
          {isNextPayout ? (
            <span className="text-[10px] font-bold tracking-wide uppercase text-[#0052FF] bg-[#0052FF]/10 px-2.5 py-1 rounded-full">Your Turn</span>
          ) : (
             <span className="text-xs text-[#22C55E] font-medium">Ongoing</span>
          )}
        </div>
        
        <p className="text-xs text-slate-500 mb-3 font-medium">
          <span className="font-semibold text-slate-700">{amount}</span> {frequency} • {membersCount}/{maxMembers} members
        </p>

        {/* Mini Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
            className={`h-full rounded-full ${progress === 1 ? 'bg-[#22C55E]' : 'bg-[#0052FF]'}`}
          />
        </div>
      </div>
    </motion.div>
  );
}
