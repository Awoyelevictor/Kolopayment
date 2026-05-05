import { motion } from 'motion/react';

export function OverviewTab() {
  const payoutOrder = [
    { id: 1, status: 'paid', number: 1 },
    { id: 2, status: 'paid', number: 2 },
    { id: 3, status: 'current', number: 3, isYou: true },
    { id: 4, status: 'pending', number: 4 },
    { id: 5, status: 'pending', number: 5 },
    { id: 10, status: 'pending', number: 10 },
  ];

  return (
    <div className="space-y-8">
      {/* Payout Order */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 tracking-tight">Payout Order</h3>
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
          {payoutOrder.map((pos, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div 
                className={`h-12 w-12 rounded-full flex items-center justify-center font-bold relative
                  ${pos.status === 'paid' ? 'bg-slate-100 text-slate-400' : 
                    pos.status === 'current' ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/30' : 
                    'border-2 border-slate-100 bg-white text-slate-500'}`}
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
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Group Progress</h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">Week 3 of 10</span>
        </div>
        
        <p className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">30% <span className="text-sm font-medium text-slate-500">Complete</span></p>
        
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '30%' }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-[#0052FF] rounded-full"
          />
        </div>
      </div>

      {/* Your Position Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Your Position</p>
          <p className="text-xl font-bold text-[#0052FF]">Week 3</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Expected Date</p>
          <p className="text-sm font-bold text-slate-900 mt-1">7 Jun, 2024</p>
        </div>
      </div>
    </div>
  );
}
