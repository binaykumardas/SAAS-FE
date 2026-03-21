/* eslint-disable react-refresh/only-export-components */
/**
 * @file Profile.tsx
 * @location src/pages/Profile.tsx
 * @description 
 * The central orchestrator for the profile page. It manages data fetching via 
 * hooks, handles the "Draft Pattern" for modals, and ensures fallback data 
 * is provided so the UI never crashes on empty states.
 */

import { useState } from 'react';

// -- TypeScript Type Imports --
import type { 
  BasicDetails, Collaboration, Skill, Project, 
  Experience, Education, Achievement, TabKey 
} from '../../shared/model/profile';

// -- Hooks & Services --
import useProfile from '../../hooks/useProfile';

// -- UI Components --
import ProfileSidebar from '../../components/share-profile/ProfileSidebar';
import {
  AchievementsTab, BasicTab, CollaborateTab, EducationTab,
  ExperienceTab, ProjectsTab, SkillsTab,
} from '../../components/share-profile/ProfileTabs';

// -- Modal Components --
import {
  BasicModal, CollaborateModal, SkillsModal, ProjectsModal,
  ExperienceModal, EducationModal, AchievementsModal
} from '../../components/share-profile/ProfileModals';

// ─────────────────────────────────────────────────────────────
// SECTION 1 — HELPERS & CONSTANTS
// ─────────────────────────────────────────────────────────────

/** Formats ISO dates into "DD Month YYYY" or returns a dash if empty. */
export const formatDate = (d: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};

/** Converts DB_ENUM_STRINGS into "Db Enum Strings" for the UI. */
export const formatLabel = (val: string) => 
  val ? val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—';

