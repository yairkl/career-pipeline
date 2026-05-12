import React, { useState, useEffect } from 'react';
import { BaseModal } from './BaseModal';

interface PortfolioItemModalProps {
  type: 'skill' | 'employment' | 'education';
  item: any; // Partial<Skill | Education | Employment>
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
}

export const PortfolioItemModal: React.FC<PortfolioItemModalProps> = ({ type, item, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<any>(() => {
    if (item) {
      return {
        ...item,
        relatedSkills: item.relatedSkills || [],
        recognitions: item.recognitions || []
      };
    }
    return {
      relatedSkills: [],
      recognitions: []
    };
  });
  const [skillInput, setSkillInput] = useState('');
  const [recognitionInput, setRecognitionInput] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        relatedSkills: item.relatedSkills || [],
        recognitions: item.recognitions || []
      });
    } else {
      setFormData({
        relatedSkills: [],
        recognitions: []
      });
    }
    setSkillInput('');
    setRecognitionInput('');
  }, [item, type]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const newSkills = skillInput.split(',').map(s => s.trim()).filter(s => s !== '' && !formData.relatedSkills?.includes(s));
      if (newSkills.length > 0) {
        setFormData((prev: any) => ({
          ...prev,
          relatedSkills: [...(prev.relatedSkills || []), ...newSkills]
        }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev: any) => ({
      ...prev,
      relatedSkills: prev.relatedSkills?.filter((s: string) => s !== skill)
    }));
  };
  
  const addRecognition = () => {
    if (recognitionInput.trim() && !formData.recognitions?.includes(recognitionInput.trim())) {
      setFormData((prev: any) => ({
        ...prev,
        recognitions: [...(prev.recognitions || []), recognitionInput.trim()]
      }));
      setRecognitionInput('');
    }
  };

  const removeRecognition = (rec: string) => {
    setFormData((prev: any) => ({
      ...prev,
      recognitions: prev.recognitions?.filter((r: string) => r !== rec)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const title = {
    skill: item?.name ? 'Edit Skill' : 'Add Skill',
    employment: item?.role ? 'Edit Experience' : 'Add Experience',
    education: item?.degree ? 'Edit Education' : 'Add Education',
  }[type];

  return (
    <BaseModal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      saveButtonText="Save Item"
      maxWidthClass="max-w-2xl"
    >
      {type === 'skill' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest font-bold">Skill Name</label>
            <input 
              name="name" 
              value={formData.name || ''} 
              onChange={handleChange} 
              required 
              className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" 
            />
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest font-bold">Level (%)</label>
            <input 
              type="number" 
              name="level" 
              value={formData.level || 80} 
              onChange={handleChange} 
              min="0" max="100" 
              required 
              className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" 
            />
          </div>
        </div>
      )}

      {type === 'employment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Role</label>
              <input name="role" value={formData.role || ''} onChange={handleChange} required className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Company</label>
              <input name="company" value={formData.company || ''} onChange={handleChange} required className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Start Date</label>
              <input name="startDate" value={formData.startDate || ''} onChange={handleChange} placeholder="e.g., Jan 2020" required className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">End Date (or 'Present')</label>
              <input name="endDate" value={formData.endDate || ''} onChange={handleChange} placeholder="e.g., Dec 2023 or Present" className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest font-bold">Related Skills</label>
            <div className="flex gap-2">
              <input 
                value={skillInput} 
                onChange={(e) => setSkillInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="e.g., React, Node.js" 
                className="flex-1 bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" 
              />
              <button type="button" onClick={addSkill} className="bg-primary text-on-primary px-4 rounded font-label font-bold uppercase tracking-widest text-[10px]">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.relatedSkills?.map((skill: string, i: number) => (
                <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="material-symbols-outlined text-xs leading-none">close</button>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest font-bold">Description</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body min-h-[120px]" />
          </div>
        </div>
      )}

      {type === 'education' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Degree / Certification</label>
              <input name="degree" value={formData.degree || ''} onChange={handleChange} required className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Institution</label>
              <input name="institution" value={formData.institution || ''} onChange={handleChange} required className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Start Date</label>
              <input name="startDate" value={formData.startDate || ''} onChange={handleChange} placeholder="2016" className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">End Date</label>
              <input name="endDate" value={formData.endDate || ''} onChange={handleChange} placeholder="2020" className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">Display Year (fallback)</label>
              <input name="year" value={formData.year || ''} onChange={handleChange} placeholder="2016 - 2020" className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest font-bold">GPA</label>
              <input name="gpa" value={formData.gpa || ''} onChange={handleChange} placeholder="e.g., 3.9/4.0" className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest font-bold">Academic Recognitions / Awards</label>
            <div className="flex gap-2">
              <input 
                value={recognitionInput} 
                onChange={(e) => setRecognitionInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRecognition())}
                placeholder="e.g., Dean's List, Cum Laude" 
                className="flex-1 bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" 
              />
              <button type="button" onClick={addRecognition} className="bg-primary text-on-primary px-4 rounded font-label font-bold uppercase tracking-widest text-[10px]">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.recognitions?.map((rec: string, i: number) => (
                <span key={i} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                  {rec}
                  <button type="button" onClick={() => removeRecognition(rec)} className="material-symbols-outlined text-xs leading-none">close</button>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest font-bold">Related Skills</label>
            <div className="flex gap-2">
              <input 
                value={skillInput} 
                onChange={(e) => setSkillInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="e.g., Mathematics, Physics" 
                className="flex-1 bg-surface-container-lowest border border-outline-variant rounded p-3 font-body" 
              />
              <button type="button" onClick={addSkill} className="bg-primary text-on-primary px-4 rounded font-label font-bold uppercase tracking-widest text-[10px]">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.relatedSkills?.map((skill: string, i: number) => (
                <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="material-symbols-outlined text-xs leading-none">close</button>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest font-bold">More Details (Research, Clubs, etc.)</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body min-h-[100px]" />
          </div>
        </div>
      )}
    </BaseModal>
  );
};
