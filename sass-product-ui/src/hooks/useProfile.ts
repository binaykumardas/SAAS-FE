// src/hooks/useProfile.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchProfile, updateBasicDetails, updateCollaboration,
  updateSkills, saveProjectEntry, updateExperiences, 
  updateEducations, updateAchievements, type ProfileData,
} from '../services/profileService';
import type { 
  BasicDetails, Collaboration, Skill, Project, 
  Experience, Education, Achievement 
} from '../shared/model/profile';

interface UseProfileReturn {
  data: ProfileData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveBasic: (draft: BasicDetails) => Promise<void>;
  saveCollaboration: (draft: Collaboration) => Promise<void>;
  saveSkills: (skills: Skill[]) => Promise<void>;
  saveProject: (draft: Project) => Promise<void>; // Updated to handle a single project
  saveExperiences: (experiences: Experience[]) => Promise<void>;
  saveEducations: (educations: Education[]) => Promise<void>;
  saveAchievements: (achievements: Achievement[]) => Promise<void>;
  refetch: () => void;
}

const useProfile = (): UseProfileReturn => {
  const [data, setData] = useState<ProfileData | null>(null);
  const[loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  const loadProfile = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await fetchProfile();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally { setLoading(false); }
  },[]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadProfile();
    }
  },[loadProfile]);

  const saveBasic = async (draft: BasicDetails) => {
    setSaving(true); setError(null);
    try {
      const updated = await updateBasicDetails(draft);
      setData(prev => prev ? { ...prev, basicDetails: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  const saveCollaboration = async (draft: Collaboration) => {
    setSaving(true); setError(null);
    try {
      const updated = await updateCollaboration(draft);
      setData(prev => prev ? { ...prev, collaboration: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  const saveSkills = async (skills: Skill[]) => {
    setSaving(true); setError(null);
    try {
      const updated = await updateSkills(skills);
      setData(prev => prev ? { ...prev, skills: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  /**
   * @description saveProject Handler
   * Evaluates if a project is new (POST) or existing (PUT) based on the ID.
   * Modifies the local state array seamlessly without re-fetching all profile data.
   */
  const saveProject = async (draft: Project) => {
    setSaving(true); setError(null);
    try {
      const isNew = !data?.projects?.some(p => p.id === draft.id);
      const savedProject = await saveProjectEntry(draft, isNew);
      
      setData(prev => {
        if (!prev) return prev;
        const items = prev.projects || [];
        const updated = isNew 
          ?[...items, savedProject] // Add the new DB-persisted project
          : items.map(i => i.id === draft.id ? savedProject : i); // Update existing
        
        return { ...prev, projects: updated };
      });
    } catch (err) { 
      setError(err instanceof Error ? err.message : 'Failed to save project');
      throw err; // Rethrow to prevent closing modal if API fails
    } finally { 
      setSaving(false); 
    }
  };

  // Remaining array upsert functions (assuming mock behaviors for now)
  const saveExperiences = async (experiences: Experience[]) => {
    setSaving(true); setError(null);
    try {
      const updated = await updateExperiences(experiences);
      setData(prev => prev ? { ...prev, experiences: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  const saveEducations = async (educations: Education[]) => {
    setSaving(true); setError(null);
    try {
      const updated = await updateEducations(educations);
      setData(prev => prev ? { ...prev, educations: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  const saveAchievements = async (achievements: Achievement[]) => {
    setSaving(true); setError(null);
    try {
      const updated = await updateAchievements(achievements);
      setData(prev => prev ? { ...prev, achievements: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  return {
    data, loading, saving, error,
    saveBasic, saveCollaboration, saveSkills, saveProject, 
    saveExperiences, saveEducations, saveAchievements, refetch: loadProfile,
  };
};

export default useProfile;