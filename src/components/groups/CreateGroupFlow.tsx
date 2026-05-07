import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { api } from '../../services/api';

export function CreateGroupFlow() {
  const { navigate, goBackTo } = useNavigation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contribution_amount: 5000,
    frequency: 'weekly',
    max_members: 10
  });

  const totalSteps = 3;

  const nextStep = () => {
    if (step === 1 && !formData.name) return;
    if (step === 2 && !formData.contribution_amount) return;
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => {
    if (step > 1) setStep(s => s - 1);
    else navigate(goBackTo || 'home');
  };

  const handleCreateGroup = async () => {
    setLoading(true);
    setError(null);
    try {
      const group = await api.createGroup(formData);
      navigate('group-details', { groupId: group.id });
    } catch (err: any) {
      console.error('Failed to create group:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 xl:pb-0 flex flex-col items-center">
      <div className="w-full max-w-[420px] bg-white min-h-screen xl:min-h-[85vh] xl:mt-8 xl:rounded-[32px] xl:shadow-sm xl:border border-slate-100 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-10 pb-6 border-b border-slate-100 bg-white relative z-10">
          <button 
            onClick={prevStep} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50"
            disabled={loading}
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

        <div className="flex-1 flex flex-col relative overflow-y-auto hide-scrollbar px-6 pb-8">
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col pt-6"
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Name your Ajo</h1>
                  <p className="text-slate-500 text-sm">Give your group a unique name to help members identify it.</p>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">Group Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CS Dept Ajo 2024" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors text-slate-900 font-medium" 
                    autoFocus
                  />
                  
                  <label className="text-xs font-semibold text-slate-500 mt-6 mb-2 block uppercase tracking-wider">Description (Optional)</label>
                  <textarea 
                    placeholder="What is this group for?" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors text-slate-900 font-medium h-24 resize-none" 
                  />
                </div>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  disabled={!formData.name}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-6 shadow-lg shadow-blue-500/30 disabled:opacity-50"
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
                className="w-full flex flex-col pt-6"
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Contribution Details</h1>
                  <p className="text-slate-500 text-sm">Set how much and how often each member contributes.</p>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">Amount per Member</label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-slate-500 font-medium">₦</span>
                      <input 
                        type="number" 
                        placeholder="5000" 
                        value={formData.contribution_amount}
                        onChange={(e) => setFormData({...formData, contribution_amount: Number(e.target.value)})}
                        className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors text-slate-900 font-medium text-lg" 
                        autoFocus
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">Frequency</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['daily', 'weekly', 'monthly'].map(freq => (
                        <button 
                          key={freq}
                          onClick={() => setFormData({...formData, frequency: freq})}
                          className={`py-3.5 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${formData.frequency === freq ? 'border-[#0052FF] bg-blue-50 text-[#0052FF]' : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'}`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">Member Limit</label>
                    <input 
                      type="number" 
                      value={formData.max_members}
                      onChange={(e) => setFormData({...formData, max_members: Number(e.target.value)})}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors text-slate-900 font-medium" 
                    />
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
                className="w-full flex flex-col pt-6"
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Review & Create</h1>
                  <p className="text-slate-500 text-sm">Make sure everything looks right before starting the group.</p>
                </div>
                <div className="flex-1 space-y-4">
                   <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500 text-sm">Name</span>
                          <span className="font-bold text-slate-900">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 text-sm">Amount</span>
                          <span className="font-bold text-slate-900">₦{formData.contribution_amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 text-sm">Frequency</span>
                          <span className="font-bold text-slate-900 capitalize">{formData.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 text-sm">Limit</span>
                          <span className="font-bold text-slate-900">{formData.max_members} Members</span>
                        </div>
                      </div>
                   </div>
                   
                   <div className="p-4 rounded-2xl border border-[#0052FF] bg-blue-50/50 flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-[#0052FF] flex items-center justify-center flex-shrink-0">
                         <Check size={12} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-[#0052FF]">Random Payout Order</h3>
                        <p className="text-xs text-slate-500 mt-0.5">The system will automatically assign a fair rotation once the group starts.</p>
                      </div>
                   </div>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateGroup}
                  disabled={loading}
                  className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl mt-6 shadow-lg shadow-blue-500/30 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : 'Create Group'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
