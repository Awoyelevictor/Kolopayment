import { ArrowLeft, CreditCard, Building2, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';

export function PaymentDrawer() {
  const { navigate, goBackTo } = useNavigation();

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
          <button 
            onClick={() => navigate(goBackTo || 'home')} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-slate-900">Make Payment</h2>
          <div className="w-8" />
        </div>

        <div className="p-6">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center mb-8">
            <p className="text-sm font-medium text-slate-500 mb-2">Total Contribution</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">₦5,000.<span className="text-xl text-slate-400">00</span></h1>
            
            <div className="w-full bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Group</span>
                <span className="font-semibold text-slate-900">CS Dept Ajo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Week</span>
                <span className="font-semibold text-slate-900">Week 3</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Fee</span>
                <span className="font-semibold text-slate-900">₦0.00</span>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 mb-4 px-1">Select Payment Method</h3>
          
          <div className="space-y-3 mb-8">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('payment-success')}
              className="w-full flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl hover:border-[#0052FF] hover:bg-blue-50/30 transition-colors shadow-sm"
            >
              <div className="h-10 w-10 bg-blue-50 text-[#0052FF] rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard size={20} />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-slate-900 text-sm">Paystack</h4>
                <p className="text-xs text-slate-500 mt-0.5">Pay securely via card, USSD, or Bank</p>
              </div>
            </motion.button>
            
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('payment-success')}
              className="w-full flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl hover:border-[#0052FF] hover:bg-blue-50/30 transition-colors shadow-sm"
            >
              <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Building2 size={20} />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-slate-900 text-sm">Bank Transfer</h4>
                <p className="text-xs text-slate-500 mt-0.5">Transfer directly to group account</p>
              </div>
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('payment-success')}
              className="w-full flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl hover:border-[#0052FF] hover:bg-blue-50/30 transition-colors shadow-sm"
            >
              <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Wallet size={20} />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-slate-900 text-sm">AjoSmart Wallet</h4>
                <p className="text-xs text-slate-500 mt-0.5">Use your available balance</p>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
