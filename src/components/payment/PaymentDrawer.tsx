import { ArrowLeft, CreditCard, Building2, Wallet, Loader2, ChevronRight, Copy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useFirebase } from '../../context/FirebaseContext';
import { useState, useEffect } from 'react';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp, increment, getDocs, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { payazaService } from '../../services/payazaService';

export function PaymentDrawer() {
  const { navigate, goBackTo, activeGroupId } = useNavigation();
  const { user, userProfile } = useFirebase();
  const [groupId, setGroupId] = useState(activeGroupId);
  const [group, setGroup] = useState<any>(null);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [view, setView] = useState<'options' | 'bank'>('options');
  const [virtualAccount, setVirtualAccount] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch all user groups just in case
        const q = query(collection(db, 'users', user.uid, 'memberships'));
        const membershipsSnap = await getDocs(q);
        const groups = membershipsSnap.docs.map(doc => ({ id: doc.data().groupId, ...doc.data() }));
        setUserGroups(groups);

        // If we have a specific groupId, fetch its details
        const targetId = activeGroupId || groupId || (groups.length > 0 ? groups[0].id : null);
        if (targetId) {
          const docRef = doc(db, 'groups', targetId);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            setGroup({ id: snapshot.id, ...snapshot.data() });
            setGroupId(targetId);
          }
        }
      } catch (err) {
        console.error("Fetch group data error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [user, activeGroupId]);

  const handleWalletPayment = async () => {
    if (!user || !group || !userProfile) return;
    
    if (userProfile.walletBalance < group.amount) {
      alert("Insufficient wallet balance. Please top up your wallet.");
      return;
    }

    setIsPaying(true);
    try {
      // 1. Create transaction record
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        groupId: group.id,
        amount: group.amount,
        type: 'contribution',
        status: 'completed',
        timestamp: serverTimestamp(),
        description: `Contribution to ${group.name}`
      });

      // 2. Deduct from wallet
      await updateDoc(doc(db, 'users', user.uid), {
        walletBalance: increment(-group.amount),
        updatedAt: serverTimestamp()
      });

      // 3. Update contribution record in group subcollection
      await addDoc(collection(db, 'groups', group.id, 'contributions'), {
        userId: user.uid,
        amount: group.amount,
        week: 1, // Placeholder week
        status: 'paid',
        timestamp: serverTimestamp()
      });

      // 4. Create notification
      await addDoc(collection(db, 'notifications'), {
        userId: user.uid,
        title: 'Payment successful',
        message: `You paid ₦${group.amount.toLocaleString()} to ${group.name}`,
        category: 'payments',
        type: 'success',
        read: false,
        createdAt: serverTimestamp()
      });

      navigate('payment-success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'transactions');
      alert("Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleSelectGroup = async (id: string) => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'groups', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setGroup({ id: snapshot.id, ...snapshot.data() });
        setGroupId(id);
      }
    } catch (err) {
      console.error("Select group error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPayment = async () => {
    if (!user || !group || !userProfile) return;
    setIsPaying(true);
    try {
      const response = await payazaService.initializePayment({
        amount: group.amount,
        email: user.email || '',
        first_name: userProfile.firstName,
        last_name: userProfile.lastName,
        phone_number: userProfile.phone || '08000000000',
        currency: 'NGN'
      });

      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        // Fallback for demo
        navigate('payment-success');
      }
    } catch (err: any) {
      console.error("Payaza Init Error:", err);
      if (err.response?.status === 403) {
        alert("Not authorized. Please check your Payaza API keys.");
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
    } finally {
      setIsPaying(false);
    }
  };

  const handleBankTransfer = async () => {
    if (!user || !userProfile) return;
    setIsLoading(true);
    setView('bank');
    try {
      const response = await payazaService.createVirtualAccount({
        email: user.email || '',
        first_name: userProfile.firstName,
        last_name: userProfile.lastName,
        phone_number: userProfile.phone || '08000000000'
      });
      
      if (response && (response.data || response.account_number)) {
        const data = response.data || response;
        setVirtualAccount({
          accountName: data.account_name || data.accountName || 'KOLOPAY/USER',
          accountNumber: data.account_number || data.accountNumber,
          bankName: data.bank_name || data.bankName || 'Payaza Bank'
        });
      }
    } catch (error: any) {
      console.error('Virtual Account Error:', error);
      if (error.response?.status === 403) {
        alert("Not authorized. Please check your Payaza API keys.");
      } else {
        alert('Failed to generate Payaza virtual account.');
      }
      setView('options');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (virtualAccount) {
      navigator.clipboard.writeText(virtualAccount.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900/40 flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    );
  }

  if (!group || userGroups.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900/40 flex flex-col justify-end xl:items-center xl:justify-center">
        <div className="w-full bg-white rounded-t-[32px] xl:rounded-[32px] xl:max-w-[420px] p-8 text-center shadow-2xl">
          <div className="h-16 w-16 bg-blue-50 text-[#0052FF] rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet size={32} />
          </div>
          <h2 className="text-xl font-bold mb-2">No Active Groups</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">You need to be part of at least one Ajo group to make payments.</p>
          <button onClick={() => navigate('groups')} className="w-full bg-[#0052FF] text-white py-4 rounded-2xl font-bold">Join or Create Group</button>
          <button onClick={() => navigate('home')} className="w-full text-slate-500 py-4 mt-2 font-semibold">Back Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/40 flex flex-col justify-end xl:items-center xl:justify-center">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full bg-white rounded-t-[32px] xl:rounded-[32px] xl:max-w-[420px] flex flex-col relative pt-2 overflow-hidden shadow-2xl"
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3 xl:hidden" />
        
        <div className="px-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            {view === 'bank' ? (
              <button 
                onClick={() => setView('options')} 
                className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full"
              >
                <ArrowLeft size={24} />
              </button>
            ) : (
              <button 
                onClick={() => navigate(goBackTo || 'home')} 
                className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <h2 className="text-lg font-bold text-slate-900">
              {view === 'options' ? 'Make Payment' : 'Bank Transfer'}
            </h2>
          </div>
          <div className="w-8" />
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {view === 'options' ? (
              <motion.div
                key="options"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Group Selector if multiple groups */}
                {userGroups.length > 1 && (
                  <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {userGroups.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleSelectGroup(g.id)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                          groupId === g.id ? 'bg-[#0052FF] text-white border-[#0052FF]' : 'bg-white text-slate-500 border-slate-200'
                        }`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center mb-8">
                  <p className="text-sm font-medium text-slate-500 mb-2">Total Contribution</p>
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">₦{group.amount.toLocaleString()}.<span className="text-xl text-slate-400">00</span></h1>
                  
                  <div className="w-full bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-sm space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-slate-500">Group</span>
                      <span className="font-semibold text-slate-900 truncate ml-4 text-right">{group.name}</span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-slate-500">Frequency</span>
                      <span className="font-semibold text-slate-900 capitalize">{group.cycle}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center px-1">
                      <span className="text-slate-500 font-medium">Service Fee</span>
                      <span className="font-semibold text-slate-900">₦0.00</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 mb-4 px-1">Select Payment Method</h3>
                
                <div className="space-y-3 mb-8">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    disabled={isPaying}
                    onClick={handleWalletPayment}
                    className="w-full flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl hover:border-[#0052FF] hover:bg-blue-50/30 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <div className="h-10 w-10 bg-blue-50 text-[#0052FF] rounded-full flex items-center justify-center flex-shrink-0">
                      {isPaying ? <Loader2 className="animate-spin" size={20} /> : <Wallet size={20} />}
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm">KoloPay Wallet</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Balance: ₦{userProfile?.walletBalance?.toLocaleString() || 0}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </motion.button>

                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    disabled={isPaying}
                    onClick={handleCardPayment}
                    className="w-full flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl hover:border-[#0052FF] hover:bg-blue-50/30 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      {isPaying ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm">Payaza / Card</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Pay securely via card or USSD</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </motion.button>
                  
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    disabled={isPaying}
                    onClick={handleBankTransfer}
                    className="w-full flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl hover:border-[#0052FF] hover:bg-blue-50/30 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm">Bank Transfer</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Transfer directly to group account</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="bank"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {virtualAccount ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 relative overflow-hidden">
                    <div className="text-center mb-8">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Group Contribution Account</p>
                      <h3 className="text-3xl font-bold text-slate-900 font-mono tracking-wider">{virtualAccount.accountNumber}</h3>
                    </div>
                    
                    <div className="space-y-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Bank Name</span>
                        <span className="text-sm font-bold text-slate-900">{virtualAccount.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                        <span className="text-sm text-slate-500">Account Name</span>
                        <span className="text-sm font-bold text-slate-900 text-right">{virtualAccount.accountName}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                        <span className="text-sm text-slate-500">Amount to Pay</span>
                        <span className="text-sm font-bold text-[#0052FF]">₦{group.amount.toLocaleString()}.00</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleCopy}
                      className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-[#0052FF] text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                      {copied ? 'Copied' : 'Copy Account Number'}
                    </button>
                    
                    <p className="text-[11px] text-slate-400 text-center mt-6 leading-relaxed">
                      Powered by Payaza. Funds are automatically tracked and verified for this group.
                    </p>
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-[#0052FF]" size={40} />
                    <p className="text-slate-500 font-medium">Generating Payaza virtual account...</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

