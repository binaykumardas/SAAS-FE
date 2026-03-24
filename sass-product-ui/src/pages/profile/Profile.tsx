/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// src/pages/Profile.tsx
import { useState } from 'react';
import type { 
  BasicDetails, Collaboration, Skill, Project, 
  Experience, Education, Achievement, TabKey 
} from '../../shared/model/profile';
import useProfile from '../../hooks/useProfile';
import ProfileSidebar from '../../components/share-profile/ProfileSidebar';
import {
  AchievementsTab, BasicTab, CollaborateTab, EducationTab,
  ExperienceTab, ProjectsTab, SkillsTab,
} from '../../components/share-profile/ProfileTabs';
import {
  BasicModal, CollaborateModal, SkillsModal, ProjectsModal,
  ExperienceModal, EducationModal, AchievementsModal
} from '../../components/share-profile/ProfileModals';
import Util from '../../shared/utils/utils';

export const formatDate = (d: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};

export const formatLabel = (val: string) => 
  val ? val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—';

const TABS: { key: TabKey; label: string }[] =[
  { key: 'basic', label: 'Basic' }, { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' }, { key: 'collaborate', label: 'Collaborate' },
  { key: 'experience', label: 'Experience' }, { key: 'education', label: 'Education' },
  { key: 'achievements', label: 'Achievements' },
];

const DEFAULT_BASIC: BasicDetails = { firstName: '', lastName: '', mobile: '', gender: 'MALE', devType: 'FRONTEND_DEVELOPER', dateOfBirth: '', email: '', aboutMe: '' };
const DEFAULT_COLLAB: Collaboration = { pitch: '', projectTypes: [], lookingFor:[], availability: 'Full-time', workStyle: 'Remote', timezone: '' };

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

const Profile = () => {
  const { 
    data, loading, saving, error, saveBasic, saveCollaboration, 
    saveSkills, saveProject, saveExperience, saveEducation, saveAchievement, refetch 
  } = useProfile();

  const[activeTab, setActiveTab] = useState<TabKey>('basic');
  const [editModal, setEditModal] = useState<TabKey | null>(null);

  const [basicDraft, setBasicDraft] = useState<BasicDetails | null>(null);
  const [collaborationDraft, setCollaborationDraft] = useState<Collaboration | null>(null);
  const [skillsDraft, setSkillsDraft] = useState<Skill[] | null>(null);
  const [projectDraft, setProjectDraft] = useState<Project | null>(null);
  const [experienceDraft, setExperienceDraft] = useState<Experience | null>(null);
  const[educationDraft, setEducationDraft] = useState<Education | null>(null);
  const [achievementDraft, setAchievementDraft] = useState<Achievement | null>(null);

  if (loading) return <LoadingSkeleton />;

  const safeData = data || {
    basicDetails: DEFAULT_BASIC, collaboration: DEFAULT_COLLAB,
    skills:[], projects: [], experiences: [], educations: [], achievements:[]
  };

  if (error && !data) return <ErrorState message={error} onRetry={refetch} />;

  const openModal = (tab: TabKey, itemId?: string) => {
    if (tab === 'basic') setBasicDraft({ ...safeData.basicDetails });
    if (tab === 'collaborate') setCollaborationDraft({ ...safeData.collaboration });
    if (tab === 'skills') setSkillsDraft([...(safeData.skills || [])]);
    
    if (tab === 'projects') {
      const existing = itemId ? safeData.projects.find(p => p.id === itemId) : null;
      setProjectDraft(existing ? { ...existing } : { id: Date.now().toString(), name: '', description: '', techStack:[], role: 'Solo', status: 'In Progress', githubUrl: '', liveUrl: '', lookingFor:[] });
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

  const closeModal = () => {
    setEditModal(null); setBasicDraft(null); setCollaborationDraft(null); setSkillsDraft(null);
    setProjectDraft(null); setExperienceDraft(null); setEducationDraft(null); setAchievementDraft(null);
  };

  const handleSaveBasic = async () => {
     if (basicDraft) 
      await saveBasic(basicDraft); 
      await refetch();
     closeModal(); 
    };


  const handleSaveCollaboration = async () => { if (collaborationDraft) 
    await saveCollaboration(collaborationDraft); 
    await refetch();
    closeModal(); 
  };


  const handleSaveSkills = async () => {
    if(!skillsDraft) return;
    try {
      await saveSkills(skillsDraft); 
      console.log('skillsDraft',skillsDraft);
      if(Util.isValidArray(skillsDraft)) {
          await refetch();
          closeModal(); 
      }
    } catch(e) {
        console.error('Error saving. Kept modal open.');
    }
  };

  // Delegates fully to useProfile logic (which handles PUT vs POST based on existing IDs)
  const handleSaveProject = async () => {
    if (!projectDraft) return;
    try {
      await saveProject(projectDraft);
      await refetch();
      closeModal();
    } catch (e) { console.error('Error saving. Kept modal open.'); }
  };

  const handleSaveExperience = async () => {
    if (!experienceDraft) return;
    try {
      await saveExperience(experienceDraft);
      await refetch();
      closeModal(); // Only closes if API call succeeds
    } catch (e) {
      console.error('Error saving experience. Kept modal open.');
    }
  };

  const handleSaveEducation = async () => {
    if (!educationDraft) return;
    try {
      await saveEducation(educationDraft);
      await refetch();
      closeModal(); // Only closes if the POST call succeeds
    } catch (e) {
      console.error('Error saving education. Kept modal open.');
    }
  };

  const handleSaveAchievement = async () => {
    if (!achievementDraft) return;

    // VALIDATION: Prevent saving if title is blank (prevents 500 DB errors)
    if (!achievementDraft.title.trim()) {
      alert("Achievement Title is required!");
      return;
    }

    try {
      await saveAchievement(achievementDraft);
      await refetch();
      closeModal(); // Only closes if the POST call succeeds
    } catch (e) {
      console.error('Error saving achievement. Kept modal open.');
    }
  };

  return (
    <div className="min-h-screen bg-bg transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text">My Profile</h1>
            <p className="text-sm text-secondary mt-1">
              Manage your personal information
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-2 shadow-card">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs font-semibold text-text">
              Profile Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileSidebar
            basic={safeData.basicDetails}
            formatDate={formatDate}
            formatLabel={formatLabel}
          />

          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="overflow-x-auto pb-1">
              <div className="flex gap-1 bg-raised border border-border rounded-xl p-1 w-fit">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.key ? "bg-surface text-accent shadow-card" : "text-secondary hover:text-text"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "basic" && (
              <BasicTab
                basic={safeData.basicDetails}
                formatDate={formatDate}
                formatLabel={formatLabel}
                onEdit={() => openModal("basic")}
              />
            )}
            {activeTab === "skills" && (
              <SkillsTab
                skills={safeData.skills}
                onEdit={() => openModal("skills")}
              />
            )}
            {activeTab === "projects" && (
              <ProjectsTab
                projects={safeData.projects}
                onAdd={() => openModal("projects")}
                onEdit={(id) => openModal("projects", id)}
              />
            )}
            {activeTab === "collaborate" && (
              <CollaborateTab
                collaboration={safeData.collaboration}
                onEdit={() => openModal("collaborate")}
              />
            )}
            {activeTab === "experience" && (
              <ExperienceTab
                experiences={safeData.experiences}
                onAdd={() => openModal("experience")}
                onEdit={(id) => openModal("experience", id)}
              />
            )}
            {activeTab === "education" && (
              <EducationTab
                educations={safeData.educations}
                onAdd={() => openModal("education")}
                onEdit={(id) => openModal("education", id)}
              />
            )}
            {activeTab === "achievements" && (
              <AchievementsTab
                achievements={safeData.achievements}
                formatDate={formatDate}
                onAdd={() => openModal("achievements")}
                onEdit={(id) => openModal("achievements", id)}
              />
            )}
          </div>
        </div>
      </div>

      {basicDraft && (
        <BasicModal
          isOpen={editModal === "basic"}
          onClose={closeModal}
          onSave={handleSaveBasic}
          saving={saving}
          draft={basicDraft}
          setDraft={setBasicDraft}
        />
      )}
      {collaborationDraft && (
        <CollaborateModal
          isOpen={editModal === "collaborate"}
          onClose={closeModal}
          onSave={handleSaveCollaboration}
          saving={saving}
          draft={collaborationDraft}
          setDraft={setCollaborationDraft}
        />
      )}
      {skillsDraft && (
        <SkillsModal
          isOpen={editModal === "skills"}
          onClose={closeModal}
          onSave={handleSaveSkills}
          saving={saving}
          draft={skillsDraft}
          setDraft={setSkillsDraft}
        />
      )}
      {projectDraft && (
        <ProjectsModal
          isOpen={editModal === "projects"}
          onClose={closeModal}
          onSave={handleSaveProject}
          saving={saving}
          draft={projectDraft}
          setDraft={setProjectDraft}
        />
      )}
      {experienceDraft && (
        <ExperienceModal
          isOpen={editModal === "experience"}
          onClose={closeModal}
          onSave={handleSaveExperience}
          saving={saving}
          draft={experienceDraft}
          setDraft={setExperienceDraft}
        />
      )}
      {educationDraft && (
        <EducationModal
          isOpen={editModal === "education"}
          onClose={closeModal}
          onSave={handleSaveEducation}
          saving={saving}
          draft={educationDraft}
          setDraft={setEducationDraft}
        />
      )}
      {achievementDraft && (
        <AchievementsModal
          isOpen={editModal === "achievements"}
          onClose={closeModal}
          onSave={handleSaveAchievement}
          saving={saving}
          draft={achievementDraft}
          setDraft={setAchievementDraft}
        />
      )}
    </div>
  );
};

export default Profile;