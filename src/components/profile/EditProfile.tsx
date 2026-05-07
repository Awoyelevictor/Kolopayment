import { ArrowLeft, Camera, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { api } from '../../services/api';

export function EditProfile() {
  const { navigate } = useNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    profileImage: null as File | null,
    previewUrl: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profile = await api.getProfile();
        setFormData({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          phoneNumber: profile.phone_number || '',
          email: profile.email || '',
          profileImage: null,
          previewUrl: profile.profile_image || ''
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updateData: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        email: formData.email
      };
      
      if (formData.profileImage) {
        updateData.profile_image = formData.profileImage;
      }

      await api.updateProfile(updateData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('profile');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 xl:pb-0 flex flex-col items-center">
      <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-2xl min-h-screen xl:min-h-[85vh] xl:mt-8 xl:rounded-[32px] xl:shadow-[0_8px_32px_rgba(0,82,255,0.08)] border border-white/60 flex flex-col overflow-hidden relative">
        
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-4 right-4 z-50 bg-green-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-center gap-2"
            >
              <Check size={20} strokeWidth={3} />
              <span className="font-bold">Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center px-6 pt-10 pb-6 border-b border-white/40">
          <button onClick={() => navigate('profile')} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-white/50">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 ml-2">Edit Profile</h1>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#0052FF]" size={40} />
          </div>
        ) : (
          <div className="flex-1 px-6 py-8 flex flex-col">
            {/* Avatar Section */}
            <div className="flex justify-center mb-10">
              <div className="relative">
                <div className="h-28 w-28 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400 shadow-inner border-4 border-white overflow-hidden relative">
                  {formData.previewUrl ? (
                    <img src={formData.previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    formData.firstName.charAt(0) + (formData.lastName.charAt(0) || '')
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-[#0052FF] text-white p-2.5 rounded-full border-2 border-white shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <Camera size={18} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-5 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white/80 transition-all text-slate-900 font-semibold shadow-sm" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white/80 transition-all text-slate-900 font-semibold shadow-sm" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white/80 transition-all text-slate-900 font-semibold shadow-sm" 
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl outline-none focus:border-[#0052FF] focus:bg-white/80 transition-all text-slate-900 font-semibold shadow-sm" 
                />
              </div>
            </div>

            <div className="mt-8 pb-8">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#0052FF] text-white font-bold py-4 rounded-2xl shadow-[0_4px_14px_0_rgba(0,82,255,0.3)] hover:bg-[#003BBA] transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : 'Save Changes'}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
