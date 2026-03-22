/**
 * @file ProfileModals.tsx
 * @location src/components/share-profile/ProfileModals.tsx
 * 
 * @description 
 * A collection of Modal components used to edit different sections of the user profile.
 * These modals implement the "Draft Pattern": they work on a local copy of data,
 * allowing users to cancel changes without affecting the main profile state.
 */

import React, { useState } from 'react';
import EditModal from '../EditModal';
import { FormInput, FormSelect, FormTextarea } from './ProfileUI';
import type { 
  BasicDetails, Collaboration, Skill, SkillLevel, 
  Project, Experience, Education, Achievement 
} from '../../shared/model/profile';
import { SKILL_CATEGORIES } from '../../shared/constant/categories';

// ─────────────────────────────────────────────────────────────
// COMPONENT 1 — BasicModal
// Handles: Name, Phone, Email, Dev Type, DOB, Gender, and Bio.
// ─────────────────────────────────────────────────────────────
export const BasicModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: BasicDetails; setDraft: React.Dispatch<React.SetStateAction<BasicDetails | null>>;
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
// Handles: Pitch, Project Types, Looking For, and Availability.
// ─────────────────────────────────────────────────────────────
export const CollaborateModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Collaboration; setDraft: React.Dispatch<React.SetStateAction<Collaboration | null>>;
}) => (
  <EditModal title="Edit your collaboration preferences." isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2"><FormTextarea label="My Pitch" value={draft.pitch} rows={3} placeholder="What do you want to build?" onChange={v => setDraft(d => d ? { ...d, pitch: v } : d)} /></div>
      
      {/* Logic: Converts comma-separated string input back into an array for the state */}
      <FormInput label="Project Types (comma separated)" value={draft.projectTypes.join(', ')} placeholder="SaaS, Open Source" onChange={v => setDraft(d => d ? { ...d, projectTypes: v.split(',').map(s => s.trim()).filter(Boolean) } : d)} />
      <FormInput label="Looking For (comma separated)" value={draft.lookingFor.join(', ')} placeholder="Designer, Backend" onChange={v => setDraft(d => d ? { ...d, lookingFor: v.split(',').map(s => s.trim()).filter(Boolean) } : d)} />
      
      <FormSelect label="Availability" value={draft.availability} onChange={v => setDraft(d => d ? { ...d, availability: v } : d)} options={[{ label: 'Full-time', value: 'Full-time' }, { label: 'Part-time', value: 'Part-time' }, { label: 'Weekends', value: 'Weekends' }, { label: 'Flexible', value: 'Flexible' }]} />
      <FormSelect label="Work Style" value={draft.workStyle} onChange={v => setDraft(d => d ? { ...d, workStyle: v } : d)} options={[{ label: 'Remote', value: 'Remote' }, { label: 'Hybrid', value: 'Hybrid' }, { label: 'In-person', value: 'In-person' }]} />
      <FormInput label="Time Zone" value={draft.timezone} placeholder="e.g. IST (UTC+5:30)" onChange={v => setDraft(d => d ? { ...d, timezone: v } : d)} />
    </div>
  </EditModal>
);

/**
 * COMPONENT: SkillsModal
 * Allows users to add multiple skills to a list and remove them before saving.
 */
