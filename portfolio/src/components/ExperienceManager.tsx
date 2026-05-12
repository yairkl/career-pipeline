import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { usePortfolioData } from '../hooks/usePortfolioData';
import type { Employment } from '../hooks/usePortfolioData';
import { PortfolioItemModal } from './PortfolioItemModal';

export const ExperienceManager: React.FC = () => {
  const { profile } = usePortfolioData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Employment> | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const list = profile?.employment || [];

  const handleAdd = () => {
    setEditingItem({});
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Employment, index: number) => {
    setEditingItem(item);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm('Remove this experience entry?')) return;
    const newList = [...list];
    newList.splice(index, 1);
    await updateDoc(doc(db, "profile", "main"), { employment: newList });
  };

  const handleSave = async (item: Employment) => {
    const newList = [...list];
    if (editingIndex !== null) {
      newList[editingIndex] = item;
    } else {
      newList.push(item);
    }
    await updateDoc(doc(db, "profile", "main"), { employment: newList });
    setIsModalOpen(false);
  };

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <div>
          <h2 className="text-xl font-display">Professional Journey</h2>
          <p className="text-on-surface-variant text-sm font-body">Manage your employment history and roles.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary text-on-primary px-6 py-3 rounded-default font-label font-bold uppercase tracking-widest text-xs shadow-soft"
        >
          Add Experience
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-body">
          <thead className="bg-surface-container-high font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            <tr>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Period</th>
              <th className="px-6 py-4">Skills</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant italic">No experience entries found.</td>
              </tr>
            ) : list.map((item, i) => (
              <tr key={i} className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4 font-bold">{item.role}</td>
                <td className="px-6 py-4 text-sm">{item.company}</td>
                <td className="px-6 py-4 text-sm">{item.startDate} – {item.endDate || 'Present'}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {item.relatedSkills?.map((s, idx) => (
                      <span key={idx} className="text-[8px] bg-surface-container px-2 py-0.5 rounded border border-outline-variant uppercase">{s}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button onClick={() => handleEdit(item, i)} className="text-primary hover:underline text-xs font-bold uppercase tracking-widest">Edit</button>
                  <button onClick={() => handleDelete(i)} className="text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <PortfolioItemModal 
          type="employment"
          item={editingItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
