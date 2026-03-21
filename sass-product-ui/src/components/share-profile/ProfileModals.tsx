/**
 * @file ProfileModals.tsx
 * @description Collection of specialized modal components for editing different sections of a user profile.
 * Each modal handles its own local draft state updates and communicates back to the parent hook.
 */

import React, { useState } from 'react';
import EditModal from '../EditModal';
import { FormInput, FormSelect, FormTextarea } from './ProfileUI';
import type { 
  BasicDetails, Collaboration, Skill, SkillLevel, 
  Project, Experience, Education, Achievement 
} from '../../shared/model/profile';

// ─────────────────────────────────────────────────────────────
// COMPONENT 1 — BasicModal (Handles Name, Phone, Email, etc.)
// ─────────────────────────────────────────────────────────────
export const BasicModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: BasicDetails; setDraft: React.Dispatch<React.SetStateAction<BasicDetails | null>>;
}) => (
  // EditModal is the wrapper providing the Save/Cancel buttons and Title
  <EditModal title="Edit your basic details information." isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      {/* Individual Form Inputs update specific keys in the Draft state object */}
      <FormInput label="First Name" value={draft.firstName} placeholder="First name" onChange={v => setDraft(d => d ? { ...d, firstName: v } : d)} />
      <FormInput label="Last Name" value={draft.lastName} placeholder="Last name" onChange={v => setDraft(d => d ? { ...d, lastName: v } : d)} />
      <FormInput label="Phone Number" type="tel" value={draft.mobile} placeholder="Phone number" onChange={v => setDraft(d => d ? { ...d, mobile: v } : d)} />
      
      {/* FormSelect maps human-readable labels to Backend Enum values */}
      <FormSelect label="Dev Type" value={draft.devType} onChange={v => setDraft(d => d ? { ...d, devType: v } : d)} options={[{ label: 'Frontend Developer', value: 'FRONTEND_DEVELOPER' }, { label: 'Backend Developer', value: 'BACKEND_DEVELOPER' }, { label: 'Full Stack Developer', value: 'FULL_STACK_DEVELOPER' }]} />
      <FormInput label="Date of Birth" type="date" value={draft.dateOfBirth} onChange={v => setDraft(d => d ? { ...d, dateOfBirth: v } : d)} />
      <FormSelect label="Gender" value={draft.gender} onChange={v => setDraft(d => d ? { ...d, gender: v } : d)} options={[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }, { label: 'Other', value: 'OTHER' }]} />
      
      {/* Full-width inputs for Email and About Me */}
      <div className="col-span-2"><FormInput label="Email Address" type="email" value={draft.email} placeholder="email@example.com" onChange={v => setDraft(d => d ? { ...d, email: v } : d)} /></div>
      <div className="col-span-2"><FormTextarea label="About Me" value={draft.aboutMe} rows={3} placeholder="Tell us about yourself..." onChange={v => setDraft(d => d ? { ...d, aboutMe: v } : d)} /></div>
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 2 — CollaborateModal (Handles Work Preferences)
// ─────────────────────────────────────────────────────────────
export const CollaborateModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Collaboration; setDraft: React.Dispatch<React.SetStateAction<Collaboration | null>>;
}) => (
  <EditModal title="Edit your collaboration preferences." isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      {/* Pitch updates as a string */}
      <div className="col-span-2"><FormTextarea label="My Pitch" value={draft.pitch} rows={3} placeholder="What do you want to build? Who are you looking for?" onChange={v => setDraft(d => d ? { ...d, pitch: v } : d)} /></div>
      
      {/* Array Inputs: Converts a comma-separated string into a clean string array for the backend */}
      <FormInput label="Project Types (comma separated)" value={draft.projectTypes.join(', ')} placeholder="SaaS, Open Source, Mobile" onChange={v => setDraft(d => d ? { ...d, projectTypes: v.split(',').map(s => s.trim()).filter(Boolean) } : d)} />
      <FormInput label="Looking For (comma separated)" value={draft.lookingFor.join(', ')} placeholder="Co-founder, Designer, Backend Dev" onChange={v => setDraft(d => d ? { ...d, lookingFor: v.split(',').map(s => s.trim()).filter(Boolean) } : d)} />
      
      {/* Selection of Work Style and Timezone */}
      <FormSelect label="Availability" value={draft.availability} onChange={v => setDraft(d => d ? { ...d, availability: v } : d)} options={[{ label: 'Full-time', value: 'Full-time' }, { label: 'Part-time', value: 'Part-time' }, { label: 'Weekends', value: 'Weekends' }, { label: 'Flexible', value: 'Flexible' }]} />
      <FormSelect label="Work Style" value={draft.workStyle} onChange={v => setDraft(d => d ? { ...d, workStyle: v } : d)} options={[{ label: 'Remote', value: 'Remote' }, { label: 'Hybrid', value: 'Hybrid' }, { label: 'In-person', value: 'In-person' }]} />
      <FormInput label="Time Zone" value={draft.timezone} placeholder="e.g. IST (UTC+5:30)" onChange={v => setDraft(d => d ? { ...d, timezone: v } : d)} />
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 3 — SkillsModal (Handles Multi-skill Entry)
// ─────────────────────────────────────────────────────────────
export const SkillsModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Skill[]; setDraft: React.Dispatch<React.SetStateAction<Skill[] | null>>;
}) => {
  // Local state for the inputs before they are officially added to the list
  const[skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const[level, setLevel] = useState<SkillLevel>('Intermediate');

  // Hardcoded options for Skill Management
  const CATEGORIES =[
    { label: 'Language', value: 'Language' }, { label: 'Frontend', value: 'Frontend' }, { label: 'Backend', value: 'Backend' },
    { label: 'Database', value: 'Database' }, { label: 'Devops', value: 'Devops' }, { label: 'Tool', value: 'Tool' },
  ];
  const LEVELS =[
    { label: 'Expert', value: 'Expert' }, { label: 'Intermediate', value: 'Intermediate' }, { label: 'Beginner', value: 'Beginner' },
  ];

  /** Adds a skill from local input state into the draft array */
  const handleAddSkill = () => {
    if (!skillName.trim()) return;
    const newSkill: Skill = { id: Date.now().toString(), name: skillName.trim(), category, level: level as SkillLevel };
    setDraft(d => d ?[...d, newSkill] : [newSkill]);
    setSkillName(''); // Reset input field after adding
  };

  /** Removes a skill from the draft array before saving */
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
            <button type="button" onClick={handleAddSkill} disabled={!skillName.trim()} className="w-full py-2.5 bg-accent text-white font-semibold rounded-lg text-sm hover:bg-accent-hover disabled:opacity-50 transition-all shadow-accent">Add</button>
          </div>
        </div>
        
        {/* Visual feedback: Shows a list of skills that will be saved to the database */}
        {draft && draft.length > 0 && (
          <div className="flex flex-col gap-3 pt-5 border-t border-border">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Skills to save</p>
            <div className="flex flex-wrap gap-2">
              {draft.map((skill) => (
                <div key={skill.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${skill.level === 'Expert' ? 'bg-accent-tint text-accent border-accent-tint' : 'bg-raised text-secondary border-border'}`}>
                  <span>{skill.name}</span>
                  <span className="text-[10px] font-normal opacity-70">{skill.level.charAt(0)}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill.id)} className="ml-1 hover:text-red-500 transition-colors">✕</button>
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
// COMPONENT 4 — ProjectsModal (Handles Project Entry/Edit)
// ─────────────────────────────────────────────────────────────
export const ProjectsModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Project; setDraft: React.Dispatch<React.SetStateAction<Project | null>>;
}) => (
  // Title changes dynamically if 'name' exists (Edit mode vs Add mode)
  <EditModal title={draft.name ? "Edit Project" : "Add Project"} isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <FormInput label="Project Name" value={draft.name} placeholder="e.g. DevConnect" onChange={v => setDraft(d => d ? { ...d, name: v } : d)} />
      </div>
      <div className="col-span-2">
        <FormTextarea label="Description" value={draft.description} placeholder="What does this project do?" rows={2} onChange={v => setDraft(d => d ? { ...d, description: v } : d)} />
      </div>
      <div className="col-span-2">
        {/* Tech Stack is converted to array to maintain backend compatibility */}
        <FormInput label="Tech Stack (comma separated)" value={draft.techStack.join(', ')} placeholder="React, TypeScript, Node.js" onChange={v => setDraft(d => d ? { ...d, techStack: v.split(',').map(s => s.trim()).filter(Boolean) } : d)} />
      </div>
      <FormSelect label="Role" value={draft.role} onChange={v => setDraft(d => d ? { ...d, role: v as Project['role'] } : d)} options={[{ label: 'Solo', value: 'Solo' }, { label: 'Lead', value: 'Lead' }, { label: 'Contributor', value: 'Contributor' }]} />
      <FormSelect label="Status" value={draft.status} onChange={v => setDraft(d => d ? { ...d, status: v as Project['status'] } : d)} options={[{ label: 'In Progress', value: 'In Progress' }, { label: 'Live', value: 'Live' }, { label: 'Archived', value: 'Archived' }]} />
      <FormInput label="GitHub URL (optional)" value={draft.githubUrl || ''} placeholder="https://github.com/..." onChange={v => setDraft(d => d ? { ...d, githubUrl: v } : d)} />
      <FormInput label="Live URL (optional)" value={draft.liveUrl || ''} placeholder="https://..." onChange={v => setDraft(d => d ? { ...d, liveUrl: v } : d)} />
      <div className="col-span-2">
        <FormInput label="Looking For (comma separated, optional)" value={draft.lookingFor.join(', ')} placeholder="Backend Dev, Designer" onChange={v => setDraft(d => d ? { ...d, lookingFor: v.split(',').map(s => s.trim()).filter(Boolean) } : d)} />
      </div>
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 5 — ExperienceModal (Work History Entry/Edit)
// ─────────────────────────────────────────────────────────────
export const ExperienceModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Experience; setDraft: React.Dispatch<React.SetStateAction<Experience | null>>;
}) => (
  <EditModal title={draft.company ? "Edit Experience" : "Add Experience"} isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      <FormInput label="Company Name" value={draft.company} placeholder="e.g. TechCorp" onChange={v => setDraft(d => d ? { ...d, company: v } : d)} />
      <FormInput label="Job Title / Role" value={draft.role} placeholder="e.g. Frontend Developer" onChange={v => setDraft(d => d ? { ...d, role: v } : d)} />
      <div className="col-span-2">
        <FormSelect label="Employment Type" value={draft.type} onChange={v => setDraft(d => d ? { ...d, type: v } : d)} options={[
          { label: 'Full-time', value: 'Full-time' }, { label: 'Part-time', value: 'Part-time' }, 
          { label: 'Internship', value: 'Internship' }, { label: 'Freelance', value: 'Freelance' }, { label: 'Contract', value: 'Contract' }
        ]} />
      </div>
      <FormInput label="Start Date" value={draft.startDate} placeholder="e.g. Jan 2023" onChange={v => setDraft(d => d ? { ...d, startDate: v } : d)} />
      <FormInput label="End Date" value={draft.endDate} placeholder="e.g. Present, or Dec 2023" onChange={v => setDraft(d => d ? { ...d, endDate: v } : d)} />
      <div className="col-span-2">
        <FormTextarea label="Description" value={draft.description} placeholder="What did you do? What were your achievements?" rows={3} onChange={v => setDraft(d => d ? { ...d, description: v } : d)} />
      </div>
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 6 — EducationModal (Academic Entry/Edit)
// ─────────────────────────────────────────────────────────────
export const EducationModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Education; setDraft: React.Dispatch<React.SetStateAction<Education | null>>;
}) => (
  <EditModal title={draft.institution ? "Edit Education" : "Add Education"} isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <FormInput label="Institution / School" value={draft.institution} placeholder="e.g. KIIT University" onChange={v => setDraft(d => d ? { ...d, institution: v } : d)} />
      </div>
      <FormInput label="Degree / Certificate" value={draft.degree} placeholder="e.g. B.Tech Computer Science" onChange={v => setDraft(d => d ? { ...d, degree: v } : d)} />
      <FormSelect label="Type" value={draft.type} onChange={v => setDraft(d => d ? { ...d, type: v } : d)} options={[
        { label: 'Degree', value: 'Degree' }, { label: 'Certification', value: 'Certification' }, 
        { label: 'Bootcamp', value: 'Bootcamp' }, { label: 'Course', value: 'Course' }
      ]} />
      <FormInput label="Start Year" value={draft.startYear} placeholder="e.g. 2020" onChange={v => setDraft(d => d ? { ...d, startYear: v } : d)} />
      <FormInput label="End Year" value={draft.endYear} placeholder="e.g. 2024" onChange={v => setDraft(d => d ? { ...d, endYear: v } : d)} />
      <div className="col-span-2">
        <FormInput label="Link (optional)" value={draft.link || ''} placeholder="https://..." onChange={v => setDraft(d => d ? { ...d, link: v } : d)} />
      </div>
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 7 — AchievementsModal (Awards Entry/Edit)
// ─────────────────────────────────────────────────────────────
export const AchievementsModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Achievement; setDraft: React.Dispatch<React.SetStateAction<Achievement | null>>;
}) => (
  <EditModal title={draft.title ? "Edit Achievement" : "Add Achievement"} isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <FormInput label="Title" value={draft.title} placeholder="e.g. HackIndia 2023 — 2nd Place" onChange={v => setDraft(d => d ? { ...d, title: v } : d)} />
      </div>
      <FormSelect label="Type" value={draft.type} onChange={v => setDraft(d => d ? { ...d, type: v } : d)} options={[
        { label: 'Hackathon', value: 'Hackathon' }, { label: 'Open Source', value: 'Open Source' }, 
        { label: 'Award', value: 'Award' }, { label: 'Publication', value: 'Publication' }
      ]} />
      <FormInput label="Date" value={draft.date} placeholder="e.g. 15 August 2023" onChange={v => setDraft(d => d ? { ...d, date: v } : d)} />
      <div className="col-span-2">
        <FormTextarea label="Description" value={draft.description} placeholder="Describe what you achieved..." rows={3} onChange={v => setDraft(d => d ? { ...d, description: v } : d)} />
      </div>
      <div className="col-span-2">
        <FormInput label="Link (optional)" value={draft.link || ''} placeholder="https://..." onChange={v => setDraft(d => d ? { ...d, link: v } : d)} />
      </div>
    </div>
  </EditModal>
);