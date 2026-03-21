/* eslint-disable @typescript-eslint/no-explicit-any */

// Import React hooks for managing state and lifecycle events
import { useState, useEffect, useCallback } from 'react';

// Import the service functions that make actual HTTP calls to your Node.js/Express backend
import {
  fetchProfile, updateBasicDetails, updateCollaboration,
  updateSkills, updateProjects,
  updateExperiences, updateEducations, updateAchievements, 
  type ProfileData,
} from '../services/profileService';

// Import TypeScript interfaces to ensure data types match between frontend and backend
import type { BasicDetails, Collaboration, Skill, Project, Experience, Education, Achievement } from '../shared/model/profile';

/** 
 * Define the structure of the object that this hook will return to the UI components
 */
interface UseProfileReturn {
  data: ProfileData | null; // The full profile object (Basic info, Experience, etc.)
  loading: boolean;         // True while the profile is being fetched for the first time
  saving: boolean;          // True while an update API call is in progress
  error: string | null;     // Stores any error messages received from the backend

  // Function definitions for updating various parts of the profile
  saveBasic: (draft: BasicDetails) => Promise<void>;
  saveCollaboration: (draft: Collaboration) => Promise<void>;
  saveSkills: (skills: Skill[]) => Promise<void>;
  saveProjects: (projects: Project[]) => Promise<void>;
  saveExperiences: (experiences: Experience[]) => Promise<void>;
  saveEducations: (educations: Education[]) => Promise<void>;
  saveAchievements: (achievements: Achievement[]) => Promise<void>;
  refetch: () => void;      // Manually trigger a fresh load of the profile data
}

/** 
 * The main Custom Hook function
 */
const useProfile = (): UseProfileReturn => {
  // State to hold the profile data once retrieved from the database
  const [data, setData] = useState<ProfileData | null>(null);
  // State to track if the initial page load is still happening
  const [loading, setLoading] = useState(true);
  // State to track if a "Save" button operation is currently running
  const [saving, setSaving] = useState(false);
  // State to store error messages to display to the user
  const [error, setError] = useState<string | null>(null);

  /** 
   * Function to load the profile from the API.
   * useCallback prevents this function from being recreated on every render.
   */
  const loadProfile = useCallback(async () => {
    setLoading(true); // Start the loading spinner
    setError(null);   // Clear any previous errors
    try {
      const result = await fetchProfile(); // Call the Express API (GET /profile/:id)
      setData(result);                     // Store the fetched data in state
    } catch (err) {
      // Capture error message from backend or network
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  }, []);

  // Trigger the profile load automatically when the component first mounts
  useEffect(() => { loadProfile(); }, [loadProfile]);

  /** 
   * Sends updated Basic Details (Name, Phone, etc.) to the backend
   */
  const saveBasic = async (draft: BasicDetails) => {
    setSaving(true); setError(null); // Show "Saving..." status
    try {
      const updated = await updateBasicDetails(draft); // Call Express API (PUT /basic-details)
      // Update local state: keep everything the same, but replace 'basicDetails' with the new version
      setData(prev => prev ? { ...prev, basicDetails: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  /** 
   * Sends updated Collaboration preferences to the backend
   */
  const saveCollaboration = async (draft: Collaboration) => {
    setSaving(true); setError(null);
    try {
      const updated = await updateCollaboration(draft); // Call Express API (PUT /collaboration)
      setData(prev => prev ? { ...prev, collaboration: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  /** 
   * Sends updated Skills list to the backend
   */
  const saveSkills = async (skills: Skill[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateSkills(skills as any)) as unknown as Skill[];
      setData(prev => prev ? { ...prev, skills: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  /** 
   * Sends updated Projects list to the backend
   */
  const saveProjects = async (projects: Project[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateProjects(projects as any)) as unknown as Project[];
      setData(prev => prev ? { ...prev, projects: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  /** 
   * Sends updated Experience list to the backend
   */
  const saveExperiences = async (experiences: Experience[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateExperiences(experiences as any)) as unknown as Experience[];
      setData(prev => prev ? { ...prev, experiences: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  /** 
   * Sends updated Education list to the backend
   */
  const saveEducations = async (educations: Education[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateEducations(educations as any)) as unknown as Education[];
      setData(prev => prev ? { ...prev, educations: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  /** 
   * Sends updated Achievements list to the backend
   */
  const saveAchievements = async (achievements: Achievement[]) => {
    setSaving(true); setError(null);
    try {
      const updated = (await updateAchievements(achievements as any)) as unknown as Achievement[];
      setData(prev => prev ? { ...prev, achievements: updated } : prev);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setSaving(false); }
  };

  // Return all states and functions to the UI component using the hook
  return {
    data, loading, saving, error,
    saveBasic, saveCollaboration, saveSkills, saveProjects, saveExperiences, saveEducations, saveAchievements, refetch: loadProfile,
  };
};

export default useProfile;