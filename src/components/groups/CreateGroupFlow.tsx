import { ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';

export function CreateGroupFlow() {
  const { navigate, goBackTo } = useNavigation();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => {
    if (step > 1) setStep(s => s - 1);
    else navigate(goBackTo || 'home');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 xl:pb-0 flex flex-col items-center">
      <div className="w-full max-w-[420px] bg-white min-h-screen xl:min-h-[85vh] xl:mt-8 xl:rounded-[32px] xl:shadow-sm xl:border border-slate-100 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-10 pb-6 border-b border-slate-100 bg-white relative z-10">
          <button 
            onClick={prevStep} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-[#0052FF]' : i < step ? 'w-2 bg-[#0052FF]' : 'w-2 bg-slate-200'}`} 
              />
            ))}
          </div>
          <div className="w-8" />
        </div>

        <div className="flex-1 flex flex-col relative overflow-hidden px-6 pb-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col absolute inset-0 px-6 pt-6"
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Name your Ajo</h1>
                  <p className="text-slate-500 text-sm">Give your group a unique name to help members identify it.</p>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 mb-2 block">Group Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CS Dept Ajo 2024" 
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors text-slate-900 font-medium" 
                    autoFocus
                  />
                </div>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-6 shadow-lg shadow-blue-500/30"
                >
                  Continue
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col absolute inset-0 px-6 pt-6"
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Contribution Details</h1>
                  <p className="text-slate-500 text-sm">Set how much and how often each member contributes.</p>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-2 block">Amount per Member</label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-slate-500 font-medium">₦</span>
                      <input 
                        type="number" 
                        placeholder="5000" 
                        className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors text-slate-900 font-medium text-lg" 
                        autoFocus
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-2 block">Frequency</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Daily', 'Weekly', 'Monthly'].map(freq => (
                        <button 
                          key={freq}
                          className={`py-3.5 rounded-xl border font-medium text-sm transition-colors ${freq === 'Weekly' ? 'border-[#0052FF] bg-blue-50 text-[#0052FF]' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-6 shadow-lg shadow-blue-500/30"
                >
                  Continue
                </motion.button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col absolute inset-0 px-6 pt-6"
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Payout Order</h1>
                  <p className="text-slate-500 text-sm">How should members be paid when it is their turn?</p>
                </div>
                <div className="flex-1 space-y-3">
                   {[
                     { title: "Random Assignment", desc: "System auto-generates order. Best for fairness." },
                     { title: "Admin Selection", desc: "You pick who gets paid each cycle." },
                     { title: "First Come First Serve", desc: "Based on who pays first." }
                   ].map((method, idx) => (
                     <div key={idx} className={`p-4 rounded-2xl border ${idx === 0 ? 'border-[#0052FF] bg-blue-50/50' : 'border-slate-200 bg-white'} flex items-start gap-3 cursor-pointer`}>
                        <div className={`mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 ${idx === 0 ? 'border-[#0052FF] bg-[#0052FF]' : 'border-slate-300'}`}>
                           {idx === 0 && <Check size={12} className="text-white" />}
                        </div>
                        <div>
                          <h3 className={`font-semibold text-sm ${idx === 0 ? 'text-[#0052FF]' : 'text-slate-900'}`}>{method.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{method.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('group-details')}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-6 shadow-lg shadow-blue-500/30"
                >
                  Create Group
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