/** The navigation structure for the Profile Page tabs. */
const TABS: { key: TabKey; label: string }[] = [
  { key: 'basic', label: 'Basic' }, { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' }, { key: 'collaborate', label: 'Collaborate' },
  { key: 'experience', label: 'Experience' }, { key: 'education', label: 'Education' },
  { key: 'achievements', label: 'Achievements' },
];

/** 
 * BUG FIX: Default Fallbacks 
 * These ensure that even if the backend returns nothing, the modals 
 * have empty strings to show instead of crashing on 'undefined'.
 */
const DEFAULT_BASIC: BasicDetails = {
  firstName: '', lastName: '', mobile: '', gender: 'MALE', 
  devType: 'FRONTEND_DEVELOPER', dateOfBirth: '', email: '', aboutMe: ''
};

const DEFAULT_COLLAB: Collaboration = {
  pitch: '', projectTypes: [], lookingFor: [], 
  availability: 'Full-time', workStyle: 'Remote', timezone: ''
};

// ─────────────────────────────────────────────────────────────
// SECTION 2 — SKELETONS (LOADING/ERROR)
// ─────────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted">Loading profile...</p>
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void; }) => (
  <div className="min-h-screen bg-bg flex items-center justify-center px-4">
    <div className="bg-surface border border-danger-border rounded-2xl p-8 text-center max-w-sm w-full shadow-card">
      <h3 className="text-sm font-bold text-text mb-1">Failed to load profile</h3>
      <p className="text-xs text-secondary mb-4">{message}</p>
      <button onClick={onRetry} className="px-5 py-2.5 rounded-lg bg-accent text-white font-semibold shadow-accent">Try again</button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// SECTION 3 — MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

const Profile = () => {
  // 1. Fetch data and mutation functions from the custom hook
  const { 
    data, loading, saving, error, saveBasic, saveCollaboration, 
    saveSkills, saveProjects, saveExperiences, saveEducations, saveAchievements, refetch 
  } = useProfile();

  // 2. Track which tab is active and which modal is open
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const [editModal, setEditModal] = useState<TabKey | null>(null);

  // 3. Draft states to store temporary edits before the user clicks "Save"
  const [basicDraft, setBasicDraft] = useState<BasicDetails | null>(null);
  const [collaborationDraft, setCollaborationDraft] = useState<Collaboration | null>(null);
  const [skillsDraft, setSkillsDraft] = useState<Skill[] | null>(null);
  const [projectDraft, setProjectDraft] = useState<Project | null>(null);
  const [experienceDraft, setExperienceDraft] = useState<Experience | null>(null);
  const [educationDraft, setEducationDraft] = useState<Education | null>(null);
  const [achievementDraft, setAchievementDraft] = useState<Achievement | null>(null);

  // 4. Handle initial loading state
  if (loading) return <LoadingSkeleton />;

  // 5. BUG FIX: Safe Data Pattern
  // This object ensures that even if 'data' is null, the UI receives empty arrays/objects 
  // instead of crashing. This handles new users with empty profiles.
  const safeData = data || {
    basicDetails: DEFAULT_BASIC,
    collaboration: DEFAULT_COLLAB,
    skills: [],
    projects: [],
    experiences: [],
    educations: [],
    achievements: []
  };

  // 6. Handle error state ONLY if we have no data at all
  if (error && !data) return <ErrorState message={error} onRetry={refetch} />;

  /** Opens the requested modal and populates the draft with existing or default data. */
  const openModal = (tab: TabKey, itemId?: string) => {
    if (tab === 'basic') setBasicDraft({ ...safeData.basicDetails });
    if (tab === 'collaborate') setCollaborationDraft({ ...safeData.collaboration });
    if (tab === 'skills') setSkillsDraft([...(safeData.skills || [])]);
    
    // For lists (Project, Exp, Edu, Ach), find the item by ID for editing or create a new blank one
    if (tab === 'projects') {
      const existing = itemId ? safeData.projects.find(p => p.id === itemId) : null;
      setProjectDraft(existing ? { ...existing } : { id: Date.now().toString(), name: '', description: '', techStack: [], role: 'Solo', status: 'In Progress', githubUrl: '', liveUrl: '', lookingFor: [] });
    }
    if (tab === 'experience') {
      const existing = itemId ? safeData.experiences.find(e => e.id === itemId) : null;
      setExperienceDraft(existing ? { ...existing } : { id: Date.now().toString(), company: '', role: '', type: 'Full-time', startDate: '', endDate: '', description: '' });
    }
    if (tab === 'education') {
      const existing = itemId ? safeData.educations.find(e => e.id === itemId) : null;
      setEducationDraft(existing ? { ...existing } : { id: Date.now().toString(), institution: '', degree: '', type: 'Degree', startYear: '', endYear: '', link: '' });
    }
    if (tab === 'achievements') {
      const existing = itemId ? safeData.achievements.find(a => a.id === itemId) : null;
      setAchievementDraft(existing ? { ...existing } : { id: Date.now().toString(), title: '', type: 'Hackathon', date: '', description: '', link: '' });
    }
    setEditModal(tab);
  };

  /** Resets all modal and draft states (Cancellation) */
  const closeModal = () => {
    setEditModal(null); setBasicDraft(null); setCollaborationDraft(null); setSkillsDraft(null);
    setProjectDraft(null); setExperienceDraft(null); setEducationDraft(null); setAchievementDraft(null);
  };

  // -- SAVE HANDLERS (Delegates to useProfile hook and closes modal) --
  const handleSaveBasic = async () => { if (basicDraft) await saveBasic(basicDraft); closeModal(); };
  const handleSaveCollaboration = async () => { if (collaborationDraft) await saveCollaboration(collaborationDraft); closeModal(); };
  const handleSaveSkills = async () => { if (skillsDraft) await saveSkills(skillsDraft); closeModal(); };

  // -- ARRAY SAVE HANDLERS (Upsert Logic: Updates existing ID or appends new item) --
  const handleSaveProject = async () => {
    if (!projectDraft) return;
    const items = safeData.projects;
    const exists = items.some(i => i.id === projectDraft.id);
    const updated = exists ? items.map(i => i.id === projectDraft.id ? projectDraft : i) : [...items, projectDraft];
    await saveProjects(updated); closeModal();
  };

  const handleSaveExperience = async () => {
    if (!experienceDraft) return;
    const items = safeData.experiences;
    const exists = items.some(i => i.id === experienceDraft.id);
    const updated = exists ? items.map(i => i.id === experienceDraft.id ? experienceDraft : i) : [...items, experienceDraft];
    await saveExperiences(updated); closeModal();
  };

  const handleSaveEducation = async () => {
    if (!educationDraft) return;
    const items = safeData.educations;
    const exists = items.some(i => i.id === educationDraft.id);
    const updated = exists ? items.map(i => i.id === educationDraft.id ? educationDraft : i) : [...items, educationDraft];
    await saveEducations(updated); closeModal();
  };

  const handleSaveAchievement = async () => {
    if (!achievementDraft) return;
    const items = safeData.achievements;
    const exists = items.some(i => i.id === achievementDraft.id);
    const updated = exists ? items.map(i => i.id === achievementDraft.id ? achievementDraft : i) : [...items, achievementDraft];
    await saveAchievements(updated); closeModal();
  };

  return (
    <div className="min-h-screen bg-bg transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text">My Profile</h1>
            <p className="text-sm text-secondary mt-1">Manage your personal information</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-2 shadow-card">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs font-semibold text-text">Profile Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Section (Uses safeData) */}
          <ProfileSidebar basic={safeData.basicDetails} formatDate={formatDate} formatLabel={formatLabel} />

          {/* Tab Content Section (Uses safeData) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="overflow-x-auto pb-1">
              <div className="flex gap-1 bg-raised border border-border rounded-xl p-1 w-fit">
                {TABS.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.key ? 'bg-surface text-accent shadow-card' : 'text-secondary hover:text-text'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Tab Content - Each tab will show its EmptyState automatically if list is empty */}
            {activeTab === 'basic' && <BasicTab basic={safeData.basicDetails} formatDate={formatDate} formatLabel={formatLabel} onEdit={() => openModal('basic')} />}
            {activeTab === 'skills' && <SkillsTab skills={safeData.skills} onEdit={() => openModal('skills')} />}
            {activeTab === 'projects' && <ProjectsTab projects={safeData.projects} onAdd={() => openModal('projects')} onEdit={(id) => openModal('projects', id)} />}
            {activeTab === 'collaborate' && <CollaborateTab collaboration={safeData.collaboration} onEdit={() => openModal('collaborate')} />}
            {activeTab === 'experience' && <ExperienceTab experiences={safeData.experiences} onAdd={() => openModal('experience')} onEdit={(id) => openModal('experience', id)} />}
            {activeTab === 'education' && <EducationTab educations={safeData.educations} onAdd={() => openModal('education')} onEdit={(id) => openModal('education', id)} />}
            {activeTab === 'achievements' && <AchievementsTab achievements={safeData.achievements} formatDate={formatDate} onAdd={() => openModal('achievements')} onEdit={(id) => openModal('achievements', id)} />}
          </div>
        </div>
      </div>

      {/* MODALS - Mount only when a draft is active */}
      {basicDraft && <BasicModal isOpen={editModal === 'basic'} onClose={closeModal} onSave={handleSaveBasic} saving={saving} draft={basicDraft} setDraft={setBasicDraft} />}
      {collaborationDraft && <CollaborateModal isOpen={editModal === 'collaborate'} onClose={closeModal} onSave={handleSaveCollaboration} saving={saving} draft={collaborationDraft} setDraft={setCollaborationDraft} />}
      {skillsDraft && <SkillsModal isOpen={editModal === 'skills'} onClose={closeModal} onSave={handleSaveSkills} saving={saving} draft={skillsDraft} setDraft={setSkillsDraft} />}
      {projectDraft && <ProjectsModal isOpen={editModal === 'projects'} onClose={closeModal} onSave={handleSaveProject} saving={saving} draft={projectDraft} setDraft={setProjectDraft} />}
      {experienceDraft && <ExperienceModal isOpen={editModal === 'experience'} onClose={closeModal} onSave={handleSaveExperience} saving={saving} draft={experienceDraft} setDraft={setExperienceDraft} />}
      {educationDraft && <EducationModal isOpen={editModal === 'education'} onClose={closeModal} onSave={handleSaveEducation} saving={saving} draft={educationDraft} setDraft={setEducationDraft} />}
      {achievementDraft && <AchievementsModal isOpen={editModal === 'achievements'} onClose={closeModal} onSave={handleSaveAchievement} saving={saving} draft={achievementDraft} setDraft={setAchievementDraft} />}
    </div>
  );
};

export default Profile;