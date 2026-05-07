import { Plus, ShieldCheck, ShieldAlert, Star, User } from 'lucide-react';
import { motion } from 'motion/react';

export function MembersTab({ groupData }: { groupData?: any }) {
  // Use members from groupData if available, otherwise empty array
  const members = groupData?.members || [];

  const renderStars = (score: number) => {
    // Convert trust score to a 5-star scale if needed, but for now assuming it's already structured
    const normalizedScore = Math.min(Math.max(score / 20, 1), 5); // Example normalization if trust_score is 0-100
    
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={12} 
            className={star <= normalizedScore ? "text-amber-400 fill-amber-400" : "text-slate-200"} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_2px_16px_-4px_rgba(0,82,255,0.06)] overflow-hidden">
      <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/40">
         <h3 className="text-sm font-semibold text-slate-900">Members ({groupData?.members_count || 0}/{groupData?.max_members || 0})</h3>
      </div>
      <div className="divide-y divide-white/40">
        {members.length > 0 ? (
          members.map((membership: any, idx: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={membership.id} 
              className="p-4 flex items-center justify-between hover:bg-white/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 text-center text-xs font-semibold text-slate-400">
                  {idx + 1}
                </div>
                <div className="h-10 w-10 bg-white/60 rounded-full flex items-center justify-center font-bold text-slate-600 text-sm shadow-sm border border-white/80 relative overflow-hidden">
                  {membership.user?.profile_image ? (
                    <img src={membership.user.profile_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="uppercase">{membership.user?.first_name?.charAt(0) || membership.user?.username?.charAt(0)}</span>
                  )}
                  {membership.role === 'admin' && (
                    <div className="absolute bottom-0 right-0 left-0 bg-[#0052FF] text-white text-[7px] py-0.5 text-center font-bold">
                      ADMIN
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                    {membership.user?.first_name} {membership.user?.last_name}
                    {membership.user?.is_bvn_verified ? (
                      <ShieldCheck size={14} className="text-emerald-500" />
                    ) : (
                      <ShieldAlert size={14} className="text-amber-400" />
                    )}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {renderStars(membership.user?.trust_score || 0)}
                    <span className="text-[10px] text-slate-500 font-medium">{membership.user?.trust_score || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                 <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Pos</span>
                 <span className="text-sm font-bold text-slate-900">#{membership.payout_order || '-'}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center">
            <User className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-sm text-slate-500">No members yet</p>
          </div>
        )}
      </div>
      
      {groupData?.is_member && (
        <div className="p-4 bg-white/30 backdrop-blur-sm">
          <motion.button 
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white/60 backdrop-blur-md border border-dashed border-white/80 text-[#0052FF] font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/80 transition-all shadow-[0_2px_10px_-3px_rgba(0,82,255,0.06)]"
          >
            <Plus size={18} /> Invite Member
          </motion.button>
        </div>
      )}
    </div>
  );
}