export const SkillsModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; 
  onClose: () => void; 
  onSave: () => void; 
  saving?: boolean;
  draft: Skill[]; 
  setDraft: React.Dispatch<React.SetStateAction<Skill[] | null>>;
}) => {
  // Local state for the form inputs
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<SkillLevel>('Intermediate');
  
  const LEVELS = [
    { label: 'Expert', value: 'Expert' }, 
    { label: 'Intermediate', value: 'Intermediate' }, 
    { label: 'Beginner', value: 'Beginner' },
  ];

  /**
   * Adds a new skill to the local draft list.
   */
  const handleAddSkill = () => {
    if (!skillName.trim()) return;

    // Check if skill already exists in the list to prevent duplicates
    const isDuplicate = draft?.some(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (isDuplicate) {
      alert("This skill is already in your list.");
      return;
    }

    const newSkill: Skill = { 
      id: Date.now().toString(), // Generate temporary unique ID
      name: skillName.trim(), 
      category, 
      level: level as SkillLevel 
    };

    setDraft(prev => prev ? [...prev, newSkill] : [newSkill]);
    setSkillName(''); // Reset input field
  };

  /**
   * FIX: handleRemoveSkill
   * Removes a skill from the draft list.
   * Logic: Checks ID first. If ID is missing (common with API data), checks by Name.
   */
  const handleRemoveSkill = (skillToRemove: Skill) => {
    setDraft(prevDraft => {
      if (!prevDraft) return null;
      return prevDraft.filter(s => {
        // 1. If both have unique IDs, compare IDs
        if (s.id && skillToRemove.id) {
          return s.id !== skillToRemove.id;
        }
        // 2. Fallback: Compare by name (useful for skills fetched from API without IDs)
        return s.name !== skillToRemove.name;
      });
    });
  };

  /**
   * HELPER: getNormalizedLevel
   * Safely extracts the skill level string without using 'any'.
   */
  const getNormalizedLevel = (skill: Skill): SkillLevel => {
    // Return level if exists, otherwise return proficiency (backend key), default to Beginner
    return (skill.level || skill.proficiency || 'Beginner') as SkillLevel;
  };

  return (
    <EditModal 
      title="Add Skills & Technologies" 
      isOpen={isOpen} 
      onClose={onClose} 
      onSave={onSave} 
      saving={saving}
    >
      <div className="flex flex-col gap-6">
        {/* INPUT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <FormSelect label="Category" value={category} onChange={setCategory} options={SKILL_CATEGORIES}  />
          </div>
          <div className="md:col-span-4">
            <FormInput label="Skill Name" value={skillName} onChange={setSkillName} placeholder="e.g., React, Python" />
          </div>
          <div className="md:col-span-3">
            <FormSelect label="Proficiency" value={level} onChange={v => setLevel(v as SkillLevel)} options={LEVELS} />
          </div>
          <div className="md:col-span-1 flex flex-col justify-end">
            <button 
              type="button" 
              onClick={handleAddSkill} 
              disabled={!skillName.trim()} 
              className="w-full py-2.5 bg-accent text-white font-semibold rounded-lg text-sm hover:bg-accent-hover transition-all"
            >
              Add
            </button>
          </div>
        </div>
        
        {/* SKILLS LIST (PREVIEW) */}
        {draft && draft.length > 0 && (
          <div className="flex flex-col gap-3 pt-5 border-t border-border">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Skills to save</p>
            <div className="flex flex-wrap gap-2">
              {draft.map((skill) => {
                const currentLevel = getNormalizedLevel(skill);

                return (
                  <div 
                    key={skill.id || skill.name} 
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                      currentLevel === 'Expert' 
                        ? 'bg-accent-tint text-accent border-accent-tint' 
                        : 'bg-raised text-secondary border-border'
                    }`}
                  >
                    <span>{skill.name}</span>
                    <span className="text-[10px] font-normal opacity-70">
                      {currentLevel.charAt(0)}
                    </span>
                    {/* REMOVE BUTTON: Passes the whole skill object for precise filtering */}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(skill)} 
                      className="ml-1 hover:text-red-500 opacity-70 hover:opacity-100 transition-colors"
                      aria-label={`Remove ${skill.name}`}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </EditModal>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPONENT 4 — ProjectsModal
// Handles: Project details, Tech stack, Links, and Status.
// ─────────────────────────────────────────────────────────────
export const ProjectsModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Project; setDraft: React.Dispatch<React.SetStateAction<Project | null>>;
}) => (
  <EditModal title={draft.name ? "Edit Project" : "Add Project"} isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2"><FormInput label="Project Name" value={draft.name} placeholder="e.g. DevConnect" onChange={v => setDraft(d => d ? { ...d, name: v } : d)} /></div>
      <div className="col-span-2"><FormTextarea label="Description" value={draft.description} rows={2} onChange={v => setDraft(d => d ? { ...d, description: v } : d)} /></div>
      <div className="col-span-2">
        <FormInput label="Tech Stack (comma separated)" value={draft.techStack.join(', ')} onChange={v => setDraft(d => d ? { ...d, techStack: v.split(',').map(s => s.trim()).filter(Boolean) } : d)} />
      </div>
      <FormSelect label="Role" value={draft.role} onChange={v => setDraft(d => d ? { ...d, role: v as Project['role'] } : d)} options={[{ label: 'Solo', value: 'Solo' }, { label: 'Lead', value: 'Lead' }, { label: 'Contributor', value: 'Contributor' }]} />
      <FormSelect label="Status" value={draft.status} onChange={v => setDraft(d => d ? { ...d, status: v as Project['status'] } : d)} options={[{ label: 'In Progress', value: 'In Progress' }, { label: 'Live', value: 'Live' }, { label: 'Archived', value: 'Archived' }]} />
      <FormInput label="GitHub URL" value={draft.githubUrl || ''} onChange={v => setDraft(d => d ? { ...d, githubUrl: v } : d)} />
      <FormInput label="Live URL" value={draft.liveUrl || ''} onChange={v => setDraft(d => d ? { ...d, liveUrl: v } : d)} />
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 5 — ExperienceModal
// Handles: Work history entries.
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
        <FormSelect label="Employment Type" value={draft.type} onChange={v => setDraft(d => d ? { ...d, type: v } : d)} options={[{ label: 'Full-time', value: 'Full-time' }, { label: 'Part-time', value: 'Part-time' }, { label: 'Internship', value: 'Internship' }, { label: 'Freelance', value: 'Freelance' }]} />
      </div>
      <FormInput label="Start Date" value={draft.startDate} placeholder="Jan 2023" onChange={v => setDraft(d => d ? { ...d, startDate: v } : d)} />
      <FormInput label="End Date" value={draft.endDate} placeholder="Present" onChange={v => setDraft(d => d ? { ...d, endDate: v } : d)} />
      <div className="col-span-2"><FormTextarea label="Description" value={draft.description} rows={3} onChange={v => setDraft(d => d ? { ...d, description: v } : d)} /></div>
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 6 — EducationModal
// Handles: Academic degree and institution info.
// ─────────────────────────────────────────────────────────────
export const EducationModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Education; setDraft: React.Dispatch<React.SetStateAction<Education | null>>;
}) => (
  <EditModal title={draft.institution ? "Edit Education" : "Add Education"} isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2"><FormInput label="Institution" value={draft.institution} onChange={v => setDraft(d => d ? { ...d, institution: v } : d)} /></div>
      <FormInput label="Degree" value={draft.degree} onChange={v => setDraft(d => d ? { ...d, degree: v } : d)} />
      <FormSelect label="Type" value={draft.type} onChange={v => setDraft(d => d ? { ...d, type: v } : d)} options={[{ label: 'Degree', value: 'Degree' }, { label: 'Certification', value: 'Certification' }, { label: 'Bootcamp', value: 'Bootcamp' }]} />
      <FormInput label="Start Year" value={draft.startYear} onChange={v => setDraft(d => d ? { ...d, startYear: v } : d)} />
      <FormInput label="End Year" value={draft.endYear} onChange={v => setDraft(d => d ? { ...d, endYear: v } : d)} />
      <div className="col-span-2"><FormInput label="Link" value={draft.link || ''} onChange={v => setDraft(d => d ? { ...d, link: v } : d)} /></div>
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 7 — AchievementsModal
// Handles: Awards, Hackathons, and Recognitions.
// ─────────────────────────────────────────────────────────────
export const AchievementsModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Achievement; setDraft: React.Dispatch<React.SetStateAction<Achievement | null>>;
}) => (
  <EditModal title={draft.title ? "Edit Achievement" : "Add Achievement"} isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2"><FormInput label="Title" value={draft.title} onChange={v => setDraft(d => d ? { ...d, title: v } : d)} /></div>
      <FormSelect label="Type" value={draft.type} onChange={v => setDraft(d => d ? { ...d, type: v } : d)} options={[{ label: 'Hackathon', value: 'Hackathon' }, { label: 'Award', value: 'Award' }, { label: 'Publication', value: 'Publication' }]} />
      <FormInput label="Date" value={draft.date} onChange={v => setDraft(d => d ? { ...d, date: v } : d)} />
      <div className="col-span-2"><FormTextarea label="Description" value={draft.description} rows={3} onChange={v => setDraft(d => d ? { ...d, description: v } : d)} /></div>
      <div className="col-span-2"><FormInput label="Link" value={draft.link || ''} onChange={v => setDraft(d => d ? { ...d, link: v } : d)} /></div>
    </div>
  </EditModal>
);