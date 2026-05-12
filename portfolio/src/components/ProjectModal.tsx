import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Project } from '../hooks/usePortfolioData';
import { BaseModal } from './BaseModal';

interface ProjectModalProps {
  project: Partial<Project> | null;
  onClose: () => void;
}

const ICON_OPTIONS = [
  { name: 'code', label: 'Software Development' },
  { name: 'database', label: 'Backend / Data' },
  { name: 'brush', label: 'Design / Frontend' },
  { name: 'terminal', label: 'CLI / DevOps' },
  { name: 'public', label: 'Web / Networking' },
  { name: 'smartphone', label: 'Mobile Apps' },
  { name: 'monitoring', label: 'Analytics / Metrics' },
  { name: 'security', label: 'Cybersecurity' },
  { name: 'memory', label: 'Hardware / AI' },
  { name: 'language', label: 'AI / LLM / NLP' },
  { name: 'view_in_ar', label: '3D / AR / VR' },
  { name: 'rocket_launch', label: 'Innovation / Launch' },
  { name: 'cloud', label: 'Cloud Services' },
  { name: 'api', label: 'API / Integration' },
  { name: 'shield', label: 'Security / Privacy' },
  { name: 'bolt', label: 'Performance / Speed' }
];

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: '',
    status: 'Draft',
    icon: 'code',
    image: '',
    githubLink: '',
    projectLink: '',
    relatedSkills: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        relatedSkills: project.relatedSkills || [],
        icon: project.icon || 'code'
      });
    }
  }, [project]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, image: downloadURL }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Make sure Firebase Storage is enabled and rules allow uploads.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...formData,
        updatedAt: Timestamp.now()
      };

      if (project?.id) {
        await updateDoc(doc(db, "projects", project.id), data);
      } else {
        await addDoc(collection(db, "projects"), data);
      }
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const newSkills = skillInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '' && !formData.relatedSkills?.includes(s));
      
      if (newSkills.length > 0) {
        setFormData(prev => ({
          ...prev,
          relatedSkills: [...(prev.relatedSkills || []), ...newSkills]
        }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      relatedSkills: prev.relatedSkills?.filter(s => s !== skill)
    }));
  };

  return (
    <BaseModal
      title={project?.id ? 'Edit Project' : 'Add New Project'}
      onClose={onClose}
      onSubmit={handleSubmit}
      saving={saving || uploading}
      saveButtonText="Save Project"
      formId="project-form"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-label text-xs uppercase tracking-widest font-bold">Project Title</label>
          <input 
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="font-label text-xs uppercase tracking-widest font-bold">Category</label>
          <input 
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-label text-xs uppercase tracking-widest font-bold">Description</label>
        <textarea 
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body min-h-[120px]"
          required
        />
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <label className="font-label text-xs uppercase tracking-widest font-bold">Project Image</label>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-full sm:w-48 aspect-video bg-surface-container rounded-xl border border-outline-variant overflow-hidden flex items-center justify-center group relative shadow-inner">
            {formData.image ? (
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-outline-variant">image</span>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-surface-container/80 backdrop-blur-sm flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
              ref={fileInputRef}
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-surface-container-high border border-outline-variant px-6 py-3 rounded-xl font-label font-bold uppercase tracking-widest text-[10px] hover:bg-primary hover:text-on-primary transition-all shadow-sm"
            >
              {formData.image ? 'Change Image' : 'Upload Image'}
            </button>
            <p className="text-[10px] text-on-surface-variant italic opacity-70">Recommended size: 16:9 ratio. Max 5MB.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-label text-xs uppercase tracking-widest font-bold">GitHub Repository URL</label>
          <input 
            name="githubLink"
            value={formData.githubLink || ''}
            onChange={handleChange}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body"
            placeholder="https://github.com/user/repo"
          />
        </div>
        <div className="space-y-2">
          <label className="font-label text-xs uppercase tracking-widest font-bold">Live Project URL</label>
          <input 
            name="projectLink"
            value={formData.projectLink || ''}
            onChange={handleChange}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body"
            placeholder="https://myproject.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-label text-xs uppercase tracking-widest font-bold">Related Skills</label>
        <div className="flex gap-2">
          <input 
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            className="flex-1 bg-surface-container-lowest border border-outline-variant rounded p-3 font-body"
            placeholder="Add skills (e.g. React, Node.js)"
          />
          <button 
            type="button" 
            onClick={addSkill}
            className="bg-primary text-on-primary px-4 rounded font-label font-bold uppercase tracking-widest text-[10px]"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.relatedSkills?.map((skill, i) => (
            <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="material-symbols-outlined text-[10px] leading-none">close</button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-label text-xs uppercase tracking-widest font-bold">Project Icon</label>
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-xl border border-outline-variant text-primary shadow-inner">
              <span className="material-symbols-outlined text-2xl">{formData.icon}</span>
            </div>
            <select 
              name="icon"
              value={formData.icon || 'code'}
              onChange={handleChange}
              className="flex-1 bg-surface-container-lowest border border-outline-variant rounded p-3 font-body"
            >
              {ICON_OPTIONS.map(opt => (
                <option key={opt.name} value={opt.name}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="font-label text-xs uppercase tracking-widest font-bold">Status</label>
          <select 
            name="status"
            value={formData.status || 'Draft'}
            onChange={handleChange}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </div>
    </BaseModal>
  );
};
