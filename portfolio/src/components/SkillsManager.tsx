import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { usePortfolioData } from '../hooks/usePortfolioData';
import type { Skill } from '../hooks/usePortfolioData';
import { PortfolioItemModal } from './PortfolioItemModal';
import { GripVertical } from 'lucide-react';
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

const SortableSkillRow = ({ item, index, onEdit, onDelete }: { item: Skill, index: number, onEdit: (i: Skill, idx: number) => void, onDelete: (idx: number) => void }) => {
  const id = item.name;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className={`hover:bg-surface-container transition-colors ${isDragging ? 'bg-surface-variant/50 relative' : ''}`}>
      <td className="px-4 py-4 w-10">
        <button {...attributes} {...listeners} className="cursor-grab text-on-surface-variant opacity-50 hover:opacity-100 p-2">
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      <td className="px-6 py-4 font-bold">{item.name}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 bg-outline-variant rounded-full max-w-[100px]">
            <div className="h-full bg-primary" style={{ width: `${item.level}%` }}></div>
          </div>
          <span className="text-xs font-label">{item.level}%</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right space-x-4">
        <button onClick={() => onEdit(item, index)} className="text-primary hover:underline text-xs font-bold uppercase tracking-widest">Edit</button>
        <button onClick={() => onDelete(index)} className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </td>
    </tr>
  );
};

export const SkillsManager: React.FC = () => {
  const { profile } = usePortfolioData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Skill> | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const list = profile?.skills || [];

  const handleAdd = () => {
    setEditingItem({ name: '', level: 80 });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Skill, index: number) => {
    setEditingItem(item);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm('Remove this skill?')) return;
    const newList = [...list];
    newList.splice(index, 1);
    await updateDoc(doc(db, "profile", "main"), { skills: newList });
  };

  const handleSave = async (item: Skill) => {
    const newList = [...list];
    if (editingIndex !== null) {
      newList[editingIndex] = item;
    } else {
      newList.push({ ...item, order: list.length });
    }
    await updateDoc(doc(db, "profile", "main"), { skills: newList });
    setIsModalOpen(false);
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
      const oldIndex = list.findIndex((item) => item.name === active.id);
      const newIndex = list.findIndex((item) => item.name === over.id);
      const newList = arrayMove(list, oldIndex, newIndex);
      
      const updatedList = newList.map((item, index) => ({
        ...item,
        order: index
      }));
      
      try {
        await updateDoc(doc(db, "profile", "main"), { skills: updatedList });
      } catch (err) {
        console.error("Error updating skills order:", err);
      }
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <div>
          <h2 className="text-xl font-display">Technical Expertise</h2>
          <p className="text-on-surface-variant text-sm font-body">Manage your technical skills and proficiency levels.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary text-on-primary px-6 py-3 rounded-default font-label font-bold uppercase tracking-widest text-xs shadow-soft"
        >
          Add Skill
        </button>
      </div>

      <div className="overflow-x-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="w-full text-left font-body">
            <thead className="bg-surface-container-high font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              <tr>
                <th className="px-4 py-4 w-10"></th>
                <th className="px-6 py-4">Skill Name</th>
                <th className="px-6 py-4">Proficiency</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant italic">No skills found.</td>
                </tr>
              ) : (
                <SortableContext items={list.map(s => s.name)} strategy={verticalListSortingStrategy}>
                  {list.map((item, i) => (
                    <SortableSkillRow 
                      key={item.name} 
                      item={item} 
                      index={i} 
                      onEdit={handleEdit} 
                      onDelete={handleDelete} 
                    />
                  ))}
                </SortableContext>
              )}
            </tbody>
          </table>
        </DndContext>
      </div>

      {isModalOpen && (
        <PortfolioItemModal 
          type="skill"
          item={editingItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
