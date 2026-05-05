import { ArrowLeft, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigation } from '../../contexts/NavigationContext';

export function EditProfile() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 xl:pb-0 flex flex-col items-center">
      <div className="w-full max-w-[420px] bg-white min-h-screen xl:min-h-[85vh] xl:mt-8 xl:rounded-[32px] xl:shadow-sm xl:border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center px-6 pt-10 pb-6 border-b border-slate-100">
          <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 ml-2">Edit Profile</h1>
        </div>

        <div className="flex-1 px-6 py-8 flex flex-col">
          {/* Avatar Section */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-600 shadow-inner border-4 border-white shadow-sm overflow-hidden">
                GE
              </div>
              <button className="absolute bottom-0 right-0 bg-[#0052FF] text-white p-2 rounded-full border-2 border-white shadow-sm hover:scale-105 transition-transform">
                <Camera size={16} />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5 flex-1">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Full Name</label>
              <input 
                type="text" 
                defaultValue="Goodluck E." 
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors text-slate-900 font-medium" 
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Phone Number</label>
              <input 
                type="tel" 
                defaultValue="+234 901 234 5678" 
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors text-slate-900 font-medium" 
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Email Address</label>
              <input 
                type="email" 
                defaultValue="goodluck@gmail.com" 
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white transition-colors text-slate-900 font-medium" 
              />
            </div>
          </div>

          <div className="mt-8 pb-8">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              whileHover={{ translateY: -2 }}
              onClick={() => navigate('profile')}
              className="w-full bg-[#0052FF] text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/30"
            >
              Save Changes
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
