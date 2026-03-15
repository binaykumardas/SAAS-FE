/**
 * @file ProfileModals.tsx
 * @location src/components/share-profile/ProfileModals.tsx
 *
 * @description
 * Contains all edit/add modal components for the Profile page.
 * Every modal in this file uses the shared `EditModal` wrapper component.
 */

import React, { useState } from 'react';
import EditModal from '../EditModal';
import { FormInput, FormSelect, FormTextarea } from './ProfileUI';
// ✅ Added 'Project' to the type imports
import type { BasicDetails, Collaboration, TabKey, Skill, SkillLevel, Project } from '../../shared/model/profile';

// ─────────────────────────────────────────────────────────────
// COMPONENT 1 — BasicModal
// ─────────────────────────────────────────────────────────────
export const BasicModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen:   boolean;
  onClose:  () => void;
  onSave:   () => void;
  saving?:  boolean;
  draft:    BasicDetails;
  setDraft: React.Dispatch<React.SetStateAction<BasicDetails | null>>;
}) => (
  <EditModal title="Edit your basic details information." isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      <FormInput label="First Name" value={draft.firstName} placeholder="First name" onChange={v => setDraft(d => d ? { ...d, firstName: v } : d)} />
      <FormInput label="Last Name" value={draft.lastName} placeholder="Last name" onChange={v => setDraft(d => d ? { ...d, lastName: v } : d)} />
      <FormInput label="Phone Number" type="tel" value={draft.mobile} placeholder="Phone number" onChange={v => setDraft(d => d ? { ...d, mobile: v } : d)} />
      <FormSelect label="Dev Type" value={draft.devType} onChange={v => setDraft(d => d ? { ...d, devType: v } : d)} options={[{ label: 'Frontend Developer', value: 'FRONTEND_DEVELOPER' }, { label: 'Backend Developer', value: 'BACKEND_DEVELOPER' }, { label: 'Full Stack Developer', value: 'FULL_STACK_DEVELOPER' }]} />
      <FormInput label="Date of Birth" type="date" value={draft.dateOfBirth} onChange={v => setDraft(d => d ? { ...d, dateOfBirth: v } : d)} />
      <FormSelect label="Gender" value={draft.gender} onChange={v => setDraft(d => d ? { ...d, gender: v } : d)} options={[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }, { label: 'Other', value: 'OTHER' }]} />
      <div className="col-span-2"><FormInput label="Email Address" type="email" value={draft.email} placeholder="email@example.com" onChange={v => setDraft(d => d ? { ...d, email: v } : d)} /></div>
      <div className="col-span-2"><FormTextarea label="About Me" value={draft.aboutMe} rows={3} placeholder="Tell us about yourself..." onChange={v => setDraft(d => d ? { ...d, aboutMe: v } : d)} /></div>
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 2 — CollaborateModal
// ─────────────────────────────────────────────────────────────
export const CollaborateModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen:   boolean;
  onClose:  () => void;
  onSave:   () => void;
  saving?:  boolean;
  draft:    Collaboration;
  setDraft: React.Dispatch<React.SetStateAction<Collaboration | null>>;
}) => (
  <EditModal title="Edit your collaboration preferences." isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2"><FormTextarea label="My Pitch" value={draft.pitch} rows={3} placeholder="What do you want to build? Who are you looking for?" onChange={v => setDraft(d => d ? { ...d, pitch: v } : d)} /></div>
      <FormInput label="Project Types (comma separated)" value={draft.projectTypes.join(', ')} placeholder="SaaS, Open Source, Mobile" onChange={v => setDraft(d => d ? { ...d, projectTypes: v.split(',').map(s => s.trim()).filter(Boolean) } : d)} />
      <FormInput label="Looking For (comma separated)" value={draft.lookingFor.join(', ')} placeholder="Co-founder, Designer, Backend Dev" onChange={v => setDraft(d => d ? { ...d, lookingFor: v.split(',').map(s => s.trim()).filter(Boolean) } : d)} />
      <FormSelect label="Availability" value={draft.availability} onChange={v => setDraft(d => d ? { ...d, availability: v } : d)} options={[{ label: 'Full-time', value: 'Full-time' }, { label: 'Part-time', value: 'Part-time' }, { label: 'Weekends', value: 'Weekends' }, { label: 'Flexible', value: 'Flexible' }]} />
      <FormSelect label="Work Style" value={draft.workStyle} onChange={v => setDraft(d => d ? { ...d, workStyle: v } : d)} options={[{ label: 'Remote', value: 'Remote' }, { label: 'Hybrid', value: 'Hybrid' }, { label: 'In-person', value: 'In-person' }]} />
      <FormInput label="Time Zone" value={draft.timezone} placeholder="e.g. IST (UTC+5:30)" onChange={v => setDraft(d => d ? { ...d, timezone: v } : d)} />
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 3 — SkillsModal
// ─────────────────────────────────────────────────────────────
export const SkillsModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen:   boolean;
  onClose:  () => void;
  onSave:   () => void;
  saving?:  boolean;
  draft:    Skill[]; 
  setDraft: React.Dispatch<React.SetStateAction<Skill[] | null>>; 
}) => {
  const[skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [level, setLevel] = useState<SkillLevel>('Intermediate');

  const CATEGORIES =[
    { label: 'Language', value: 'Language' }, { label: 'Frontend', value: 'Frontend' }, { label: 'Backend',  value: 'Backend' },
    { label: 'Database', value: 'Database' }, { label: 'Devops',   value: 'Devops' }, { label: 'Tool',     value: 'Tool' },
  ];
  const LEVELS =[
    { label: 'Expert', value: 'Expert' }, { label: 'Intermediate', value: 'Intermediate' }, { label: 'Beginner', value: 'Beginner' },
  ];

  const handleAddSkill = () => {
    if (!skillName.trim()) return;
    const newSkill: Skill = { id: Date.now().toString(), name: skillName.trim(), category, level: level as SkillLevel };
    setDraft(d => d ? [...d, newSkill] : [newSkill]);
    setSkillName('');
  };

  const handleRemoveSkill = (idToRemove: string) => {
    setDraft(d => d ? d.filter(s => s.id !== idToRemove) : d);
  };

  return (
    <EditModal title="Add Skills & Technologies" isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4"><FormSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES} /></div>
          <div className="md:col-span-4"><FormInput label="Skill Name" value={skillName} onChange={setSkillName} placeholder="e.g., React, Python" /></div>
          <div className="md:col-span-3"><FormSelect label="Proficiency" value={level} onChange={v => setLevel(v as SkillLevel)} options={LEVELS} /></div>
          <div className="md:col-span-1 flex flex-col justify-end">
            <button type="button" onClick={handleAddSkill} disabled={!skillName.trim()} className="w-full py-2.5 bg-accent text-white font-semibold rounded-lg text-sm hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-accent">Add</button>
          </div>
        </div>
        {draft && draft.length > 0 && (
          <div className="flex flex-col gap-3 pt-5 border-t border-border">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Skills to save</p>
            <div className="flex flex-wrap gap-2">
              {draft.map((skill) => (
                <div key={skill.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${skill.level === 'Expert' ? 'bg-accent-tint text-accent border-accent-tint' : 'bg-raised text-secondary border-border'}`}>
                  <span>{skill.name}</span><span className="text-[10px] font-normal opacity-70">{skill.level.charAt(0)}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill.id)} className="ml-1 hover:text-red-500 opacity-70 hover:opacity-100 transition-colors">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </EditModal>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPONENT 4 — ProjectsModal (NEW)
// ─────────────────────────────────────────────────────────────
export const ProjectsModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen:   boolean;
  onClose:  () => void;
  onSave:   () => void;
  saving?:  boolean;
  draft:    Project; // Draft is a single project
  setDraft: React.Dispatch<React.SetStateAction<Project | null>>;
}) => (
  <EditModal title="Add Project" isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <FormInput label="Project Name" value={draft.name} placeholder="e.g. DevConnect" onChange={v => setDraft(d => d ? { ...d, name: v } : d)} />
      </div>
      <div className="col-span-2">
        <FormTextarea label="Description" value={draft.description} placeholder="What does this project do?" rows={2} onChange={v => setDraft(d => d ? { ...d, description: v } : d)} />
      </div>
      <div className="col-span-2">
        <FormInput label="Tech Stack (comma separated)" value={draft.techStack.join(', ')} placeholder="React, TypeScript, Node.js" onChange={v => setDraft(d => d ? { ...d, techStack: v.split(',').map(s => s.trim()).filter(Boolean) } : d)} />
      </div>
      <FormSelect
        label="Role"
        value={draft.role}
        onChange={v => setDraft(d => d ? { ...d, role: v as Project['role'] } : d)}
        options={[{ label: 'Solo', value: 'Solo' }, { label: 'Lead', value: 'Lead' }, { label: 'Contributor', value: 'Contributor' }]}
      />
      <FormSelect
        label="Status"
        value={draft.status}
        onChange={v => setDraft(d => d ? { ...d, status: v as Project['status'] } : d)}
        options={[{ label: 'In Progress', value: 'In Progress' }, { label: 'Live', value: 'Live' }, { label: 'Archived', value: 'Archived' }]}
      />
      <FormInput label="GitHub URL (optional)" value={draft.githubUrl || ''} placeholder="https://github.com/..." onChange={v => setDraft(d => d ? { ...d, githubUrl: v } : d)} />
      <FormInput label="Live URL (optional)" value={draft.liveUrl || ''} placeholder="https://..." onChange={v => setDraft(d => d ? { ...d, liveUrl: v } : d)} />
      <div className="col-span-2">
        <FormInput label="Looking For (comma separated, optional)" value={draft.lookingFor.join(', ')} placeholder="Backend Dev, Designer" onChange={v => setDraft(d => d ? { ...d, lookingFor: v.split(',').map(s => s.trim()).filter(Boolean) } : d)} />
      </div>
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 5 — ComingSoonModal
// ─────────────────────────────────────────────────────────────
export const ComingSoonModal = ({
  editModal, onClose,
}: {
  editModal: TabKey | null; onClose: () => void;
}) => {
  // ✅ Removed 'projects' and 'skills' from here
  const keys: TabKey[] =['experience', 'education', 'achievements'];

  return (
    <>
      {keys.map(key => (
        <EditModal key={key} title={`Add ${key.charAt(0).toUpperCase() + key.slice(1)}`} isOpen={editModal === key} onClose={onClose} onSave={onClose}>
          <p className="text-sm text-secondary py-6 text-center">Full {key} form — connect your API and build the form here.</p>
        </EditModal>
      ))}
    </>
  );
};