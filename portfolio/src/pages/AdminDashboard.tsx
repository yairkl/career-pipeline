import React, { useState } from 'react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import type { Project } from '../hooks/usePortfolioData';

import { ProjectModal } from '../components/ProjectModal';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { SkillsManager } from '../components/SkillsManager';
import { ExperienceManager } from '../components/ExperienceManager';
import { EducationManager } from '../components/EducationManager';
import { ProfileSettings } from '../components/ProfileSettings';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, CheckCircle2, Clock, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updateDoc } from 'firebase/firestore';

interface AdminDashboardProps {
  activeTab: 'projects' | 'skills' | 'experience' | 'education' | 'profile';
}

const SortableProjectRow = ({ project, onEdit, onDelete }: { project: Project, onEdit: (p: Project) => void, onDelete: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className={`hover:bg-surface-variant/30 transition-colors group ${isDragging ? 'bg-surface-variant/50 relative' : ''}`}>
      <td className="px-4 py-6 w-10">
        <button {...attributes} {...listeners} className="cursor-grab text-on-surface-variant opacity-50 hover:opacity-100 p-2">
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      <td className="px-8 py-6">
        <span className="font-bold text-lg block group-hover:text-primary transition-colors">{project.title}</span>
      </td>
      <td className="px-8 py-6">
        <span className="text-sm font-medium bg-surface-variant px-3 py-1 rounded-full border border-outline-variant">{project.category}</span>
      </td>
      <td className="px-8 py-6">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
          project.status === 'Published' 
            ? 'bg-green-500/10 text-green-600 border-green-500/20' 
            : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
        }`}>
          {project.status}
        </span>
      </td>
      <td className="px-8 py-6 text-right">
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => onEdit(project)}
            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors border border-transparent hover:border-primary/20"
            title="Edit Entry"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(project.id)}
            className="p-2 hover:bg-red-500/10 text-on-surface-variant hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
            title="Delete Entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const { projects, loading } = usePortfolioData();
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProject = () => {
    setEditingProject({});
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, "projects", id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((item) => item.id === active.id);
      const newIndex = projects.findIndex((item) => item.id === over.id);
      const newProjects = arrayMove(projects, oldIndex, newIndex);
      
      const updates = newProjects.map((proj, index) => {
        if (proj.order !== index) {
          return updateDoc(doc(db, "projects", proj.id), { order: index });
        }
        return null;
      }).filter(Boolean);
      
      try {
        await Promise.all(updates);
      } catch (err) {
        console.error("Error updating project order:", err);
      }
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-10"
        >
          {activeTab === 'projects' && (
            <div className="space-y-10">
              {/* Project Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Total Projects', value: projects.length, icon: CheckCircle2 },
                  { label: 'Published', value: projects.filter(p => p.status === 'Published').length, icon: CheckCircle2 },
                  { label: 'Drafts', value: projects.filter(p => p.status === 'Draft').length, icon: Clock },
                ].map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={stat.label}
                    className="bg-surface p-8 rounded-2xl border border-outline-variant shadow-soft flex items-center justify-between group hover:border-primary transition-colors"
                  >
                    <div>
                      <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-bold">{stat.label}</p>
                      <p className="text-5xl font-display font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className="w-10 h-10 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
                  </motion.div>
                ))}
              </div>

              {/* Projects Table */}
              <div className="bg-surface rounded-2xl border border-outline-variant shadow-soft overflow-hidden">
                <div className="p-8 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-surface-variant/30">
                  <div>
                    <h2 className="text-2xl font-display font-bold">Project Archive</h2>
                    <p className="text-on-surface-variant text-sm mt-1">Manage your curated list of works and case studies.</p>
                  </div>
                  <button 
                    onClick={handleAddProject}
                    className="flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-xl font-label font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    New Entry
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <table className="w-full text-left font-body">
                      <thead className="bg-surface-variant/50 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                        <tr>
                          <th className="px-4 py-5 w-10"></th>
                          <th className="px-8 py-5">Project Identification</th>
                          <th className="px-8 py-5">Taxonomy</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {loading ? (
                          <tr>
                            <td colSpan={5} className="px-8 py-20 text-center">
                              <div className="flex flex-col items-center gap-4">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <span className="text-on-surface-variant italic font-display">Accessing records...</span>
                              </div>
                            </td>
                          </tr>
                        ) : projects.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-8 py-20 text-center text-on-surface-variant italic font-display">No entries currently cataloged.</td>
                          </tr>
                        ) : (
                          <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                            {projects.map((project) => (
                              <SortableProjectRow 
                                key={project.id} 
                                project={project} 
                                onEdit={handleEditProject} 
                                onDelete={handleDeleteProject} 
                              />
                            ))}
                          </SortableContext>
                        )}
                      </tbody>
                    </table>
                  </DndContext>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && <SkillsManager />}
          {activeTab === 'experience' && <ExperienceManager />}
          {activeTab === 'education' && <EducationManager />}
          {activeTab === 'profile' && <ProfileSettings />}
        </motion.div>
      </AnimatePresence>

      {isModalOpen && (
        <ProjectModal 
          project={editingProject} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};


