/* eslint-disable react-hooks/set-state-in-effect */
// src/components/share-profile/ProfileModals.tsx
import React, { useState, useEffect } from 'react';
import EditModal from '../EditModal';
import { FormInput, FormSelect, FormTextarea } from './ProfileUI';
import type { 
  BasicDetails, Collaboration, Skill, SkillLevel, 
  Project, Experience, Education, Achievement 
} from '../../shared/model/profile';
import { SKILL_CATEGORIES } from '../../shared/constant/categories';
import skillList from '../../assets/json/skills.json';
import genderList from '../../assets/json/gender.json'


// ─────────────────────────────────────────────────────────────
// COMPONENT 1 — BasicModal
// ─────────────────────────────────────────────────────────────
export const BasicModal = ({
  isOpen,
  onClose,
  onSave,
  saving = false,
  draft,
  setDraft,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  draft: BasicDetails;
  setDraft: React.Dispatch<React.SetStateAction<BasicDetails | null>>;
}) => (
  <EditModal
    title="Edit your basic details information."
    isOpen={isOpen}
    onClose={onClose}
    onSave={onSave}
    saving={saving}
  >
    <div className="grid grid-cols-2 gap-4">
      <FormInput
        label="First Name"
        value={draft.firstName}
        placeholder="First name"
        onChange={(v) => setDraft((d) => (d ? { ...d, firstName: v } : d))}
      />
      <FormInput
        label="Last Name"
        value={draft.lastName}
        placeholder="Last name"
        onChange={(v) => setDraft((d) => (d ? { ...d, lastName: v } : d))}
      />
      <FormInput
        label="Phone Number"
        type="tel"
        value={draft.mobile}
        placeholder="Phone number"
        onChange={(v) => setDraft((d) => (d ? { ...d, mobile: v } : d))}
      />
      <FormSelect
        label="Dev Type"
        value={draft.devType}
        onChange={(v) => setDraft((d) => (d ? { ...d, devType: v } : d))}
        options={skillList}
      />
      <FormInput
        label="Date of Birth"
        type="date"
        value={draft.dateOfBirth}
        onChange={(v) => setDraft((d) => (d ? { ...d, dateOfBirth: v } : d))}
      />
      <FormSelect
        label="Gender"
        value={draft.gender}
        onChange={(v) => setDraft((d) => (d ? { ...d, gender: v } : d))}
        options={genderList}
      />
      <div className="col-span-2">
        <FormInput
          label="Email Address"
          type="email"
          value={draft.email}
          placeholder="email@example.com"
          onChange={(v) => setDraft((d) => (d ? { ...d, email: v } : d))}
        />
      </div>
      <div className="col-span-2">
        <FormTextarea
          label="About Me"
          value={draft.aboutMe}
          rows={3}
          placeholder="Tell us about yourself..."
          onChange={(v) => setDraft((d) => (d ? { ...d, aboutMe: v } : d))}
        />
      </div>
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 2 — CollaborateModal (Comma bug fixed)
// ─────────────────────────────────────────────────────────────
export const CollaborateModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Collaboration; setDraft: React.Dispatch<React.SetStateAction<Collaboration | null>>;
}) => {
  // Isolate text state so trailing commas are not deleted automatically while typing
  const[projectTypesStr, setProjectTypesStr] = useState(draft.projectTypes.join(', '));
  const[lookingForStr, setLookingForStr] = useState(draft.lookingFor.join(', '));

  return (
    <EditModal title="Edit your collaboration preferences." isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><FormTextarea label="My Pitch" value={draft.pitch} rows={3} placeholder="What do you want to build?" onChange={v => setDraft(d => d ? { ...d, pitch: v } : d)} /></div>
        
        <FormInput 
          label="Project Types (comma separated)" 
          value={projectTypesStr} 
          placeholder="SaaS, Open Source" 
          onChange={v => {
            setProjectTypesStr(v);
            setDraft(d => d ? { ...d, projectTypes: v.split(',').map(s => s.trim()).filter(Boolean) } : d);
          }} 
        />
        <FormInput 
          label="Looking For (comma separated)" 
          value={lookingForStr} 
          placeholder="Designer, Backend" 
          onChange={v => {
            setLookingForStr(v);
            setDraft(d => d ? { ...d, lookingFor: v.split(',').map(s => s.trim()).filter(Boolean) } : d);
          }} 
        />
        
        <FormSelect label="Availability" value={draft.availability} onChange={v => setDraft(d => d ? { ...d, availability: v } : d)} options={[{ id: 1,label: 'Full-time', value: 'Full-time' }, { id:2,label: 'Part-time', value: 'Part-time' }, { id:3,label: 'Weekends', value: 'Weekends' }, { id:4,label: 'Flexible', value: 'Flexible' }]} />
        <FormSelect label="Work Style" value={draft.workStyle} onChange={v => setDraft(d => d ? { ...d, workStyle: v } : d)} options={[{ id:1,label: 'Remote', value: 'Remote' }, { id:2,label: 'Hybrid', value: 'Hybrid' }, { id:3,label: 'In-person', value: 'In-person' }]} />
        <FormInput label="Time Zone" value={draft.timezone} placeholder="e.g. IST (UTC+5:30)" onChange={v => setDraft(d => d ? { ...d, timezone: v } : d)} />
      </div>
    </EditModal>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPONENT 3 — SkillsModal
// ─────────────────────────────────────────────────────────────
export const SkillsModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Skill[]; setDraft: React.Dispatch<React.SetStateAction<Skill[] | null>>;
}) => {
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<SkillLevel>('Intermediate');
  
  const LEVELS =[
    { id:1,label: 'Expert', value: 'Expert' }, 
    { id:2,label: 'Intermediate', value: 'Intermediate' }, 
    { id:3,label: 'Beginner', value: 'Beginner' },
  ];

  const handleAddSkill = () => {
    if (!skillName.trim()) return;
    const isDuplicate = draft?.some(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (isDuplicate) { alert("This skill is already in your list."); return; }

    const newSkill: Skill = { id: Date.now().toString(), name: skillName.trim(), category, level: level as SkillLevel };
    setDraft(prev => prev ?[...prev, newSkill] : [newSkill]);
    setSkillName(''); 
  };

  const handleRemoveSkill = (skillToRemove: Skill) => {
    setDraft(prev => prev ? prev.filter(s => (s.id && skillToRemove.id) ? s.id !== skillToRemove.id : s.name !== skillToRemove.name) : null);
  };

  const getNormalizedLevel = (skill: Skill): SkillLevel => (skill.level || skill.proficiency || 'Beginner') as SkillLevel;

  return (
    <EditModal title="Add Skills & Technologies" isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4"><FormSelect label="Category" value={category} onChange={setCategory} options={SKILL_CATEGORIES} /></div>
          <div className="md:col-span-4"><FormInput label="Skill Name" value={skillName} onChange={setSkillName} placeholder="e.g., React, Python" /></div>
          <div className="md:col-span-3"><FormSelect label="Proficiency" value={level} onChange={v => setLevel(v as SkillLevel)} options={LEVELS} /></div>
          <div className="md:col-span-1 flex flex-col justify-end"><button type="button" onClick={handleAddSkill} disabled={!skillName.trim()} className="w-full py-2.5 bg-accent text-white font-semibold rounded-lg text-sm hover:bg-accent-hover transition-all">Add</button></div>
        </div>
        {draft && draft.length > 0 && (
          <div className="flex flex-col gap-3 pt-5 border-t border-border">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Skills to save</p>
            <div className="flex flex-wrap gap-2">
              {draft.map((skill) => {
                const currentLevel = getNormalizedLevel(skill);
                return (
                  <div key={skill.id || skill.name} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${currentLevel === 'Expert' ? 'bg-accent-tint text-accent border-accent-tint' : 'bg-raised text-secondary border-border'}`}>
                    <span>{skill.name}</span>
                    <span className="text-[10px] font-normal opacity-70">{currentLevel.charAt(0)}</span>
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-red-500 opacity-70 hover:opacity-100 transition-colors">✕</button>
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
// COMPONENT 4 — ProjectsModal (Comma Bug fixed)
// ─────────────────────────────────────────────────────────────
export const ProjectsModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Project; setDraft: React.Dispatch<React.SetStateAction<Project | null>>;
}) => {
  // Isolate raw string state to allow natural typing with commas
  const [techStackStr, setTechStackStr] = useState(draft.techStack.join(', '));

  // Reset the input field if a different project ID is passed
  useEffect(() => { setTechStackStr(draft.techStack.join(', ')); }, [draft.id]);

  return (
    <EditModal title={draft.name ? "Edit Project" : "Add Project"} isOpen={isOpen} onClose={onClose} onSave={onSave} saving={saving}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><FormInput label="Project Name" value={draft.name} placeholder="e.g. DevConnect" onChange={v => setDraft(d => d ? { ...d, name: v } : d)} /></div>
        <div className="col-span-2"><FormTextarea label="Description" value={draft.description} rows={2} onChange={v => setDraft(d => d ? { ...d, description: v } : d)} /></div>
        <div className="col-span-2">
          <FormInput 
            label="Tech Stack (comma separated)" 
            value={techStackStr} 
            onChange={v => {
              setTechStackStr(v); // Update local visual state smoothly
              setDraft(d => d ? { ...d, techStack: v.split(',').map(s => s.trim()).filter(Boolean) } : d); // Update payload array implicitly
            }} 
          />
        </div>
        <FormSelect label="Role" value={draft.role} onChange={v => setDraft(d => d ? { ...d, role: v as Project['role'] } : d)} options={[{ id:1,label: 'Solo', value: 'Solo' }, { id:2,label: 'Lead', value: 'Lead' }, { id:3,label: 'Contributor', value: 'Contributor' }]} />
        <FormSelect label="Status" value={draft.status} onChange={v => setDraft(d => d ? { ...d, status: v as Project['status'] } : d)} options={[{ id:1,label: 'In Progress', value: 'In Progress' }, { id:2,label: 'Live', value: 'Live' }, { id:3,label: 'Archived', value: 'Archived' }]} />
        <FormInput label="GitHub URL" value={draft.githubUrl || ''} onChange={v => setDraft(d => d ? { ...d, githubUrl: v } : d)} />
        <FormInput label="Live URL" value={draft.liveUrl || ''} onChange={v => setDraft(d => d ? { ...d, liveUrl: v } : d)} />
      </div>
    </EditModal>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPONENT 5 — ExperienceModal
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
      <div className="col-span-2"><FormSelect label="Employment Type" value={draft.type} onChange={v => setDraft(d => d ? { ...d, type: v } : d)} options={[{ id:1,label: 'Full-time', value: 'Full-time' }, { id:2,label: 'Part-time', value: 'Part-time' }, { id:3,label: 'Internship', value: 'Internship' }, { id:4,label: 'Freelance', value: 'Freelance' }]} /></div>
      <FormInput label="Start Date" value={draft.startDate} placeholder="Jan 2023" onChange={v => setDraft(d => d ? { ...d, startDate: v } : d)} />
      <FormInput label="End Date" value={draft.endDate} placeholder="Present" onChange={v => setDraft(d => d ? { ...d, endDate: v } : d)} />
      <div className="col-span-2"><FormTextarea label="Description" value={draft.description} rows={3} onChange={v => setDraft(d => d ? { ...d, description: v } : d)} /></div>
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 6 — EducationModal
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
      <FormSelect label="Type" value={draft.type} onChange={v => setDraft(d => d ? { ...d, type: v } : d)} options={[{ id:1,label: 'Degree', value: 'Degree' }, { id:2,label: 'Certification', value: 'Certification' }, { id:3,label: 'Bootcamp', value: 'Bootcamp' }]} />
      <FormInput label="Start Year" value={draft.startYear} onChange={v => setDraft(d => d ? { ...d, startYear: v } : d)} />
      <FormInput label="End Year" value={draft.endYear} onChange={v => setDraft(d => d ? { ...d, endYear: v } : d)} />
      <div className="col-span-2"><FormInput label="Link" value={draft.link || ''} onChange={v => setDraft(d => d ? { ...d, link: v } : d)} /></div>
    </div>
  </EditModal>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT 7 — AchievementsModal
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
      <FormSelect label="Type" value={draft.type} onChange={v => setDraft(d => d ? { ...d, type: v } : d)} options={[{ id:1,label: 'Hackathon', value: 'Hackathon' }, { id:2,label: 'Award', value: 'Award' }, { id:3,label: 'Publication', value: 'Publication' }]} />
      <FormInput label="Date" value={draft.date} onChange={v => setDraft(d => d ? { ...d, date: v } : d)} />
      <div className="col-span-2"><FormTextarea label="Description" value={draft.description} rows={3} onChange={v => setDraft(d => d ? { ...d, description: v } : d)} /></div>
      <div className="col-span-2"><FormInput label="Link" value={draft.link || ''} onChange={v => setDraft(d => d ? { ...d, link: v } : d)} /></div>
    </div>
  </EditModal>
);