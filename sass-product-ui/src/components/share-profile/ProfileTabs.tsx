/**
 * @file ProfileTabs.tsx
 * @description Presentational components for the different sections of the User Profile.
 * Each tab handles the layout and display logic for specific data types (Experience, Skills, etc.)
 * and triggers edit/add events back to the parent container.
 */

import {
  DetailField, SectionCard, SkillChip, Tag,
  StatusBadge, EmptyState, ListHeader,
} from './ProfileUI';
import type {
  BasicDetails, Skill, Project, Experience,
  Education, Collaboration, Achievement,
} from '../../shared/model/profile';

/** 
 * Reusable small button for triggering the edit modal of a specific list item.
 * @param onClick - Callback function to trigger when the icon is clicked.
 */
const EditIconButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation(); // Prevent triggering parent click events if any
      onClick();
    }} 
    className="text-muted hover:text-accent p-1 transition-colors"
    title="Edit"
    aria-label="Edit item" // Added for accessibility
  >
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    </svg>
  </button>
);

/** 
 * Tab 1: Basic Details
 * Displays the user's name, contact info, and "About Me" summary.
 */
export const BasicTab = ({
  basic, formatDate, formatLabel, onEdit,
}: {
  basic: BasicDetails; formatDate: (d: string) => string; formatLabel: (v: string) => string; onEdit: () => void;
}) => (
  <SectionCard title="Basic Details" onEdit={onEdit}>
    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
      <DetailField label="First Name" value={basic.firstName} />
      <DetailField label="Last Name" value={basic.lastName} />
      <DetailField label="Mobile" value={basic.mobile} />
      <DetailField label="Gender" value={formatLabel(basic.gender)} />
      <DetailField label="Dev Type" value={formatLabel(basic.devType)} />
      <DetailField label="Date of Birth" value={formatDate(basic.dateOfBirth)} />
    </div>
    <div className="mt-5 pt-5 border-t border-border">
      <DetailField label="About Me" value={basic.aboutMe} />
    </div>
  </SectionCard>
);

/** 
 * Tab 2: Skills
 * Groups the user's skills by category (e.g., Frontend, Backend) and displays them as Chips.
 */
export const SkillsTab = ({
  skills, onEdit,
}: {
  skills: Skill[]; onEdit: () => void;
}) => {
  // Logic to transform the flat skills array into an object grouped by category
  const byCategory = (skills ||[]).reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <SectionCard title="Skills & Technologies" onEdit={onEdit}>
      <div className="flex flex-col gap-5">
        {Object.entries(byCategory).map(([category, catSkills]) => (
          <div key={category}>
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">{category}</p>
            <div className="flex flex-wrap gap-2">
              {catSkills.map(s => <SkillChip key={s.id} name={s.name} level={s.level} />)}
            </div>
          </div>
        ))}
      </div>
      {/* Legend to explain the abbreviations (E/I/B) used in chips */}
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
 * Lists individual project cards with status badges and tech stack tags.
 */
export const ProjectsTab = ({
  projects, onAdd, onEdit,
}: {
  projects: Project[]; onAdd: () => void; onEdit: (id: string) => void;
}) => {
  // Handle case where no projects exist
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
              <h3 className="text-sm font-bold text-text">{p.name}</h3>
              <p className="text-xs text-secondary mt-0.5">{p.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={p.status} />
              <EditIconButton onClick={() => onEdit(p.id)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {p.techStack.map(t => <Tag key={t} label={t} />)}
          </div>
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            <span className="text-xs text-muted">Role: <span className="text-text font-semibold">{p.role}</span></span>
            {p.lookingFor.length > 0 && <span className="text-xs text-muted">Looking for: <span className="text-accent font-semibold">{p.lookingFor.join(', ')}</span></span>}
          </div>
        </div>
      ))}
    </div>
  );
};

