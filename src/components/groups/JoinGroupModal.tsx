import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { api } from '../../services/api';

export function JoinGroupModal() {
  const { navigate, goBackTo } = useNavigation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setCode(prev => prev.slice(0, -1));
    } else if (code.length < 6) {
      setCode(prev => prev + key);
    }
  };

  const handleJoin = async () => {
    if (code.length === 6) {
      setLoading(true);
      setError(null);
      try {
        // Assuming the code is the ID for now, or the API has a join-by-code endpoint
        // For our current API, we use joinGroup(id)
        await api.joinGroup(Number(code));
        navigate('group-details', { groupId: code });
      } catch (err: any) {
        console.error('Failed to join group:', err);
        setError(err.message || 'Invalid group code or group is full');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/40 flex flex-col justify-end xl:items-center xl:justify-center fixed inset-0 z-50">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full bg-white rounded-t-[32px] xl:rounded-[32px] xl:max-w-[420px] flex flex-col relative pt-2 overflow-hidden shadow-2xl"
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3 xl:hidden" />
        
        <div className="px-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <button 
            onClick={() => navigate(goBackTo || 'home')} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full"
            disabled={loading}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-slate-900">Join Group</h2>
          <div className="w-8" />
        </div>

        <div className="p-6 flex flex-col items-center">
          {error && (
            <div className="w-full mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100 text-center">
              {error}
            </div>
          )}

          <div className="w-16 h-16 bg-blue-50 text-[#0052FF] rounded-full flex items-center justify-center mb-6">
            <UserPlus size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Enter Invite Code</h3>
          <p className="text-sm text-slate-500 text-center mb-8 px-4">Ask the group admin for the 6-digit code to join this specific Ajo.</p>

          <div className="flex gap-2 mb-10 w-full justify-center">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div 
                key={i} 
                className={`w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-bold border-2 transition-colors ${i < code.length ? 'border-[#0052FF] text-slate-900' : i === code.length ? 'border-[#0052FF] bg-blue-50/50' : 'border-slate-100 bg-slate-50 text-slate-300'}`}
              >
                {code[i] || ''}
              </div>
            ))}
          </div>

          {/* Custom Numpad */}
          <div className="grid grid-cols-3 gap-y-6 gap-x-12 w-full max-w-[280px] mb-8">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button 
                key={num} 
                onClick={() => handleKeyPress(num)}
                disabled={loading}
                className="text-2xl font-semibold text-slate-800 hover:text-[#0052FF] active:scale-95 transition-all text-center py-2"
              >
                {num}
              </button>
            ))}
            <div />
            <button 
              onClick={() => handleKeyPress('0')}
              disabled={loading}
              className="text-2xl font-semibold text-slate-800 hover:text-[#0052FF] active:scale-95 transition-all text-center py-2"
            >
              0
            </button>
            <button 
              onClick={() => handleKeyPress('backspace')}
              disabled={loading}
              className="text-lg font-semibold text-slate-500 hover:text-slate-800 active:scale-95 transition-all flex items-center justify-center py-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
            </button>
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={handleJoin}
            disabled={code.length !== 6 || loading}
            className={`w-full font-semibold py-4 rounded-2xl transition-all flex items-center justify-center ${code.length === 6 ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400'}`}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'Join Group'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
