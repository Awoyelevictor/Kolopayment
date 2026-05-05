import { ArrowLeft, Users, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';

export function GroupAction() {
  const { navigate, goBackTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 xl:pb-0 flex flex-col items-center">
      <div className="w-full max-w-[420px] bg-white min-h-screen xl:min-h-[85vh] xl:mt-8 xl:rounded-[32px] xl:shadow-sm xl:border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center px-6 pt-10 pb-6 border-b border-slate-100">
          <button 
            onClick={() => navigate(goBackTo || 'home')} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 ml-2">Add Group</h1>
        </div>

        <div className="flex-1 px-6 py-8 flex flex-col justify-center space-y-6">
           <motion.button 
             whileTap={{ scale: 0.98 }}
             onClick={() => navigate('create-group', { goBackTo })}
             className="w-full bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center hover:border-[#0052FF] hover:bg-blue-50/50 transition-colors"
           >
             <div className="h-16 w-16 bg-[#0052FF]/10 text-[#0052FF] rounded-full flex items-center justify-center mb-4">
               <Plus size={32} />
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-2">Create a New Group</h3>
             <p className="text-sm text-slate-500">Start an Ajo and invite your friends or colleagues to join.</p>
           </motion.button>

           <motion.button 
             whileTap={{ scale: 0.98 }}
             onClick={() => navigate('join-group', { goBackTo })}
             className="w-full bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center hover:border-[#0052FF] hover:bg-blue-50/50 transition-colors"
           >
             <div className="h-16 w-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-4">
               <Users size={32} />
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-2">Join a Group</h3>
             <p className="text-sm text-slate-500">Enter a 6-digit invite code to join an existing group.</p>
           </motion.button>
        </div>
      </div>
    </div>
  );
}
