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
import projectStatus from '../../assets/json/project-status.json'
import roles from '../../assets/json/project-role.json'
import availability from '../../assets/json/avalibility.json'
import workMode from '../../assets/json/work-mdoe.json'
import employement from '../../assets/json/employement-type.json'
import education from '../../assets/json/education-type.json'


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
// COMPONENT 2 — CollaborateModal
// ─────────────────────────────────────────────────────────────
export const CollaborateModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  draft: Collaboration;
  setDraft: React.Dispatch<React.SetStateAction<Collaboration | null>>;
}) => {

  const cleanArray = (input: string[] | string | unknown): string[] => {
    let arr = input;
    if (typeof arr === 'string') {
      try {
        arr = JSON.parse(arr);
      } catch {
        return (input as string)
          .replace(/[^a-zA-Z\s,-]/g, '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      }
    }
    if (!Array.isArray(arr)) return [];
    return arr
      .map(t => (typeof t === 'string' ? t.replace(/[^a-zA-Z\s-]/g, '').trim() : ''))
      .filter(Boolean);
  };

  const sanitizeInput = (v: string) => v.replace(/[^a-zA-Z\s,-]/g, '');

  const [projectTypesStr, setProjectTypesStr] = useState(
    cleanArray(draft.projectTypes).join(', ')
  );
  const [lookingForStr, setLookingForStr] = useState(
    cleanArray(draft.lookingFor).join(', ')
  );

  const [errors, setErrors] = useState<{
    pitch?: string;
    projectTypes?: string;
    lookingFor?: string;
    availability?: string;
    workStyle?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      setProjectTypesStr(cleanArray(draft.projectTypes).join(', '));
      setLookingForStr(cleanArray(draft.lookingFor).join(', '));
      setErrors({});
    }
  }, [isOpen]);

  const handleSave = () => {
    const newErrors: typeof errors = {};

    if (!draft.pitch?.trim()) newErrors.pitch = "This field is required.";
    if (!projectTypesStr.trim()) newErrors.projectTypes = "This field is required.";
    if (!lookingForStr.trim()) newErrors.lookingFor = "This field is required.";
    if (!draft.availability) newErrors.availability = "This field is required.";
    if (!draft.workStyle) newErrors.workStyle = "This field is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave();
  };

  return (
    <EditModal
      title="Edit your collaboration preferences."
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-2">
          <FormTextarea
            label="My Pitch"
            value={draft.pitch}
            rows={3}
            placeholder="What do you want to build?"
            error={errors.pitch}
            onChange={v => {
              setDraft(d => d ? { ...d, pitch: v } : d);
              if (errors.pitch) setErrors(prev => ({ ...prev, pitch: undefined }));
            }}
          />
        </div>

        <FormInput
          label="Project Types (comma separated)"
          value={projectTypesStr}
          placeholder="e.g. SaaS, E-commerce, Mobile App"
          error={errors.projectTypes}
          onChange={v => {
            const cleaned = sanitizeInput(v);
            setProjectTypesStr(cleaned);
            setDraft(d => d ? {
              ...d,
              projectTypes: cleaned.split(',').map(s => s.trim()).filter(Boolean)
            } : d);
            if (errors.projectTypes) setErrors(prev => ({ ...prev, projectTypes: undefined }));
          }}
        />

        <FormInput
          label="Looking For (comma separated)"
          value={lookingForStr}
          placeholder="e.g. Designer, Backend Developer"
          error={errors.lookingFor}
          onChange={v => {
            const cleaned = sanitizeInput(v);
            setLookingForStr(cleaned);
            setDraft(d => d ? {
              ...d,
              lookingFor: cleaned.split(',').map(s => s.trim()).filter(Boolean)
            } : d);
            if (errors.lookingFor) setErrors(prev => ({ ...prev, lookingFor: undefined }));
          }}
        />

        <FormSelect
          label="Availability"
          value={draft.availability}
          error={errors.availability}
          onChange={v => {
            setDraft(d => d ? { ...d, availability: v } : d);
            if (errors.availability) setErrors(prev => ({ ...prev, availability: undefined }));
          }}
          options={availability}
        />

        <FormSelect
          label="Work Style"
          value={draft.workStyle}
          error={errors.workStyle}
          onChange={v => {
            setDraft(d => d ? { ...d, workStyle: v } : d);
            if (errors.workStyle) setErrors(prev => ({ ...prev, workStyle: undefined }));
          }}
          options={workMode}
        />

        <FormInput
          label="Time Zone"
          value={draft.timezone}
          placeholder="e.g. IST (UTC+5:30)"
          onChange={v => setDraft(d => d ? { ...d, timezone: v } : d)}
        />

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
  const[category, setCategory] = useState('');
  const [level, setLevel] = useState<SkillLevel | ''>('');
  
  const [errors, setErrors] = useState<{ category?: string; skillName?: string; level?: string }>({});

  // NEW: Tracks if the user successfully added a new skill during this modal session
  const [hasAddedNewSkill, setHasAddedNewSkill] = useState(false);

  const LEVELS =[
    { id: 1, label: 'Expert', value: 'Expert' }, 
    { id: 2, label: 'Intermediate', value: 'Intermediate' }, 
    { id: 3, label: 'Beginner', value: 'Beginner' },
  ];

  const validateSkillForm = (): boolean => {
    const newErrors: { category?: string; skillName?: string; level?: string } = {};

    if (!category) newErrors.category = "This field is required";
    if (!skillName.trim()) newErrors.skillName = "This field is required";
    if (!level) newErrors.level = "This field is required";

    // Only check for duplicates if the user actually typed a skill name
    if (skillName.trim()) {
      const isDuplicate = draft?.some(
        s => (s?.name || '').toLowerCase() === skillName.trim().toLowerCase()
      );
      if (isDuplicate) newErrors.skillName = "This skill is already in your list.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true = valid, false = invalid
  };

  const handleAddSkill = () => {
    if (!validateSkillForm()) return; // Blocks adding if validation fails
  
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: skillName.trim(),
      category,
      level: level as SkillLevel,
    };
  
    setDraft(prev => prev ? [...prev, newSkill] : [newSkill]);
  
    // Clear inputs upon successful add
    setSkillName('');
    setCategory('');
    setLevel('');
    setErrors({});

    // MARK AS SUCCESSFUL: The user fulfilled the requirement of adding a new skill!
    setHasAddedNewSkill(true);
  };

  const handleRemoveSkill = (skillToRemove: Skill) => {
    setDraft(prev => prev ? prev.filter(s => (s.id && skillToRemove.id) ? s.id !== skillToRemove.id : s.name !== skillToRemove.name) : null);
  };

  const getNormalizedLevel = (skill: Skill): SkillLevel => (skill.level || skill.proficiency || 'Beginner') as SkillLevel;

  const handleSave = () => {
      // Check if user typed anything but forgot to click the "Add" button
      const hasPendingInput = skillName.trim() !== '' || category !== '' || level !== '';

      // REQUIREMENT 1 & 2: If they have old data but didn't add a NEW skill, 
      // OR if they have pending text/validation errors showing.
      if (!hasAddedNewSkill || hasPendingInput) {
        validateSkillForm(); // Force the inputs to turn red to show they are required
        alert("Please add any one skill."); // Show exact requested message
        return; // Block save, keep modal open
      }

      // Safety Check: Prevent saving if the draft is entirely empty
      if (!draft || draft.length === 0) {
        alert("Please add any one skill.");
        return;
      }

      // REQUIREMENT 3: Successfully added a skill, no validation errors -> Save & Close
      onSave(); 
  };

  return (
    <EditModal
      title="Add Skills & Technologies"
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave} // Connected to our new robust save logic
      saving={saving}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          
          <div className="md:col-span-4">
            <FormSelect
              label="Category"
              value={category}
              onChange={(val) => {
                setCategory(val);
                if (errors.category) setErrors(prev => ({ ...prev, category: undefined })); 
              }}
              options={SKILL_CATEGORIES}
              error={errors.category} 
            />
          </div>

          <div className="md:col-span-4">
            <FormInput
              label="Skill Name"
              value={skillName}
              onChange={(val) => {
                setSkillName(val);
                if (errors.skillName) setErrors(prev => ({ ...prev, skillName: undefined })); 
              }}
              placeholder="e.g., React, Python"
              error={errors.skillName} 
            />
          </div>

          <div className="md:col-span-3">
            <FormSelect
              label="Proficiency"
              value={level}
              onChange={(val) => {
                setLevel(val as SkillLevel);
                if (errors.level) setErrors(prev => ({ ...prev, level: undefined })); 
              }}
              options={LEVELS}
              error={errors.level} 
            />
          </div>

          <div className="md:col-span-1 flex flex-col pt-7">
            <button
              type="button"
              onClick={handleAddSkill}
              className="w-full py-2.5 bg-accent text-white font-semibold rounded-lg text-sm hover:bg-accent-hover transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {draft && draft.length > 0 && (
          <div className="flex flex-col gap-3 pt-5 border-t border-border">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Skills to save
            </p>
            <div className="flex flex-wrap gap-2">
              {draft.map((skill) => {
                const currentLevel = getNormalizedLevel(skill);
                return (
                  <div
                    key={skill.id || skill.name}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${currentLevel === "Expert" ? "bg-accent-tint text-accent border-accent-tint" : "bg-raised text-secondary border-border"}`}
                  >
                    <span>{skill.name}</span>
                    <span className="text-[10px] font-normal opacity-70">
                      {currentLevel.charAt(0)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-red-500 opacity-70 hover:opacity-100 transition-colors"
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
// ─────────────────────────────────────────────────────────────

export const ProjectsModal = ({
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
  draft: Project;
  setDraft: React.Dispatch<React.SetStateAction<Project | null>>;
}) => {
  // It only keeps letters, numbers, spaces, dots, hyphens, plus, and hash (for HTML5, Node.js, C++)
  const cleanTechStack = (stack: string[]) => {
    if (!stack || !Array.isArray(stack)) return[];
    return stack
      .map((t) => (typeof t === "string" ? t.replace(/[^a-zA-Z0-9\s.\-#+]/g, "").trim() : ""))
      .filter(Boolean);
  };

  const[techStackStr, setTechStackStr] = useState(cleanTechStack(draft.techStack).join(", "));
  
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    techStack?: string;
    role?: string;
    status?: string;
  }>({});

  useEffect(() => {
    setTechStackStr(cleanTechStack(draft.techStack).join(", "));
    setErrors({});
  }, [draft.id, isOpen]);

  const handleSave = () => {
    const newErrors: {
      name?: string;
      description?: string;
      techStack?: string;
      role?: string;
      status?: string;
    } = {};

    if (!draft.name.trim()) newErrors.name = "This field is required.";
    if (!draft.description.trim()) newErrors.description = "This field is required.";
    if (!techStackStr.trim()) newErrors.techStack = "This field is required.";
    if (!draft.role) newErrors.role = "This field is required.";
    if (!draft.status) newErrors.status = "This field is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave();
  };

  return (
    <EditModal
      title={draft.name ? "Edit Project" : "Add Project"}
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FormInput
            label="Project Name"
            value={draft.name}
            placeholder="e.g. DevConnect"
            error={errors.name}
            onChange={(v) => {
              setDraft((d) => (d ? { ...d, name: v } : d));
              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
            }}
          />
        </div>
        
        <div className="col-span-2">
          <FormTextarea
            label="Description"
            value={draft.description}
            rows={2}
            error={errors.description}
            onChange={(v) => {
              setDraft((d) => (d ? { ...d, description: v } : d));
              if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
            }}
          />
        </div>
        
        <div className="col-span-2">
          <FormInput
            label="Tech Stack (comma separated)"
            value={techStackStr}
            error={errors.techStack}
            onChange={(v) => {
              // Update local visual state smoothly so user can type freely
              setTechStackStr(v);
              
              setDraft((d) =>
                d ? {
                      ...d,
                      // BUG FIX 4: Clean the new data BEFORE it gets saved to the backend!
                      techStack: v
                        .split(",")
                        .map((s) => s.replace(/[^a-zA-Z0-9\s.\-#+]/g, "").trim())
                        .filter(Boolean),
                    }
                  : d
              );
              if (errors.techStack) setErrors(prev => ({ ...prev, techStack: undefined }));
            }}
          />
        </div>
        
        <FormSelect
          label="Role"
          value={draft.role}
          options={roles} // Assuming 'roles' is defined in your file
          error={errors.role}
          onChange={(v) => {
            setDraft((d) => (d ? { ...d, role: v as Project["role"] } : d));
            if (errors.role) setErrors(prev => ({ ...prev, role: undefined }));
          }}
        />
        
        <FormSelect
          label="Status"
          value={draft.status}
          options={projectStatus} // Assuming 'projectStatus' is defined in your file
          error={errors.status}
          onChange={(v) => {
            setDraft((d) => (d ? { ...d, status: v as Project["status"] } : d));
            if (errors.status) setErrors(prev => ({ ...prev, status: undefined }));
          }}
        />
        
        <FormInput
          label="GitHub URL"
          value={draft.githubUrl || ""}
          onChange={(v) => setDraft((d) => (d ? { ...d, githubUrl: v } : d))}
        />
        
        <FormInput
          label="Live URL"
          value={draft.liveUrl || ""}
          onChange={(v) => setDraft((d) => (d ? { ...d, liveUrl: v } : d))}
        />
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
}) => {

  const [errors, setErrors] = useState<{
    company?: string;
    role?: string;
    type?: string;
    startDate?: string;
  }>({});

  useEffect(() => {
    if (isOpen) setErrors({});
  }, [isOpen]);

  const handleSave = () => {
    const newErrors: typeof errors = {};

    if (!draft.company?.trim()) newErrors.company = "This field is required.";
    if (!draft.role?.trim()) newErrors.role = "This field is required.";
    if (!draft.type) newErrors.type = "This field is required.";
    if (!draft.startDate?.trim()) newErrors.startDate = "This field is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave();
  };

  return (
    <EditModal
      title={draft.company ? "Edit Experience" : "Add Experience"}
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-2 gap-4">

        <FormInput
          label="Company Name"
          value={draft.company}
          placeholder="e.g. TechCorp"
          error={errors.company}
          onChange={v => {
            setDraft(d => d ? { ...d, company: v } : d);
            if (errors.company) setErrors(prev => ({ ...prev, company: undefined }));
          }}
        />

        <FormInput
          label="Job Title / Role"
          value={draft.role}
          placeholder="e.g. Frontend Developer"
          error={errors.role}
          onChange={v => {
            setDraft(d => d ? { ...d, role: v } : d);
            if (errors.role) setErrors(prev => ({ ...prev, role: undefined }));
          }}
        />

        <div className="col-span-2">
          <FormSelect
            label="Employment Type"
            value={draft.type}
            error={errors.type}
            onChange={v => {
              setDraft(d => d ? { ...d, type: v } : d);
              if (errors.type) setErrors(prev => ({ ...prev, type: undefined }));
            }}
            options={employement}
          />
        </div>

        <FormInput
          label="Start Date"
          value={draft.startDate}
          placeholder="Jan 2023"
          error={errors.startDate}
          onChange={v => {
            setDraft(d => d ? { ...d, startDate: v } : d);
            if (errors.startDate) setErrors(prev => ({ ...prev, startDate: undefined }));
          }}
        />

        <FormInput
          label="End Date"
          value={draft.endDate}
          placeholder="Present"
          onChange={v => setDraft(d => d ? { ...d, endDate: v } : d)}
        />

        <div className="col-span-2">
          <FormTextarea
            label="Description"
            value={draft.description}
            rows={3}
            onChange={v => setDraft(d => d ? { ...d, description: v } : d)}
          />
        </div>

      </div>
    </EditModal>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPONENT 6 — EducationModal
// ─────────────────────────────────────────────────────────────
export const EducationModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Education; setDraft: React.Dispatch<React.SetStateAction<Education | null>>;
}) => {

  const [errors, setErrors] = useState<{
    institution?: string;
    degree?: string;
    type?: string;
    startYear?: string;
    endYear?: string;
  }>({});

  useEffect(() => {
    if (isOpen) setErrors({});
  }, [isOpen]);

  const handleSave = () => {
    const newErrors: typeof errors = {};

    if (!draft.institution?.trim()) newErrors.institution = "This field is required.";
    if (!draft.degree?.trim()) newErrors.degree = "This field is required.";
    if (!draft.type) newErrors.type = "This field is required.";
    if (!draft.startYear?.trim()) newErrors.startYear = "This field is required.";
    if (!draft.endYear?.trim()) newErrors.endYear = "This field is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave();
  };

  return (
    <EditModal
      title={draft.institution ? "Edit Education" : "Add Education"}
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-2">
          <FormInput
            label="Institution"
            value={draft.institution}
            error={errors.institution}
            onChange={v => {
              setDraft(d => d ? { ...d, institution: v } : d);
              if (errors.institution) setErrors(prev => ({ ...prev, institution: undefined }));
            }}
          />
        </div>

        <FormInput
          label="Degree"
          value={draft.degree}
          error={errors.degree}
          onChange={v => {
            setDraft(d => d ? { ...d, degree: v } : d);
            if (errors.degree) setErrors(prev => ({ ...prev, degree: undefined }));
          }}
        />

        <FormSelect
          label="Type"
          value={draft.type}
          error={errors.type}
          onChange={v => {
            setDraft(d => d ? { ...d, type: v } : d);
            if (errors.type) setErrors(prev => ({ ...prev, type: undefined }));
          }}
          options={education}
        />

        <FormInput
          label="Start Year"
          value={draft.startYear}
          error={errors.startYear}
          onChange={v => {
            setDraft(d => d ? { ...d, startYear: v } : d);
            if (errors.startYear) setErrors(prev => ({ ...prev, startYear: undefined }));
          }}
        />

        <FormInput
          label="End Year"
          value={draft.endYear}
          error={errors.endYear}
          onChange={v => {
            setDraft(d => d ? { ...d, endYear: v } : d);
            if (errors.endYear) setErrors(prev => ({ ...prev, endYear: undefined }));
          }}
        />

        <div className="col-span-2">
          <FormInput
            label="Institution Link"
            value={draft.link || ''}
            onChange={v => setDraft(d => d ? { ...d, link: v } : d)}
          />
        </div>

      </div>
    </EditModal>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPONENT 7 — AchievementsModal
// ─────────────────────────────────────────────────────────────
export const AchievementsModal = ({
  isOpen, onClose, onSave, saving = false, draft, setDraft,
}: {
  isOpen: boolean; onClose: () => void; onSave: () => void; saving?: boolean;
  draft: Achievement; setDraft: React.Dispatch<React.SetStateAction<Achievement | null>>;
}) => {

  const [errors, setErrors] = useState<{
    title?: string;
    type?: string;
    date?: string;
    description?: string;
  }>({});

  useEffect(() => {
    if (isOpen) setErrors({});
  }, [isOpen]);

  const handleSave = () => {
    const newErrors: typeof errors = {};

    if (!draft.title?.trim()) newErrors.title = "This field is required.";
    if (!draft.type) newErrors.type = "This field is required.";
    if (!draft.date?.trim()) newErrors.date = "This field is required.";
    if (!draft.description?.trim()) newErrors.description = "This field is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave();
  };

  return (
    <EditModal
      title={draft.title ? "Edit Achievement" : "Add Achievement"}
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-2">
          <FormInput
            label="Title"
            value={draft.title}
            error={errors.title}
            onChange={v => {
              setDraft(d => d ? { ...d, title: v } : d);
              if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
            }}
          />
        </div>

        <FormSelect
          label="Type"
          value={draft.type}
          error={errors.type}
          onChange={v => {
            setDraft(d => d ? { ...d, type: v } : d);
            if (errors.type) setErrors(prev => ({ ...prev, type: undefined }));
          }}
          options={[
            { id: 1, label: 'Hackathon', value: 'Hackathon' },
            { id: 2, label: 'Award', value: 'Award' },
            { id: 3, label: 'Publication', value: 'Publication' },
          ]}
        />

        <FormInput
          label="Date"
          value={draft.date}
          error={errors.date}
          onChange={v => {
            setDraft(d => d ? { ...d, date: v } : d);
            if (errors.date) setErrors(prev => ({ ...prev, date: undefined }));
          }}
        />

        <div className="col-span-2">
          <FormTextarea
            label="Description"
            value={draft.description}
            rows={3}
            error={errors.description}
            onChange={v => {
              setDraft(d => d ? { ...d, description: v } : d);
              if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
            }}
          />
        </div>

        <div className="col-span-2">
          <FormInput
            label="Link"
            value={draft.link || ''}
            onChange={v => setDraft(d => d ? { ...d, link: v } : d)}
          />
        </div>

      </div>
    </EditModal>
  );
};