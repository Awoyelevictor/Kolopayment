import { motion } from 'motion/react';

export function OverviewTab({ groupData }: { groupData?: any }) {
  // Generate dummy payout order since it's not yet fully implemented in the backend schema returned directly
  const membersCount = groupData?.max_members || 10;
  const currentPos = groupData?.current_cycle_index || 1;
  const payoutOrder = Array.from({ length: membersCount }).map((_, i) => {
    const number = i + 1;
    let status = 'pending';
    if (number < currentPos) status = 'paid';
    else if (number === currentPos) status = 'current';

    return {
      id: number,
      status,
      number,
      isYou: number === currentPos // Assuming user is current payout for demo, later map to actual group member record
    };
  });

  const progress = Math.min(((groupData?.current_members || 0) / (groupData?.max_members || 1)) * 100, 100);

  return (
    <div className="space-y-8">
      {/* Payout Order */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 tracking-tight">Payout Order</h3>
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
          {payoutOrder.map((pos, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div 
                className={`h-12 w-12 rounded-full flex items-center justify-center font-bold relative transition-all duration-300
                  ${pos.status === 'paid' ? 'bg-white/30 text-slate-400 border border-white/40' : 
                    pos.status === 'current' ? 'bg-[#0052FF] text-white shadow-[0_4px_14px_0_rgba(0,82,255,0.39)]' : 
                    'border-2 border-white/60 bg-white/40 text-slate-500 backdrop-blur-sm'}`}
              >
                {pos.number}
                {pos.isYou && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
                )}
              </div>
              {pos.isYou && <span className="text-[10px] font-bold text-[#0052FF]">You</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Group Progress */}
      <div className="bg-white/50 backdrop-blur-md p-5 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,82,255,0.06)] border border-white/60">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Group Formation Progress</h3>
          <span className="text-xs font-semibold text-slate-500 bg-white/60 backdrop-blur-sm px-2 py-1 rounded border border-white/40">
            {groupData?.current_members || 0} of {groupData?.max_members || 0} Joined
          </span>
        </div>
        
        <p className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{progress.toFixed(0)}% <span className="text-sm font-medium text-slate-500">Filled</span></p>
        
        <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden border border-white/40">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-[#0052FF] rounded-full"
          />
        </div>
      </div>

      {/* Your Position Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,82,255,0.04)]">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Your Position</p>
          <p className="text-xl font-bold text-[#0052FF]">Position {currentPos}</p>
        </div>
        <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,82,255,0.04)]">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Expected Date</p>
          <p className="text-sm font-bold text-slate-900 mt-1">Pending Start</p>
        </div>
      </div>
    </div>
  );
}
