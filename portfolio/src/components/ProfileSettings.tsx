import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { usePortfolioData } from '../hooks/usePortfolioData';
import type { Profile } from '../hooks/usePortfolioData';

export const ProfileSettings: React.FC = () => {
  const { profile: initialProfile } = usePortfolioData();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProfile) {
      const { skills, education, employment, ...coreInfo } = initialProfile;
      setProfile(coreInfo);
    }
  }, [initialProfile]);

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profile/picture_${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setProfile(prev => ({ ...prev, profilePicture: downloadURL }));
      // Auto-save the profile picture update
      await updateDoc(doc(db, "profile", "main"), { profilePicture: downloadURL });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload picture. Check Firebase Storage configuration.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      // Exclude list fields to prevent overwriting with stale data
      const { skills, education, employment, ...dataToSave } = profile as any;
      await updateDoc(doc(db, "profile", "main"), dataToSave);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display">Core Profile</h2>
        <div className="flex items-center gap-4">
          {message && <span className="text-sm font-body text-primary">{message}</span>}
          <button 
            onClick={handleSave}
            disabled={saving || uploading}
            className="bg-primary text-on-primary px-8 py-3 rounded font-label font-bold uppercase tracking-widest text-xs disabled:opacity-50 shadow-soft"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      <form className="space-y-12">
        {/* Profile Picture Upload Section */}
        <section className="space-y-6">
          <h3 className="text-sm font-label uppercase tracking-widest text-primary border-b border-outline-variant pb-2">Profile Picture</h3>
          <div className="flex gap-8 items-center">
            <div className="w-32 h-32 bg-surface-container rounded-full border border-outline-variant overflow-hidden flex items-center justify-center relative group">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-5xl text-outline-variant">person</span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-surface-container/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary"></div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleProfilePictureUpload} 
                className="hidden" 
                ref={fileInputRef}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-surface-container-high border border-outline-variant px-6 py-3 rounded font-label font-bold uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary transition-all"
              >
                {profile.profilePicture ? 'Change Photo' : 'Upload Photo'}
              </button>
              <p className="text-[10px] text-on-surface-variant italic">Recommended: Square aspect ratio. Max 2MB.</p>
            </div>
          </div>
        </section>

        {/* Core Info */}
        <section className="space-y-6">
          <h3 className="text-sm font-label uppercase tracking-widest text-primary border-b border-outline-variant pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Display Name</label>
              <input name="name" value={profile.name || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" type="text" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Role Title</label>
              <input name="role" value={profile.role || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" type="text" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Contact Email</label>
              <input name="email" value={profile.email || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" type="email" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Phone Number</label>
              <input name="phone" value={profile.phone || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" type="text" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">LinkedIn URL</label>
              <input name="linkedin" value={profile.linkedin || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" type="text" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">GitHub URL</label>
              <input name="github" value={profile.github || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" type="text" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Color Theme</label>
              <select 
                name="theme" 
                value={profile.theme || 'default'} 
                onChange={handleChange} 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body appearance-none"
              >
                <option value="default">Monochrome (Default)</option>
                <option value="ocean">Ocean (Blue)</option>
                <option value="emerald">Emerald (Green)</option>
                <option value="rose">Rose (Pink)</option>
                <option value="midnight">Midnight (Purple)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="space-y-6">
          <h3 className="text-sm font-label uppercase tracking-widest text-primary border-b border-outline-variant pb-2">Hero / Intro</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Hero Title</label>
              <input name="heroTitle" value={profile.heroTitle || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" type="text" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Hero Description</label>
              <textarea name="heroDescription" value={profile.heroDescription || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body min-h-[80px]" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="space-y-6">
          <h3 className="text-sm font-label uppercase tracking-widest text-primary border-b border-outline-variant pb-2">About / Philosophy</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">About Title</label>
              <input name="aboutTitle" value={profile.aboutTitle || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" type="text" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">About Description</label>
              <textarea name="aboutDescription" value={profile.aboutDescription || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body min-h-[120px]" />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};
