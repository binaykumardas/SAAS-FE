// src/hooks/useProfile.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchProfile, updateBasicDetails, updateCollaboration,
  updateSkills, saveProjectEntry, saveExperienceEntry, type ProfileData,
  saveEducationEntry,
  saveAchievementEntry,
  profileCompletion,
} from '../services/profileService';
import type { 
  BasicDetails, Collaboration, Skill, Project, 
  Experience, Education, Achievement 
} from '../shared/model/profile';

interface UseProfileReturn {
  data: ProfileData | null;
  completionPercentage: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveBasic: (draft: BasicDetails) => Promise<void>;
  saveCollaboration: (draft: Collaboration) => Promise<void>;
  saveSkills: (skills: Skill[]) => Promise<void>;
  saveProject: (draft: Project) => Promise<void>; // Updated to handle a single project
  saveExperience: (draft: Experience) => Promise<void>;
  saveEducation: (educations: Education) => Promise<void>;
  saveAchievement: (achievements: Achievement) => Promise<void>;
  refetch: () => void;
}

const useProfile = (): UseProfileReturn => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const[loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  const refreshCompletion = async () => {
    const compData = await profileCompletion();
    if (compData && typeof compData.percentage === 'number') {
      setCompletionPercentage(compData.percentage);
    }
  };

  const loadProfile = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      refreshCompletion();
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

/**
   * @description saveExperience Handler
   * Evaluates if an experience is new (POST) or existing (PUT).
   */
  const saveExperience = async (draft: Experience) => {
    setSaving(true); setError(null);
    try {
      // 1. Check if it's new by looking for its ID in our existing state
      const isNew = !data?.experiences?.some(e => e.id === draft.id);
      
      // 2. Make the API Call
      const savedExperience = await saveExperienceEntry(draft, isNew);
      
      // 3. Update the local UI state array
      setData(prev => {
        if (!prev) return prev;
        const items = prev.experiences ||[];
        const updated = isNew 
          ? [...items, savedExperience] // Add the new DB-persisted experience
          : items.map(i => i.id === draft.id ? savedExperience : i); // Update existing
        
        return { ...prev, experiences: updated };
      });
    } catch (err) { 
      setError(err instanceof Error ? err.message : 'Failed to save experience');
      throw err; // Rethrow to prevent closing modal if API fails
    } finally { 
      setSaving(false); 
    }
  };

  /**
   * @description saveEducation Handler
   * Strictly calls the POST API and updates the UI state.
   */
  const saveEducation = async (draft: Education) => {
    setSaving(true); setError(null);
    try {
      // 1. Make the API Call (POST Only)
      const savedEducation = await saveEducationEntry(draft);
      
      // 2. Update the local UI state array
      setData(prev => {
        if (!prev) return prev;
        const items = prev.educations ||[];
        
        // Safety check: If backend POST acts as an upsert and returns an existing ID, update it.
        // Otherwise, just add the newly created education to the list.
        const exists = items.some(i => i.id === savedEducation.id);
        const updated = exists 
          ? items.map(i => i.id === savedEducation.id ? savedEducation : i) 
          : [...items, savedEducation];
        
        return { ...prev, educations: updated };
      });
    } catch (err) { 
      setError(err instanceof Error ? err.message : 'Failed to save education');
      throw err; // Rethrow to prevent closing modal if API fails
    } finally { 
      setSaving(false); 
    }
  };

  /**
   * @description saveAchievement Handler
   * Strictly calls the POST API and updates the UI state.
   */
  const saveAchievement = async (draft: Achievement) => {
    setSaving(true); setError(null);
    try {
      // 1. Make the API Call (POST Only)
      const savedAchievement = await saveAchievementEntry(draft);
      
      // 2. Update the local UI state array
      setData(prev => {
        if (!prev) return prev;
        const items = prev.achievements ||[];
        
        // Safety check: If backend POST acts as an upsert and returns an existing ID, update it.
        // Otherwise, just append the newly created achievement to the list.
        const exists = items.some(i => i.id === savedAchievement.id);
        const updated = exists 
          ? items.map(i => i.id === savedAchievement.id ? savedAchievement : i) 
          : [...items, savedAchievement];
        
        return { ...prev, achievements: updated };
      });
    } catch (err) { 
      setError(err instanceof Error ? err.message : 'Failed to save achievement');
      throw err; // Rethrow to prevent closing modal if API fails
    } finally { 
      setSaving(false); 
    }
  };

  return {
    data,completionPercentage, loading, saving, error,
    saveBasic, saveCollaboration, saveSkills, saveProject, 
    saveExperience, saveEducation, saveAchievement, refetch: loadProfile
  };
};

export default useProfile;