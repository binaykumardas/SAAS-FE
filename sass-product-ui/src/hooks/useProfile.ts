/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import {
  fetchProfile, updateBasicDetails, updateCollaboration,
  updateSkills, updateProjects,
  updateExperiences, updateEducations, updateAchievements, // ✅ Assumes these exist in your profileService
  type ProfileData,
} from '../services/profileService';
import type { BasicDetails, Collaboration, Skill, Project, Experience, Education, Achievement } from '../shared/model/profile';

interface UseProfileReturn {
  data: ProfileData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;

  saveBasic: (draft: BasicDetails) => Promise<void>;
  saveCollaboration: (draft: Collaboration) => Promise<void>;
  saveSkills: (skills: Skill[]) => Promise<void>;
  saveProjects: (projects: Project[]) => Promise<void>;
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

  const loadProfile = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await fetchProfile();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const saveBasic = async (draft: BasicDetails) => {
    setSaving(true); setError(null);
    try {
      const updated = await updateBasicDetails(draft);
      setData(prev => prev ? { ...prev, basicDetails: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  const saveCollaboration = async (draft: Collaboration) => {
    setSaving(true); setError(null);
    try {
      const updated = await updateCollaboration(draft);
      setData(prev => prev ? { ...prev, collaboration: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  const saveSkills = async (skills: Skill[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateSkills(skills as any)) as unknown as Skill[];
      setData(prev => prev ? { ...prev, skills: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  const saveProjects = async (projects: Project[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateProjects(projects as any)) as unknown as Project[];
      setData(prev => prev ? { ...prev, projects: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  const saveExperiences = async (experiences: Experience[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateExperiences(experiences as any)) as unknown as Experience[];
      setData(prev => prev ? { ...prev, experiences: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  const saveEducations = async (educations: Education[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateEducations(educations as any)) as unknown as Education[];
      setData(prev => prev ? { ...prev, educations: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  const saveAchievements = async (achievements: Achievement[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateAchievements(achievements as any)) as unknown as Achievement[];
      setData(prev => prev ? { ...prev, achievements: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  return {
    data, loading, saving, error,
    saveBasic, saveCollaboration, saveSkills, saveProjects, saveExperiences, saveEducations, saveAchievements, refetch: loadProfile,
  };
};

export default useProfile;