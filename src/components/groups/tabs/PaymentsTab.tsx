import { CheckCircle2, Circle, XCircle } from 'lucide-react';

export function PaymentsTab() {
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
      default: return <Circle size={16} className="text-slate-200" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-sm">
      <div className="p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-600"><CheckCircle2 size={14} className="text-[#22C55E]" /> Paid</div>
          <div className="flex items-center gap-1.5 text-slate-600"><XCircle size={14} className="text-red-500" /> Missed</div>
          <div className="flex items-center gap-1.5 text-slate-600"><Circle size={14} className="text-slate-200" /> Pending</div>
        </div>
      </div>
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 font-semibold tracking-wide">
              <th className="text-left py-4 px-4 font-semibold uppercase sticky left-0 bg-slate-50 z-10 w-28 shadow-[1px_0_0_0_#f1f5f9]">Members</th>
              {[...Array(10)].map((_, i) => (
                <th key={i} className="text-center py-4 px-2 font-semibold uppercase whitespace-nowrap min-w-[40px]">Wk {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2 sticky left-0 bg-white z-10 shadow-[1px_0_0_0_#f1f5f9]">
                  <div className="h-6 w-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 flex-shrink-0">
                    {row.name.charAt(0)}
                  </div>
                  <span className="truncate max-w-[70px]">{row.name}</span>
                </td>
                {row.status.map((st, i) => (
                  <td key={i} className="py-3 px-2 text-center"><div className="flex justify-center">{getIcon(st)}</div></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <button className="w-full text-[#0052FF] font-semibold text-sm hover:underline py-2">
          View Detailed History
        </button>
      </div>
    </div>
  );
}