/** 
 * Tab 4: Collaborate
 * Displays the user's collaboration "pitch" and work preferences.
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
        <p className="text-sm text-secondary leading-relaxed">{collaboration.pitch}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Project Types</p>
          <div className="flex flex-wrap gap-1.5">{collaboration.projectTypes.map(t => <Tag key={t} label={t} />)}</div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Looking For</p>
          <div className="flex flex-wrap gap-1.5">
            {collaboration.lookingFor.map(t => <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-accent-tint text-accent border border-accent-tint">{t}</span>)}
          </div>
        </div>
        <DetailField label="Availability" value={collaboration.availability} />
        <DetailField label="Work Style" value={collaboration.workStyle} />
        <DetailField label="Time Zone" value={collaboration.timezone} />
      </div>
    </div>
  </SectionCard>
);

/** 
 * Tab 5: Experience
 * Lists the user's work history cards.
 */
export const ExperienceTab = ({
  experiences, onAdd, onEdit
}: {
  experiences: Experience[]; onAdd: () => void; onEdit: (id: string) => void;
}) => {
  if (!experiences || experiences.length === 0) {
    return <EmptyState icon="💼" title="No experience added" description="Add your work history, internships or freelance projects" actionLabel="+ Add Experience" onAction={onAdd} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <ListHeader title="Experience" onAdd={onAdd} />
      {experiences.map(exp => (
        <div key={exp.id} className="bg-surface border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-sm font-bold text-text">{exp.role}</h3>
              <p className="text-xs text-accent font-semibold mt-0.5">{exp.company}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-raised border-border text-muted">{exp.type}</span>
              <EditIconButton onClick={() => onEdit(exp.id)} />
            </div>
          </div>
          <p className="text-xs text-muted mb-2">{exp.startDate} — {exp.endDate || 'Present'}</p>
          <p className="text-sm text-secondary leading-relaxed">{exp.description}</p>
        </div>
      ))}
    </div>
  );
};

/** 
 * Tab 6: Education
 * Lists degrees, bootcamps, or relevant academic certifications.
 */
export const EducationTab = ({
  educations, onAdd, onEdit
}: {
  educations: Education[]; onAdd: () => void; onEdit: (id: string) => void;
}) => {
  if (!educations || educations.length === 0) {
    return <EmptyState icon="🎓" title="No education added" description="Add your degrees, bootcamps or certifications" actionLabel="+ Add Education" onAction={onAdd} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <ListHeader title="Education" onAdd={onAdd} />
      {educations.map(edu => (
        <div key={edu.id} className="bg-surface border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-sm font-bold text-text">{edu.degree}</h3>
              <p className="text-xs text-accent font-semibold mt-0.5">{edu.institution}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-raised border-border text-muted">{edu.type}</span>
              <EditIconButton onClick={() => onEdit(edu.id)} />
            </div>
          </div>
          <p className="text-xs text-muted">{edu.startYear} — {edu.endYear}</p>
        </div>
      ))}
    </div>
  );
};

/** 
 * Tab 7: Achievements
 * Displays awards, contest wins, and certifications with descriptive text.
 */
export const AchievementsTab = ({
  achievements, formatDate, onAdd, onEdit
}: {
  achievements: Achievement[]; formatDate: (d: string) => string; onAdd: () => void; onEdit: (id: string) => void;
}) => {
  if (!achievements || achievements.length === 0) {
    return <EmptyState icon="🏆" title="No achievements yet" description="Add hackathons, open source contributions, articles or awards" actionLabel="+ Add Achievement" onAction={onAdd} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <ListHeader title="Achievements" onAdd={onAdd} />
      {achievements.map(a => (
        <div key={a.id} className="bg-surface border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-sm font-bold text-text">{a.title}</h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-accent-tint border-accent-tint text-accent">{a.type}</span>
              <EditIconButton onClick={() => onEdit(a.id)} />
            </div>
          </div>
          <p className="text-xs text-muted mb-2">{formatDate(a.date)}</p>
          <p className="text-sm text-secondary leading-relaxed">{a.description}</p>
        </div>
      ))}
    </div>
  );
};