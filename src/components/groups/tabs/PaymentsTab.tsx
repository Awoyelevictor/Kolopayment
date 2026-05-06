import { CheckCircle2, Circle, XCircle } from 'lucide-react';

export function PaymentsTab({ groupData }: { groupData?: any }) {
  // Use mock data until payments API provides the matrix
  const maxMembers = groupData?.max_members || 10;
  
  const data = [
    { name: 'Sarah A.', status: ['paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'pending', 'pending', 'pending', 'pending'] },
    { name: 'Goodluck E.', status: ['paid', 'paid', 'paid', 'paid', 'paid', 'pending', 'pending', 'pending', 'pending', 'pending'] },
    { name: 'Daniel K.', status: ['paid', 'paid', 'paid', 'paid', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending'] },
    { name: 'Mary U.', status: ['paid', 'paid', 'paid', 'missed', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending'] },
    { name: 'John O.', status: ['missed', 'paid', 'missed', 'missed', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending'] },
  ];

  const getIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 size={16} className="text-[#22C55E]" />;
      case 'missed': return <XCircle size={16} className="text-red-500" />;
      default: return <Circle size={16} className="text-white/40" />;
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_2px_16px_-4px_rgba(0,82,255,0.06)] overflow-hidden text-sm">
      <div className="p-4 border-b border-white/40 bg-white/40 backdrop-blur-sm flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-900">Payment Matrix</h3>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-600"><CheckCircle2 size={14} className="text-[#22C55E]" /> Paid</div>
          <div className="flex items-center gap-1.5 text-slate-600"><XCircle size={14} className="text-red-500" /> Missed</div>
          <div className="flex items-center gap-1.5 text-slate-600"><Circle size={14} className="text-slate-300" /> Pending</div>
        </div>
      </div>
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-white/30 border-b border-white/40 text-[10px] text-slate-500 font-semibold tracking-wide">
              <th className="text-left py-4 px-4 font-semibold uppercase sticky left-0 bg-white/80 backdrop-blur-md z-10 w-28 border-r border-white/40">Members</th>
              {[...Array(maxMembers)].map((_, i) => (
                <th key={i} className="text-center py-4 px-2 font-semibold uppercase whitespace-nowrap min-w-[40px]">Wk {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/40 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2 sticky left-0 bg-white/80 backdrop-blur-md z-10 border-r border-white/40">
                  <div className="h-6 w-6 bg-white/60 border border-white/80 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 flex-shrink-0 shadow-sm">
                    {row.name.charAt(0)}
                  </div>
                  <span className="truncate max-w-[70px]">{row.name}</span>
                </td>
                {row.status.slice(0, maxMembers).map((st, i) => (
                  <td key={i} className="py-3 px-2 text-center"><div className="flex justify-center">{getIcon(st)}</div></td>
                ))}
                {[...Array(Math.max(0, maxMembers - row.status.length))].map((_, i) => (
                  <td key={row.status.length + i} className="py-3 px-2 text-center"><div className="flex justify-center">{getIcon('pending')}</div></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-white/40 bg-white/30">
        <button className="w-full text-[#0052FF] font-semibold text-sm hover:underline py-2">
          View Detailed History
        </button>
      </div>
    </div>
  );
}
