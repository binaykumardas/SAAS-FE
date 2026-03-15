/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import {
  fetchProfile,
  updateBasicDetails,
  updateCollaboration,
  updateSkills,
  updateProjects, // ✅ Make sure this exists in profileService.ts
  type ProfileData,
} from '../services/profileService';
import type { BasicDetails, Collaboration, Skill, Project } from '../shared/model/profile'; // ✅ Import Project

interface UseProfileReturn {
  data:    ProfileData | null;
  loading: boolean;
  saving:  boolean;
  error:   string | null;

  saveBasic:         (draft: BasicDetails)  => Promise<void>;
  saveCollaboration: (draft: Collaboration) => Promise<void>;
  saveSkills:        (skills: Skill[]) => Promise<void>;
  saveProjects:      (projects: Project[]) => Promise<void>; // ✅ New Projects function
  refetch:           () => void;
}

const useProfile = (): UseProfileReturn => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const[error, setError] = useState<string | null>(null);

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
  },[]);

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

  // ✅ New function to save Projects array
  const saveProjects = async (projects: Project[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateProjects(projects as any)) as unknown as Project[];
      setData(prev => prev ? { ...prev, projects: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  return {
    data, loading, saving, error,
    saveBasic, saveCollaboration, saveSkills, saveProjects, refetch: loadProfile,
  };
};

export default useProfile;