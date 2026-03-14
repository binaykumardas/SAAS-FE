// src/components/EditModal.tsx
// Generic reusable modal — works for Basic, Personal, Family tabs
// Pass any form fields as children

import { useEffect, type ReactNode } from 'react';

interface EditModalProps {
  title:    string;           // e.g. "Edit your basic details information."
  isOpen:   boolean;          // controls visibility
  onClose:  () => void;       // cancel / close handler
  onSave:   () => void;       // save handler
  children: ReactNode;        // form fields go here
  saving?:  boolean;          // optional loading state on Save button
}

const EditModal = ({
  title,
  isOpen,
  onClose,
  onSave,
  children,
  saving = false,
}: EditModalProps) => {

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-text/20 dark:bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal panel — stop click propagation so it doesn't close */}
      <div
        className="w-full max-w-2xl bg-surface border border-border
          rounded-2xl shadow-card overflow-hidden
          animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <h2 className="text-base font-bold text-text tracking-tight">
            {title}
          </h2>
          {/* Close X button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center
              text-muted hover:text-text hover:bg-raised
              transition-all duration-150"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border mx-6 mt-4" />

        {/* ── Form Content ── */}
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
          {children}
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border mx-6" />

        {/* ── Footer Actions ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold
              bg-raised hover:bg-border border border-border
              text-secondary hover:text-text
              transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold
              bg-accent hover:bg-accent-hover text-white
              shadow-accent transition-all duration-150
              disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center gap-2"
          >
            {saving && (
              <svg className="animate-spin" width="14" height="14"
                fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditModal;