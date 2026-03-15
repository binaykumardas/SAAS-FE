/* eslint-disable react-refresh/only-export-components */
/**
 * @file Profile.tsx
 * @location src/pages/Profile.tsx
 *
 * @description
 * Main Profile page component. It acts as the central orchestrator for the profile page.
 * It manages data fetching, controls which tab is active, and handles the complex 
 * "Draft Pattern" state required for editing and adding new profile entries.
 *
 * @architecture
 * 1. Data Fetching: Relies on `useProfile` to interact with the backend API.
 * 2. Draft Pattern: Before sending data to a modal, it creates a "Draft" (a copy).
 *    This ensures that if a user clicks "Cancel", the original data remains untouched.
 * 3. Upsert Logic: For lists (Projects, Experience, etc.), it uses a single Save handler
 *    to determine if it should UPDATE an existing item or INSERT a new one.
 */

// ── React core imports ─────────────────────────────────────────
import { useState } from 'react';

// ── TypeScript Type Imports ───────────────────────────────────
import type { 
  BasicDetails, Collaboration, Skill, Project, 
  Experience, Education, Achievement, TabKey 
} from '../../shared/model/profile';

// ── Hooks & Services ──────────────────────────────────────────
import useProfile from '../../hooks/useProfile';

// ── UI Components ─────────────────────────────────────────────
import ProfileSidebar from '../../components/share-profile/ProfileSidebar';
import {
  AchievementsTab, BasicTab, CollaborateTab, EducationTab,
  ExperienceTab, ProjectsTab, SkillsTab,
} from '../../components/share-profile/ProfileTabs';

// ── Modal Components ──────────────────────────────────────────
import {
  BasicModal, CollaborateModal, SkillsModal, ProjectsModal,
  ExperienceModal, EducationModal, AchievementsModal
} from '../../components/share-profile/ProfileModals';


// ─────────────────────────────────────────────────────────────
// SECTION 1 — HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Formats an ISO date string into a readable format.
 * @param {string} d - The date string (e.g., "2023-01-01")
 * @returns {string} Formatted date (e.g., "01 January 2023") or an em-dash if empty.
 */
export const formatDate = (d: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};

/**
 * Converts uppercase enum values from the API into human-readable labels.
 * @param {string} val - The raw value (e.g., "FULL_STACK_DEVELOPER")
 * @returns {string} Formatted label (e.g., "Full Stack Developer")
 */
export const formatLabel = (val: string) => 
  val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());


// ─────────────────────────────────────────────────────────────
// SECTION 2 — CONSTANTS
// ─────────────────────────────────────────────────────────────

/**
 * TABS defines the navigation structure. Defined outside the component 
 * so it isn't recreated on every single render.
 */
const TABS: { key: TabKey; label: string }[] =[
  { key: 'basic', label: 'Basic' }, { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' }, { key: 'collaborate', label: 'Collaborate' },
  { key: 'experience', label: 'Experience' }, { key: 'education', label: 'Education' },
  { key: 'achievements', label: 'Achievements' },
];


// ─────────────────────────────────────────────────────────────
// SECTION 3 — FALLBACK UI COMPONENTS (Loading & Error)
// ─────────────────────────────────────────────────────────────

/** Renders a full-screen spinning loader while initial profile data is fetched. */
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted">Loading profile...</p>
    </div>
  </div>
);

/** Renders a full-screen error card if the API request fails. */
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void; }) => (
  <div className="min-h-screen bg-bg flex items-center justify-center px-4">
    <div className="bg-surface border border-danger-border rounded-2xl p-8 text-center max-w-sm w-full shadow-card">
      <div className="w-12 h-12 rounded-xl bg-danger-bg flex items-center justify-center mx-auto mb-4">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="text-danger">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-sm font-bold text-text mb-1">Failed to load profile</h3>
      <p className="text-xs text-secondary mb-4">{message}</p>
      <button onClick={onRetry} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-accent hover:bg-accent-hover text-white shadow-accent transition-all duration-150">Try again</button>
    </div>
  </div>
);


// ─────────────────────────────────────────────────────────────
// SECTION 4 — MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

