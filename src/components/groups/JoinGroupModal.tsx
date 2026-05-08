import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '../../context/FirebaseContext';

export function JoinGroupModal() {
  const { navigate, goBackTo } = useNavigation();
  const { user } = useFirebase();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setCode(prev => prev.slice(0, -1));
    } else if (code.length < 6) {
      setCode(prev => prev + key);
    }
    setError(null);
  };

  const handleJoin = async () => {
    if (!user) return;
    if (code.length === 6) {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Search for group with this join code
        const q = query(collection(db, 'groups'), where('joinCode', '==', code.toUpperCase()));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setError('Invalid invite code. Please check and try again.');
          setIsLoading(false);
          return;
        }

        const groupDoc = snapshot.docs[0];
        const groupId = groupDoc.id;

        // 2. Add user to members subcollection
        // We'll also store their position (payout index)
        // In a real app, we'd need a transaction to ensure unique positions
        const membersSnapshot = await getDocs(collection(db, 'groups', groupId, 'members'));
        const memberCount = membersSnapshot.size;
        
        await setDoc(doc(db, 'groups', groupId, 'members', user.uid), {
          uid: user.uid,
          joinedAt: serverTimestamp(),
          position: memberCount + 1,
          status: 'active'
        });

        const data = groupDoc.data();
        await setDoc(doc(db, 'users', user.uid, 'memberships', groupId), {
          groupId,
          name: data.name,
          amount: data.amount,
          cycle: data.cycle,
          status: 'active',
          maxMembers: data.maxMembers,
          joinedAt: serverTimestamp()
        });

        navigate('group-details', { groupId });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'groups/members');
        setError('Failed to join group. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/40 flex flex-col justify-end xl:items-center xl:justify-center">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full bg-white rounded-t-[32px] xl:rounded-[32px] xl:max-w-[420px] flex flex-col relative pt-2"
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3 xl:hidden" />
        
        <div className="px-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <button 
            onClick={() => navigate(goBackTo || 'home')} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-slate-900">Join Group</h2>
          <div className="w-8" />
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 text-[#0052FF] rounded-full flex items-center justify-center mb-6">
            <UserPlus size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Enter Invite Code</h3>
          <p className="text-sm text-slate-500 text-center mb-8">Ask the group admin for the 6-digit code to join this specific Ajo.</p>

          <div className="flex flex-col items-center w-full">
            <div className="flex gap-2 mb-4 w-full justify-center">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className={`w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-bold border-2 transition-colors ${i < code.length ? 'border-[#0052FF] text-slate-900' : i === code.length ? 'border-[#0052FF] bg-blue-50/50' : 'border-slate-100 bg-slate-50 text-slate-300'}`}
                >
                  {code[i] || ''}
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs mb-6 font-medium bg-red-50 p-2 px-4 rounded-full border border-red-100">{error}</p>}
          </div>

          {/* Custom Numpad */}
          <div className="grid grid-cols-3 gap-y-6 gap-x-12 w-full max-w-[280px] mb-8">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button 
                key={num} 
                disabled={isLoading}
                onClick={() => handleKeyPress(num)}
                className="text-2xl font-semibold text-slate-800 hover:text-[#0052FF] active:scale-95 transition-all text-center py-2 flex items-center justify-center disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            <div />
            <button 
              disabled={isLoading}
              onClick={() => handleKeyPress('0')}
              className="text-2xl font-semibold text-slate-800 hover:text-[#0052FF] active:scale-95 transition-all text-center py-2 flex items-center justify-center disabled:opacity-50"
            >
              0
            </button>
            <button 
              disabled={isLoading}
              onClick={() => handleKeyPress('backspace')}
              className="text-lg font-semibold text-slate-500 hover:text-slate-800 active:scale-95 transition-all flex items-center justify-center py-2 disabled:opacity-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
            </button>
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={handleJoin}
            disabled={code.length !== 6 || isLoading}
            className={`w-full font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${code.length === 6 && !isLoading ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400'}`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Join Group'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
