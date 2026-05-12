import React from 'react';

interface BaseModalProps {
  title: string;
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  saving?: boolean;
  saveButtonText?: string;
  children: React.ReactNode;
  formId?: string;
  maxWidthClass?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  title,
  isOpen = true,
  onClose,
  onSubmit,
  saving = false,
  saveButtonText = 'Save',
  children,
  formId,
  maxWidthClass = 'max-w-3xl'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className={`bg-surface-container-low border border-outline-variant rounded-xl shadow-2xl w-full flex flex-col max-h-[90vh] overflow-hidden ${maxWidthClass}`}>
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low sticky top-0 z-30">
          <h2 className="text-xl font-display font-bold">{title}</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden" id={formId}>
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {children}
          </div>

          <div className="p-6 border-t border-outline-variant flex justify-end gap-4 bg-surface-container-low sticky bottom-0 z-30 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.5)]">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-label text-xs font-bold uppercase tracking-widest border border-outline-variant hover:bg-surface-container-high transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="bg-primary text-on-primary px-8 py-3 rounded-xl font-label text-xs font-bold uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {saving ? 'Saving...' : saveButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
