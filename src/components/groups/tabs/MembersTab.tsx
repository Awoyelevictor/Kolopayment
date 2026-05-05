import { Plus, ShieldCheck, ShieldAlert, Star } from 'lucide-react';
import { motion } from 'motion/react';

export function MembersTab() {
  const members = [
    { id: 1, name: 'Sarah A.', role: 'Admin', isYou: false, isVerified: true, position: 1, trustScore: 5 },
    { id: 2, name: 'Goodluck E.', role: 'Member', isYou: true, isVerified: true, position: 3, trustScore: 4.5 },
    { id: 3, name: 'Daniel K.', role: 'Member', isYou: false, isVerified: true, position: 2, trustScore: 4 },
    { id: 4, name: 'Mary U.', role: 'Member', isYou: false, isVerified: true, position: 7, trustScore: 5 },
    { id: 5, name: 'John O.', role: 'Member', isYou: false, isVerified: false, position: 8, trustScore: 3 },
  ];

  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={12} 
            className={star <= score ? "text-amber-400 fill-amber-400" : (star - 0.5 === score ? "text-amber-400 fill-amber-400 opacity-50" : "text-slate-200")} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="divide-y divide-slate-100">
        {members.map((member, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={member.id} 
            className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 text-center text-xs font-semibold text-slate-400">
                {idx + 1}
              </div>
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-sm shadow-inner relative">
                {member.name.charAt(0)}
                {member.role === 'Admin' && (
                  <div className="absolute -bottom-1 -right-1 bg-[#0052FF] text-white text-[8px] px-1 rounded-sm font-bold shadow-sm">
                    A
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                  {member.name} 
                  {member.isYou && <span className="text-[10px] text-slate-400 font-normal">(You)</span>}
                  {member.isVerified ? (
                    <ShieldCheck size={14} className="text-emerald-500" />
                  ) : (
                    <ShieldAlert size={14} className="text-red-400" />
                  )}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {renderStars(member.trustScore)}
                  <span className="text-[10px] text-slate-500 font-medium">{member.trustScore}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
               <span className="text-xs font-medium text-slate-400">Position</span>
               <span className="text-sm font-bold text-slate-900">#{member.position}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-4 bg-slate-50/50">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white border border-dashed border-slate-300 text-[#0052FF] font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#0052FF]/5 hover:border-[#0052FF]/30 transition-colors shadow-sm"
        >
          <Plus size={18} /> Invite Member
        </motion.button>
      </div>
    </div>
  );
}