const Profile = () => {
  // ── 1. API Hook ─────────────────────────────────────────────
  // Fetches the global data and all mutations/save handlers.
  const { 
    data, loading, saving, error, saveBasic, saveCollaboration, 
    saveSkills, saveProjects, saveExperiences, saveEducations, saveAchievements, refetch 
  } = useProfile();

  // ── 2. UI State ─────────────────────────────────────────────
  // Tracks the currently visible tab and currently open modal.
  const[activeTab, setActiveTab] = useState<TabKey>('basic');
  const[editModal, setEditModal] = useState<TabKey | null>(null);

  // ── 3. Draft States ─────────────────────────────────────────
  // Holds temporary copies of the data while the user is typing in a modal.
  const [basicDraft, setBasicDraft] = useState<BasicDetails | null>(null);
  const [collaborationDraft, setCollaborationDraft] = useState<Collaboration | null>(null);
  const [skillsDraft, setSkillsDraft] = useState<Skill[] | null>(null);
  const [projectDraft, setProjectDraft] = useState<Project | null>(null);
  const[experienceDraft, setExperienceDraft] = useState<Experience | null>(null);
  const [educationDraft, setEducationDraft] = useState<Education | null>(null);
  const [achievementDraft, setAchievementDraft] = useState<Achievement | null>(null);

  // ── 4. Early Returns ────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState message={error ?? 'No data'} onRetry={refetch} />;


  // ─────────────────────────────────────────────────────────
  // SECTION 5 — MODAL & DRAFT HANDLERS
  // ─────────────────────────────────────────────────────────

  /**
   * ✅ SUPERCHARGED OPEN MODAL: Handles both ADDING and EDITING!
   * 
   * @param tab - The name of the tab/modal to open.
   * @param itemId - (Optional) If provided, it finds the existing item and enters "Edit Mode".
   *                 If omitted, it generates a fresh, blank object and enters "Add Mode".
   */
  const openModal = (tab: TabKey, itemId?: string) => {
    // 1. Single-object drafts (Basic Details, Collaborate)
    if (tab === 'basic') setBasicDraft({ ...data.basicDetails });
    if (tab === 'collaborate') setCollaborationDraft({ ...data.collaboration });
    
    // 2. Full-array draft (Skills uses a multi-select pattern inside the modal)
    if (tab === 'skills') setSkillsDraft([...(data.skills || [])]);
    
    // 3. Array-item drafts (Projects, Experience, Education, Achievements)
    if (tab === 'projects') {
      const existing = itemId ? data.projects?.find(p => p.id === itemId) : null;
      setProjectDraft(existing ? { ...existing } : { id: Date.now().toString(), name: '', description: '', techStack:[], role: 'Solo', status: 'In Progress', githubUrl: '', liveUrl: '', lookingFor:[] });
    }
    if (tab === 'experience') {
      const existing = itemId ? data.experiences?.find(e => e.id === itemId) : null;
      setExperienceDraft(existing ? { ...existing } : { id: Date.now().toString(), company: '', role: '', type: 'Full-time', startDate: '', endDate: '', description: '' });
    }
    if (tab === 'education') {
      const existing = itemId ? data.educations?.find(e => e.id === itemId) : null;
      setEducationDraft(existing ? { ...existing } : { id: Date.now().toString(), institution: '', degree: '', type: 'Degree', startYear: '', endYear: '', link: '' });
    }
    if (tab === 'achievements') {
      const existing = itemId ? data.achievements?.find(a => a.id === itemId) : null;
      setAchievementDraft(existing ? { ...existing } : { id: Date.now().toString(), title: '', type: 'Hackathon', date: '', description: '', link: '' });
    }

    // Finally, open the requested modal.
    setEditModal(tab);
  };

  /**
   * Closes all modals and trashes all drafts, effectively cancelling any unsaved edits.
   */
  const closeModal = () => {
    setEditModal(null); setBasicDraft(null); setCollaborationDraft(null); setSkillsDraft(null);
    setProjectDraft(null); setExperienceDraft(null); setEducationDraft(null); setAchievementDraft(null);
  };

  // ── SAVE HANDLERS: Singular Objects ───────────────────────
  const handleSaveBasic = async () => { if (!basicDraft) return; if (saveBasic) await saveBasic(basicDraft); closeModal(); };
  const handleSaveCollaboration = async () => { if (!collaborationDraft) return; if (saveCollaboration) await saveCollaboration(collaborationDraft); closeModal(); };
  const handleSaveSkills = async () => { if (!skillsDraft) return; if (saveSkills) await saveSkills(skillsDraft); closeModal(); };

  // ── SAVE HANDLERS: Arrays (UPSERT LOGIC) ──────────────────
  // These functions update the database. If the drafted item's ID already exists 
  // in the original data, it replaces it. If it doesn't exist, it appends it.

  const handleSaveProject = async () => {
    if (!projectDraft) return;
    const items = data.projects ||[];
    const index = items.findIndex(item => item.id === projectDraft.id);
    const updated = index >= 0 
      ? items.map(item => item.id === projectDraft.id ? projectDraft : item) // Replace existing
      : [...items, projectDraft]; // Append new
    if (saveProjects) await saveProjects(updated);
    closeModal();
  };

  const handleSaveExperience = async () => {
    if (!experienceDraft) return;
    const items = data.experiences ||[];
    const index = items.findIndex(item => item.id === experienceDraft.id);
    const updated = index >= 0 
      ? items.map(item => item.id === experienceDraft.id ? experienceDraft : item) 
      : [...items, experienceDraft];
    if (saveExperiences) await saveExperiences(updated);
    closeModal();
  };

  const handleSaveEducation = async () => {
    if (!educationDraft) return;
    const items = data.educations ||[];
    const index = items.findIndex(item => item.id === educationDraft.id);
    const updated = index >= 0 
      ? items.map(item => item.id === educationDraft.id ? educationDraft : item) 
      : [...items, educationDraft];
    if (saveEducations) await saveEducations(updated);
    closeModal();
  };

  const handleSaveAchievement = async () => {
    if (!achievementDraft) return;
    const items = data.achievements ||[];
    const index = items.findIndex(item => item.id === achievementDraft.id);
    const updated = index >= 0 
      ? items.map(item => item.id === achievementDraft.id ? achievementDraft : item) 
      :[...items, achievementDraft];
    if (saveAchievements) await saveAchievements(updated);
    closeModal();
  };


  // ─────────────────────────────────────────────────────────
  // SECTION 6 — RENDER & UI
  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* ── Top Header Section ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">My Profile</h1>
            <p className="text-sm text-secondary mt-1">Manage your personal information</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-2 shadow-card">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs font-semibold text-text">78% complete</span>
          </div>
        </div>

        {/* ── Main Layout: Sidebar & Content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Fixed Profile details */}
          <ProfileSidebar basic={data.basicDetails} formatDate={formatDate} formatLabel={formatLabel} />

          {/* Right Column: Tab Navigation and Active Tab Content */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            
            {/* Tab Navigation Menu */}
            <div className="overflow-x-auto pb-1">
              <div className="flex gap-1 bg-raised border border-border rounded-xl p-1 w-fit">
                {TABS.map(tab => (
                  <button 
                    key={tab.key} 
                    onClick={() => setActiveTab(tab.key)} 
                    className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${activeTab === tab.key ? 'bg-surface text-accent border border-border shadow-card' : 'text-secondary hover:text-text'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Active Tab Component ── 
                Only the matching tab component mounts. It passes down data, formatting helpers, 
                and triggers the `openModal` function for Adding or Editing (by ID).
            */}
            {activeTab === 'basic' && <BasicTab basic={data.basicDetails} formatDate={formatDate} formatLabel={formatLabel} onEdit={() => openModal('basic')} />}
            {activeTab === 'skills' && <SkillsTab skills={data.skills} onEdit={() => openModal('skills')} />}
            {activeTab === 'projects' && <ProjectsTab projects={data.projects} onAdd={() => openModal('projects')} onEdit={(id) => openModal('projects', id)} />}
            {activeTab === 'collaborate' && <CollaborateTab collaboration={data.collaboration} onEdit={() => openModal('collaborate')} />}
            {activeTab === 'experience' && <ExperienceTab experiences={data.experiences} onAdd={() => openModal('experience')} onEdit={(id) => openModal('experience', id)} />}
            {activeTab === 'education' && <EducationTab educations={data.educations} onAdd={() => openModal('education')} onEdit={(id) => openModal('education', id)} />}
            {activeTab === 'achievements' && <AchievementsTab achievements={data.achievements} formatDate={formatDate} onAdd={() => openModal('achievements')} onEdit={(id) => openModal('achievements', id)} />}
          </div>
        </div>
      </div>

      {/* ── MODALS ── 
          Rendered outside the normal flow (overlays). 
          They only mount if their respective Draft State is populated. 
      */}
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