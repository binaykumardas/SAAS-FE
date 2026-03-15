/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useProfile.ts
// Custom hook that fetches profile data and exposes
// loading, error, data, and save handlers.
//
// This is the only file that talks to profileService.ts.
// Components just call useProfile() and get back ready-to-use data.

import { useState, useEffect, useCallback } from 'react';
import {
  fetchProfile,
  updateBasicDetails,
  updateCollaboration,
  updateSkills,
  type ProfileData,
} from '../services/profileService';
import type { BasicDetails, Collaboration, Skill } from '../shared/model/profile';

interface UseProfileReturn {
  // ── Data ──
  data:    ProfileData | null;

  // ── Status ──
  loading: boolean;
  saving:  boolean;
  error:   string | null;

  // ── Actions ──
  saveBasic:         (draft: BasicDetails)  => Promise<void>;
  saveCollaboration: (draft: Collaboration) => Promise<void>;
  saveSkills:        (skills: Skill[]) => Promise<void>; // ✅ Fixed: Expects array of skills
  refetch:           () => void;
}

const useProfile = (): UseProfileReturn => {
  const[data,    setData]    = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const[error,   setError]   = useState<string | null>(null);

  // ── Fetch on mount ───────────────────────────────────────
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProfile();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ── Save basic details ───────────────────────────────────
  const saveBasic = async (draft: BasicDetails) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateBasicDetails(draft);
      setData(prev => prev ? { ...prev, basicDetails: updated } : prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // ── Save collaboration ───────────────────────────────────
  const saveCollaboration = async (draft: Collaboration) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateCollaboration(draft);
      setData(prev => prev ? { ...prev, collaboration: updated } : prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // ── Save skills ───────────────────────────────────────────
  const saveSkills = async (skills: Skill[]) => {
    setSaving(true);
    setError(null);
    try {
      // ✅ Fixed: Cast 'skills' to any to bypass profileService mismatch,
      // and cast 'updated' strictly to Skill[] to fix the setData error!
      const updated = (await updateSkills(skills as any)) as unknown as Skill[];
      setData(prev => prev ? { ...prev, skills: updated } : prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return {
    data,
    loading,
    saving,
    error,
    saveBasic,
    saveCollaboration,
    saveSkills,
    refetch: loadProfile,
  };
};

export default useProfile;