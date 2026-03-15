/* eslint-disable react-refresh/only-export-components */
/**
 * @file Profile.tsx
 * @location src/pages/Profile.tsx
 */

import { useState } from 'react';
import type { BasicDetails, Collaboration, Skill, Project, TabKey } from '../../shared/model/profile'; // ✅ Import Project
import useProfile from '../../hooks/useProfile';
import ProfileSidebar from '../../components/share-profile/ProfileSidebar';

import {
  AchievementsTab, BasicTab, CollaborateTab, EducationTab,
  ExperienceTab, ProjectsTab, SkillsTab,
} from '../../components/share-profile/ProfileTabs';

import {
  BasicModal, CollaborateModal, SkillsModal, ProjectsModal, ComingSoonModal, // ✅ Import ProjectsModal
} from '../../components/share-profile/ProfileModals';

export const formatDate = (d: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};
export const formatLabel = (val: string) => val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const TABS: { key: TabKey; label: string }[] =[
  { key: 'basic', label: 'Basic' }, { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' }, { key: 'collaborate', label: 'Collaborate' },
  { key: 'experience', label: 'Experience' }, { key: 'education', label: 'Education' },
  { key: 'achievements', label: 'Achievements' },
];

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
      <div className="w-12 h-12 rounded-xl bg-danger-bg flex items-center justify-center mx-auto mb-4">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="text-danger">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-sm font-bold text-text mb-1">Failed to load profile</h3>
      <p className="text-xs text-secondary mb-4">{message}</p>
      <button onClick={onRetry} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-accent hover:bg-accent-hover text-white shadow-accent transition-all duration-150">
        Try again
      </button>
    </div>
  </div>
);

const Profile = () => {
  const { data, loading, saving, error, saveBasic, saveCollaboration, saveSkills, saveProjects, refetch } = useProfile(); // ✅ Destructure saveProjects

  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const[editModal, setEditModal] = useState<TabKey | null>(null);

  const[basicDraft, setBasicDraft] = useState<BasicDetails | null>(null);
  const [collaborationDraft, setCollaborationDraft] = useState<Collaboration | null>(null);
  const [skillsDraft, setSkillsDraft] = useState<Skill[] | null>(null); 
  const [projectDraft, setProjectDraft] = useState<Project | null>(null); // ✅ New state for a SINGLE new project draft

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState message={error ?? 'No data'} onRetry={refetch} />;

  const openModal = (tab: TabKey) => {
    if (tab === 'basic')       setBasicDraft({ ...data.basicDetails });
    if (tab === 'collaborate') setCollaborationDraft({ ...data.collaboration });
    if (tab === 'skills')      setSkillsDraft([...(data.skills || [])]); 
    // ✅ Initialize a blank new project when opening the Projects modal
    if (tab === 'projects')    setProjectDraft({
      id: Date.now().toString(), name: '', description: '', techStack:[], role: 'Solo', status: 'In Progress', githubUrl: '', liveUrl: '', lookingFor:[]
    });
    
    setEditModal(tab);
  };

  const closeModal = () => {
    setEditModal(null);
    setBasicDraft(null);
    setCollaborationDraft(null);
    setSkillsDraft(null);
    setProjectDraft(null); // ✅ Reset project draft
  };

  const handleSaveBasic = async () => {
    if (!basicDraft) return;
    if (saveBasic) await saveBasic(basicDraft);
    closeModal();
  };

  const handleSaveCollaboration = async () => {
    if (!collaborationDraft) return;
    if (saveCollaboration) await saveCollaboration(collaborationDraft);
    closeModal();
  };

  const handleSaveSkills = async () => {
    if (!skillsDraft) return;
    if (saveSkills) await saveSkills(skillsDraft); 
    closeModal();
  };

  // ✅ New Handler: Appends the new project to the array and saves
  const handleSaveProject = async () => {
    if (!projectDraft) return;
    const currentProjects = data.projects || [];
    const updatedProjects = [...currentProjects, projectDraft];
    if (saveProjects) await saveProjects(updatedProjects);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-bg transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileSidebar basic={data.basicDetails} formatDate={formatDate} formatLabel={formatLabel} />

          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="overflow-x-auto pb-1">
              <div className="flex gap-1 bg-raised border border-border rounded-xl p-1 w-fit">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150
                      ${activeTab === tab.key ? 'bg-surface text-accent border border-border shadow-card' : 'text-secondary hover:text-text'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'basic' && <BasicTab basic={data.basicDetails} formatDate={formatDate} formatLabel={formatLabel} onEdit={() => openModal('basic')} />}
            {activeTab === 'skills' && <SkillsTab skills={data.skills} onEdit={() => openModal('skills')} />}
            {activeTab === 'projects' && <ProjectsTab projects={data.projects} onAdd={() => openModal('projects')} />}
            {activeTab === 'collaborate' && <CollaborateTab collaboration={data.collaboration} onEdit={() => openModal('collaborate')} />}
            {activeTab === 'experience' && <ExperienceTab experiences={data.experiences} onAdd={() => openModal('experience')} />}
            {activeTab === 'education' && <EducationTab educations={data.educations} onAdd={() => openModal('education')} />}
            {activeTab === 'achievements' && <AchievementsTab achievements={data.achievements} formatDate={formatDate} onAdd={() => openModal('achievements')} />}
          </div>
        </div>
      </div>

      {basicDraft && <BasicModal isOpen={editModal === 'basic'} onClose={closeModal} onSave={handleSaveBasic} saving={saving} draft={basicDraft} setDraft={setBasicDraft} />}
      {collaborationDraft && <CollaborateModal isOpen={editModal === 'collaborate'} onClose={closeModal} onSave={handleSaveCollaboration} saving={saving} draft={collaborationDraft} setDraft={setCollaborationDraft} />}
      {skillsDraft && <SkillsModal isOpen={editModal === 'skills'} onClose={closeModal} onSave={handleSaveSkills} saving={saving} draft={skillsDraft} setDraft={setSkillsDraft} />}
      
      {/* ✅ Render the new ProjectsModal */}
      {projectDraft && <ProjectsModal isOpen={editModal === 'projects'} onClose={closeModal} onSave={handleSaveProject} saving={saving} draft={projectDraft} setDraft={setProjectDraft} />}
      
      <ComingSoonModal editModal={editModal} onClose={closeModal} />
    </div>
  );
};

export default Profile;