import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, CreditCard, Copy, CheckCircle2, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { payazaService } from '../../services/payazaService';
import { useFirebase } from '../../context/FirebaseContext';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'options' | 'bank' | 'card';

export function AddMoneyModal({ isOpen, onClose }: AddMoneyModalProps) {
  const { user, userProfile } = useFirebase();
  const [view, setView] = useState<ModalView>('options');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [virtualAccount, setVirtualAccount] = useState<{
    accountName: string;
    accountNumber: string;
    bankName: string;
  } | null>(null);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showBankTransfer = async () => {
    if (!user || !userProfile) return;
    setIsLoading(true);
    setView('bank');
    try {
      // Real Payaza Virtual Account Creation
      const response = await payazaService.createVirtualAccount({
        email: user.email || '',
        first_name: userProfile.firstName,
        last_name: userProfile.lastName,
        phone_number: userProfile.phone || '08000000000'
      });
      
      // Map Payaza v2 / Pro response
      if (response && (response.data || response.account_number)) {
        const data = response.data || response;
        setVirtualAccount({
          accountName: data.account_name || data.accountName || 'KOLOPAY/USER',
          accountNumber: data.account_number || data.accountNumber,
          bankName: data.bank_name || data.bankName || 'Payaza Bank'
        });
      } else {
        throw new Error(response?.message || 'Failed to generate Payaza virtual account');
      }
    } catch (error: any) {
      console.error('Virtual Account Error:', error);
      alert(error.message || 'Failed to generate Payaza virtual account. Please check your Payaza configuration.');
      setView('options');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardTopUp = async () => {
    if (!user || !userProfile) return;
    setIsLoading(true);
    try {
      const amount = 5000;
      const response = await payazaService.initializePayment({
        amount,
        email: user.email || '',
        first_name: userProfile.firstName,
        last_name: userProfile.lastName,
        phone_number: userProfile.phone || '08000000000',
        currency: 'NGN'
      });

      // Create a pending transaction
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        amount,
        type: 'topup',
        status: 'pending',
        timestamp: serverTimestamp(),
        payazaReference: response.transaction_reference || 'REF-' + Date.now()
      });

      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        // Success simulation for Demo Mode
        console.log('Demo Payment Success:', response);
        
        // Update Firestore Wallet Balance
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          walletBalance: increment(amount),
          updatedAt: serverTimestamp()
        });

        // Add a success notification
        await addDoc(collection(db, 'notifications'), {
          userId: user.uid,
          title: 'Wallet Topped Up',
          message: `Successfully added ₦${amount.toLocaleString()} to your wallet.`,
          category: 'payments',
          type: 'success',
          read: false,
          createdAt: serverTimestamp()
        });

        alert('Demo Payment Successful! ₦5,000 has been added to your wallet.');
        resetAndClose();
      }
    } catch (error) {
       console.error('Card Topup Error:', error);
       alert('Failed to initialize card payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setView('options');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-2xl overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#0052FF]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {view !== 'options' && (
                    <button onClick={() => setView('options')} className="p-1 -ml-1 text-slate-500 hover:text-slate-900 transition-colors">
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <h2 className="text-xl font-bold text-slate-900">
                    {view === 'options' ? 'Add Money' : view === 'bank' ? 'Bank Transfer' : 'Card Payment'}
                  </h2>
                </div>
                <button 
                  onClick={resetAndClose}
                  className="p-2 -mr-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100/50"
                >
                  <X size={20} />
                </button>
              </div>

              {view === 'options' && (
                <div className="space-y-4">
                  <button 
                    onClick={showBankTransfer}
                    className="w-full bg-white/60 p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:bg-white transition-colors group"
                  >
                    <div className="h-10 w-10 bg-blue-50 text-[#0052FF] rounded-full flex items-center justify-center">
                      <Building2 size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-slate-900 text-sm">Bank Transfer</h3>
                      <p className="text-xs text-slate-500">Fast and reliable bank deposit</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </button>

                  <button 
                    onClick={() => setView('card')}
                    className="w-full bg-white/60 p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:bg-white transition-colors group"
                  >
                    <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                      <CreditCard size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-slate-900 text-sm">Debit Card</h3>
                      <p className="text-xs text-slate-500">Instant top up from your card</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </button>
                </div>
              )}

              {view === 'bank' && (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="text-[#0052FF] animate-spin" size={40} />
                      <p className="text-sm font-medium text-slate-500 text-center px-8">Generating your unique virtual account...</p>
                    </div>
                  ) : virtualAccount && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/60 p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden"
                    >
                      <div className="text-center mb-6">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Transfer to account</p>
                        <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-wider">{virtualAccount.accountNumber}</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-50">
                          <span className="text-xs font-medium text-slate-500">Bank Name</span>
                          <span className="text-xs font-bold text-slate-900">{virtualAccount.bankName}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-50">
                          <span className="text-xs font-medium text-slate-500">Account Name</span>
                          <span className="text-xs font-bold text-slate-900">{virtualAccount.accountName}</span>
                        </div>
                      </div>

                      <button 
                        onClick={handleCopy}
                        className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-[#0052FF] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                      >
                        {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                        {copied ? 'Copied' : 'Copy Account Number'}
                      </button>
                    </motion.div>
                  )}
                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    Account expires in 24 hours. Funds credited instantly after transfer. Powered by Payaza.
                  </p>
                </div>
              )}

              {view === 'card' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
                    <p className="text-xs text-blue-700 leading-relaxed">
                      You are about to top up your wallet with <strong>₦5,000.00</strong>. You will be redirected to the secure Payaza checkout page.
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleCardTopUp}
                    disabled={isLoading}
                    className="w-full py-4 bg-[#0052FF] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-95 disabled:bg-blue-300 flex items-center justify-center gap-2 transition-all"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : null}
                    {isLoading ? 'Redirecting...' : 'Proceed to Payment'}
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
