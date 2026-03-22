/**
 * @file ProfileTabs.tsx
 * @description FIXED: Added extreme null-safety to prevent "Cannot read properties of undefined" errors.
 */

import {
  DetailField, SectionCard, SkillChip, Tag,
  StatusBadge, EmptyState, ListHeader,
} from './ProfileUI';
import type {
  BasicDetails, Skill, Project, Experience,
  Education, Collaboration, Achievement,
  SkillLevel,
} from '../../shared/model/profile';

/** 
 * Reusable small button for triggering the edit modal of a specific list item.
 */
const EditIconButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }} 
    className="text-muted hover:text-accent p-1 transition-colors"
    title="Edit"
    aria-label="Edit item"
  >
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    </svg>
  </button>
);

/** 
 * Tab 1: Basic Details
 */
export const BasicTab = ({
  basic, formatDate, formatLabel, onEdit,
}: {
  basic: BasicDetails; formatDate: (d: string) => string; formatLabel: (v: string) => string; onEdit: () => void;
}) => (
  <SectionCard title="Basic Details" onEdit={onEdit}>
    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
      {/* BUG FIX: Added ?. for every property */}
      <DetailField label="First Name" value={basic?.firstName || '—'} />
      <DetailField label="Last Name" value={basic?.lastName || '—'} />
      <DetailField label="Mobile" value={basic?.mobile || '—'} />
      <DetailField label="Gender" value={formatLabel(basic?.gender || '')} />
      <DetailField label="Dev Type" value={formatLabel(basic?.devType || '')} />
      <DetailField label="Date of Birth" value={formatDate(basic?.dateOfBirth || '')} />
    </div>
    <div className="mt-5 pt-5 border-t border-border">
      <DetailField label="About Me" value={basic?.aboutMe || 'No details provided.'} />
    </div>
  </SectionCard>
);

/**
 * @file ProfileTabs.tsx - SkillsTab Component
 * @description Displays user skills grouped by category.
 * Handles strict TypeScript type casting from API 'proficiency' to UI 'level'.
 */

