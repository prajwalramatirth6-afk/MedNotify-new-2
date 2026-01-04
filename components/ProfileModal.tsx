
import React, { useRef } from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  profile: UserProfile;
  updateProfile: (newProfile: UserProfile) => void;
  userPhoto: string | null;
  setUserPhoto: (photo: string | null) => void;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ profile, updateProfile, userPhoto, setUserPhoto, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateProfile({ ...profile, [name]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Health Profile</h3>
          <button onClick={onClose} className="text-slate-400 p-2 hover:bg-slate-100 rounded-full transition-colors">✕</button>
        </div>

        <div className="space-y-6">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center space-y-3 pb-4 border-b border-slate-50">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-lg overflow-hidden cursor-pointer relative group transition-transform active:scale-95"
            >
              {userPhoto ? (
                <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs font-bold">Edit</span>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handlePhotoUpload} 
            />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tap to change photo</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal & Stats</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Age</label>
                <input
                  name="age"
                  type="number"
                  placeholder="e.g. 25"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={profile.age}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Gender</label>
                <select
                  name="gender"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={profile.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">BP (e.g. 120/80)</label>
                <input
                  name="bloodPressure"
                  type="text"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={profile.bloodPressure}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Sugar (mg/dL)</label>
                <input
                  name="sugarLevel"
                  type="text"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={profile.sugarLevel}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical History</h4>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Allergies</label>
              <textarea
                name="allergies"
                rows={2}
                placeholder="List any known allergies..."
                className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                value={profile.allergies}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Doctor's Primary Note</label>
              <textarea
                name="doctorNotes"
                rows={2}
                placeholder="Important medical advice..."
                className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                value={profile.doctorNotes}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Additional Notes</label>
              <textarea
                name="additionalNotes"
                rows={2}
                className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                value={profile.additionalNotes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest">Emergency Contact</h4>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Numbers (Comma separated)</label>
              <input
                name="emergencyContacts"
                type="text"
                placeholder="+1 234 567 890, ..."
                className="w-full p-3 bg-red-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-mono"
                value={profile.emergencyContacts}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button 
              onClick={onClose}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
