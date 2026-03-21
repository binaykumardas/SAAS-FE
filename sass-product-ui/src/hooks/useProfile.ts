/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @file hooks/useProfile.ts
 * @description Custom hook that manages the lifecycle of the user profile page.
 * It handles initial data loading, update synchronization, and error states.
 */

// Import React hooks for state management and lifecycle control
import { useState, useEffect, useCallback, useRef } from 'react';

// Import API service functions to communicate with the Node.js backend
import {
  fetchProfile, updateBasicDetails, updateCollaboration,
  updateSkills, updateProjects,
  updateExperiences, updateEducations, updateAchievements, 
  type ProfileData,
} from '../services/profileService';

// Import TypeScript interfaces for strict type checking of profile sections
import type { 
  BasicDetails, Collaboration, Skill, Project, 
  Experience, Education, Achievement 
} from '../shared/model/profile';

/** 
 * UseProfileReturn Interface
 * Describes exactly what objects and functions this hook provides to the UI components.
 */
interface UseProfileReturn {
  data: ProfileData | null;                    // The actual profile data from the database
  loading: boolean;                            // True only during the very first data fetch
  saving: boolean;                             // True while any "Update" API call is in progress
  error: string | null;                        // Stores human-readable error messages for the UI
  saveBasic: (draft: BasicDetails) => Promise<void>; // Handler for basic info updates
  saveCollaboration: (draft: Collaboration) => Promise<void>; // Handler for collab preference updates
  saveSkills: (skills: Skill[]) => Promise<void>; // Handler for the full skills list update
  saveProjects: (projects: Project[]) => Promise<void>; // Handler for projects list update
  saveExperiences: (experiences: Experience[]) => Promise<void>; // Handler for experience list update
  saveEducations: (educations: Education[]) => Promise<void>; // Handler for education list update
  saveAchievements: (achievements: Achievement[]) => Promise<void>; // Handler for achievements list update
  refetch: () => void;                         // Function to manually trigger a data reload
}

/** 
 * useProfile Hook
 * The central logic orchestrator for the profile feature.
 */
const useProfile = (): UseProfileReturn => {
  // Holds the main profile data object
  const [data, setData] = useState<ProfileData | null>(null);
  
  // Controls the "Skeleton" loading state on initial page entry
  const [loading, setLoading] = useState(true);
  
  // Controls the "Loading..." spinner state on Save buttons
  const [saving, setSaving] = useState(false);
  
  // Global error state for the profile page
  const [error, setError] = useState<string | null>(null);

  /** 
   * hasInitialized Ref
   * IMPORTANT: Prevents React 18 Strict Mode from calling the API twice on mount.
   * Unlike State, updating a Ref does not trigger a re-render or dependency loop.
   */
  const hasInitialized = useRef(false);

  /** 
   * loadProfile Function
   * Wrapped in useCallback so it can be passed to useEffect safely without changing on every render.
   */
  const loadProfile = useCallback(async () => {
    // 1. Set UI to loading state
    setLoading(true);
    
    // 2. Clear any previous error messages
    setError(null);
    
    try {
      // 3. Call the API service to fetch data from Express backend
      const result = await fetchProfile();
      
      // 4. On success, store the data in state
      setData(result);
    } catch (err) {
      // 5. On failure, extract the error message for the user
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      // 6. Whether success or failure, stop the loading animation
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created only once

  /**
   * Initial Mount Effect
   * Runs once when the page is first loaded.
   */
  useEffect(() => {
    // Check the ref to see if we already started the fetch
    if (!hasInitialized.current) {
      // Mark as initialized
      hasInitialized.current = true;
      
      // Trigger the fetch
      loadProfile();
    }
  }, [loadProfile]); // Depends on loadProfile function

  /** 
   * saveBasic Handler
   * Synchronizes Basic Details (Name, Bio, etc.) with the server.
   */
  const saveBasic = async (draft: BasicDetails) => {
    setSaving(true); setError(null); // Enter "Saving" state
    try {
      const updated = await updateBasicDetails(draft); // Wait for API
      // Update local state: Replace old basicDetails with the new one from server
      setData(prev => prev ? { ...prev, basicDetails: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); } // Exit "Saving" state
  };

  /** 
   * saveCollaboration Handler
   */
  const saveCollaboration = async (draft: Collaboration) => {
    setSaving(true); setError(null);
    try {
      const updated = await updateCollaboration(draft);
      setData(prev => prev ? { ...prev, collaboration: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  /** 
   * saveSkills Handler
   */
  const saveSkills = async (skills: Skill[]) => {
    setSaving(true); setError(null);
    try {
      // Send entire array to backend; cast as any to handle complex serialization if needed
      const updated = (await updateSkills(skills as any)) as unknown as Skill[];
      setData(prev => prev ? { ...prev, skills: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  /** 
   * saveProjects Handler
   */
  const saveProjects = async (projects: Project[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateProjects(projects as any)) as unknown as Project[];
      setData(prev => prev ? { ...prev, projects: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  /** 
   * saveExperiences Handler
   */
  const saveExperiences = async (experiences: Experience[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateExperiences(experiences as any)) as unknown as Experience[];
      setData(prev => prev ? { ...prev, experiences: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  /** 
   * saveEducations Handler
   */
  const saveEducations = async (educations: Education[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateEducations(educations as any)) as unknown as Education[];
      setData(prev => prev ? { ...prev, educations: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  /** 
   * saveAchievements Handler
   */
  const saveAchievements = async (achievements: Achievement[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateAchievements(achievements as any)) as unknown as Achievement[];
      setData(prev => prev ? { ...prev, achievements: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } 
    finally { setSaving(false); }
  };

  // Return the entire state and all handler functions to the Profile component
  return {
    data, loading, saving, error,
    saveBasic, saveCollaboration, saveSkills, saveProjects, saveExperiences, 
    saveEducations, saveAchievements, refetch: loadProfile,
  };
};

// Export the hook as the default export
export default useProfile;