export const SkillsTab = ({
  skills, onEdit,
}: {
  skills: Skill[]; // Kept as strict Skill array
  onEdit: () => void;
}) => {
  
  /**
   * 1. GROUPING & TYPE-SAFE MAPPING
   * We reduce the array into a record where keys are categories.
   * We "Force Cast" the level to SkillLevel to satisfy TypeScript.
   */
  const byCategory = (skills || []).reduce<Record<string, Skill[]>>((acc, s) => {
    // Ensure category exists or default to 'General'
    const category = s.category || 'General';
    
    if (!acc[category]) acc[category] = [];

    // Construct a type-safe Skill object
    const mappedSkill: Skill = {
      ...s,
      /**
       * BUG FIX: Type Assignment
       * 1. We take 'proficiency' (from API) or 'level' (existing).
       * 2. We provide a fallback ('Beginner') so it's never an empty string.
       * 3. We use 'as SkillLevel' to tell TypeScript we guarantee this string 
       *    matches the expected union type.
       */
      level: (s.proficiency || s.level || 'Beginner') as SkillLevel
    };

    acc[category].push(mappedSkill);
    return acc;
  }, {});

  // 2. EMPTY STATE GUARD
  if (!skills || skills.length === 0) {
    return (
      <EmptyState 
        icon="🛠️" 
        title="No skills added" 
        description="List your technical stack to stand out." 
        actionLabel="+ Add Skills" 
        onAction={onEdit} 
      />
    );
  }

  return (
    <SectionCard title="Skills & Technologies" onEdit={onEdit}>
      <div className="flex flex-col gap-5">
        {/* Iterate through the grouped categories */}
        {Object.entries(byCategory).map(([category, catSkills]) => (
          <div key={category}>
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((s) => (
                <SkillChip 
                  key={s.id || s.name} 
                  name={s.name} 
                  level={s.level} // Now guaranteed to be SkillLevel
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER LEGEND */}
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-4">
        <span className="text-xs text-muted">Legend:</span>
        <span className="text-xs text-secondary"><span className="font-bold text-accent">E</span> = Expert</span>
        <span className="text-xs text-secondary"><span className="font-bold">I</span> = Intermediate</span>
        <span className="text-xs text-secondary"><span className="font-bold">B</span> = Beginner</span>
      </div>
    </SectionCard>
  );
};

/** 
 * Tab 3: Projects
 */
export const ProjectsTab = ({
  projects, onAdd, onEdit,
}: {
  projects: Project[]; onAdd: () => void; onEdit: (id: string) => void;
}) => {
  if (!projects || projects.length === 0) {
    return <EmptyState icon="🚀" title="No projects yet" description="Add projects you've built to showcase your work" actionLabel="+ Add Project" onAction={onAdd} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <ListHeader title="Projects" onAdd={onAdd} />
      {projects.map(p => (
        <div key={p.id} className="bg-surface border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="text-sm font-bold text-text">{p?.name || 'Untitled Project'}</h3>
              <p className="text-xs text-secondary mt-0.5">{p?.description || ''}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={p?.status || 'Archived'} />
              <EditIconButton onClick={() => onEdit(p.id)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(p?.techStack || []).map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
      ))}
    </div>
  );
};

/** 
 * Tab 4: Collaborate
 */
export const CollaborateTab = ({
  collaboration, onEdit,
}: {
  collaboration: Collaboration; onEdit: () => void;
}) => (
  <SectionCard title="Looking to Collaborate" onEdit={onEdit}>
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">My Pitch</p>
        <p className="text-sm text-secondary leading-relaxed">{collaboration?.pitch || 'No pitch added yet.'}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Project Types</p>
          <div className="flex flex-wrap gap-1.5">{(collaboration?.projectTypes || []).map(t => <Tag key={t} label={t} />)}</div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Looking For</p>
          <div className="flex flex-wrap gap-1.5">
            {(collaboration?.lookingFor || []).map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
        <DetailField label="Availability" value={collaboration?.availability || '—'} />
        <DetailField label="Work Style" value={collaboration?.workStyle || '—'} />
        <DetailField label="Time Zone" value={collaboration?.timezone || '—'} />
      </div>
    </div>
  </SectionCard>
);

/** 
 * Tab 5: Experience
 */
export const ExperienceTab = ({
  experiences, onAdd, onEdit
}: {
  experiences: Experience[]; onAdd: () => void; onEdit: (id: string) => void;
}) => {
  if (!experiences || experiences.length === 0) {
    return <EmptyState icon="💼" title="No experience added" description="Add your work history." actionLabel="+ Add Experience" onAction={onAdd} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <ListHeader title="Experience" onAdd={onAdd} />
      {experiences.map(exp => (
        <div key={exp.id} className="bg-surface border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-sm font-bold text-text">{exp?.role || 'Role'}</h3>
              <p className="text-xs text-accent font-semibold mt-0.5">{exp?.company || 'Company'}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-raised border-border text-muted">{exp?.type || 'Full-time'}</span>
              <EditIconButton onClick={() => onEdit(exp.id)} />
            </div>
          </div>
          <p className="text-xs text-muted mb-2">{exp?.startDate} — {exp?.endDate || 'Present'}</p>
        </div>
      ))}
    </div>
  );
};

/** 
 * Tab 6: Education
 */
export const EducationTab = ({
  educations, onAdd, onEdit
}: {
  educations: Education[]; onAdd: () => void; onEdit: (id: string) => void;
}) => {
  if (!educations || educations.length === 0) {
    return <EmptyState icon="🎓" title="No education added" description="Add your degrees or certifications." actionLabel="+ Add Education" onAction={onAdd} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <ListHeader title="Education" onAdd={onAdd} />
      {educations.map(edu => (
        <div key={edu.id} className="bg-surface border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-sm font-bold text-text">{edu?.degree || 'Degree'}</h3>
              <p className="text-xs text-accent font-semibold mt-0.5">{edu?.institution || 'Institution'}</p>
            </div>
            <div className="flex items-center gap-3">
              <EditIconButton onClick={() => onEdit(edu.id)} />
            </div>
          </div>
          <p className="text-xs text-muted">{edu?.startYear} — {edu?.endYear}</p>
        </div>
      ))}
    </div>
  );
};

/** 
 * Tab 7: Achievements
 */
export const AchievementsTab = ({
  achievements, formatDate, onAdd, onEdit
}: {
  achievements: Achievement[]; formatDate: (d: string) => string; onAdd: () => void; onEdit: (id: string) => void;
}) => {
  if (!achievements || achievements.length === 0) {
    return <EmptyState icon="🏆" title="No achievements yet" description="Showcase your awards and certifications." actionLabel="+ Add Achievement" onAction={onAdd} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <ListHeader title="Achievements" onAdd={onAdd} />
      {achievements.map(a => (
        <div key={a.id} className="bg-surface border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-sm font-bold text-text">{a?.title || 'Achievement'}</h3>
            <div className="flex items-center gap-3">
              <EditIconButton onClick={() => onEdit(a.id)} />
            </div>
          </div>
          <p className="text-xs text-muted mb-2">{formatDate(a?.date || '')}</p>
          <p className="text-sm text-secondary leading-relaxed">{a?.description}</p>
        </div>
      ))}
    </div>
  );
};