import { CheckCircle2, Circle, XCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export function PaymentsTab({ group }: { group: any }) {
  const [members, setMembers] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!group) return;

    // Listen for members
    const unsubscribeMembers = onSnapshot(collection(db, 'groups', group.id, 'members'), (snapshot) => {
      const m = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(m);
    }, (error) => {
      console.error("Members fetch error:", error);
    });

    // Listen for contributions
    const unsubscribeContribs = onSnapshot(collection(db, 'groups', group.id, 'contributions'), (snapshot) => {
      const c = snapshot.docs.map(doc => doc.data());
      setContributions(c);
      setIsLoading(false);
    }, (error) => {
      console.error("Contributions fetch error:", error);
      setIsLoading(false);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeContribs();
    };
  }, [group]);

  const getIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 size={16} className="text-[#22C55E]" />;
      case 'missed': return <XCircle size={16} className="text-red-500" />;
      default: return <Circle size={16} className="text-slate-200" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#0052FF]" size={32} />
      </div>
    );
  }

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
              <th className="text-left py-4 px-4 font-semibold uppercase sticky left-0 bg-slate-50 z-10 w-32 shadow-[1px_0_0_0_#f1f5f9]">Members</th>
              {[...Array(group.maxMembers)].map((_, i) => (
                <th key={i} className="text-center py-4 px-2 font-semibold uppercase whitespace-nowrap min-w-[40px]">Wk {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member, idx) => {
              const memberContributions = contributions.filter(c => c.userId === member.uid);
              const status = Array.from({ length: group.maxMembers }, (_, i) => {
                const weekNum = i + 1;
                const isPaid = memberContributions.some(c => c.week === weekNum);
                return isPaid ? 'paid' : 'pending';
              });
              
              return (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2 sticky left-0 bg-white z-10 shadow-[1px_0_0_0_#f1f5f9]">
                    <div className="h-6 w-6 bg-[#0052FF]/10 text-[#0052FF] rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 uppercase">
                      {member.uid?.substring(0, 1) || 'U'}
                    </div>
                    <span className="truncate max-w-[80px]">UID:{member.uid?.substring(0, 5)}</span>
                  </td>
                  {status.map((st, i) => (
                    <td key={i} className="py-3 px-2 text-center">
                      <div className="flex justify-center">{getIcon(st)}</div>
                    </td>
                  ))}
                </tr>
              );
            })}
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
