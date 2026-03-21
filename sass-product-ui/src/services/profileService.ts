// src/services/profileService.ts
// Simulates API calls using local JSON data.
// When you're ready for real API integration, just replace the
// fetch() calls below with your actual API endpoints — the
// hook and component code stays exactly the same.
//
// Pattern:
//   Mock  → import profileData from '../data/profile.json'
//   Real  → fetch('https://api.yourapp.com/profile')

import axios from 'axios';
import type {
  BasicDetails, Skill, Project, Experience,
  Education, Collaboration, Achievement
} from '../shared/model/profile';
import { API, API_VERSION, BASE_URL } from '../shared/constant/const';
import Util from '../shared/utils/utils';

// ── Simulated network delay (remove when using real API) ──────
const delay = (ms = 600) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

const userInfo = Util.getDataFromSessionStore('userInfo');
const profileID = userInfo?.id;

// ── Full profile response shape ───────────────────────────────
export interface ProfileData {
  basicDetails:  BasicDetails;
  skills:        Skill[];
  projects:      Project[];
  experiences:   Experience[];
  educations:    Education[];
  collaboration: Collaboration;
  achievements:  Achievement[];
}

// ── GET full profile ──────────────────────────────────────────
// Real API equivalent: GET /api/profile
export const fetchProfile = async (): Promise<ProfileData> => {
  // http://localhost:3000/api/v1/profile/1
  // ─── Swap this block for real API call ───
  // const res = await fetch('/api/profile');
  // if (!res.ok) throw new Error('Failed to fetch profile');
  // return res.json();
  // ─────────────────────────────────────────
  try {
    const response = await axios.get(BASE_URL + API + API_VERSION + `/profile/${profileID}`);
    if(Util.isValidObject(response) && Util.isValidObject(response.data) && Util.isValidObject(response.data.data)) {
      const PROFILE_DATA = response.data.data;
      return PROFILE_DATA as ProfileData;
    } 
    throw new Error(response.data?.message || 'Failed to retrieve profile data from server');

  } catch(e) {
    console.error(e);
    throw new Error('Failed to fetch profile');
  }
};

// ── PATCH basic details ───────────────────────────────────────
// Real API equivalent: PATCH /api/profile/basic
/**
 * @file profileService.ts
 * @description Updates the user's basic demographic information in the database.
 * @param {BasicDetails} data - The updated data from the modal form.
 * @returns {Promise<BasicDetails>} The updated record returned by the server.
 */
export const updateBasicDetails = async (
  data: BasicDetails,
): Promise<BasicDetails> => {
  
  // 1. Retrieve the User ID from the session storage to construct the URL
  const userInfo = Util.getDataFromSessionStore('userInfo');
  const profileID = userInfo?.id;

  // 2. Map the Frontend 'BasicDetails' structure to the Backend's expected Payload
  // Note: Backend expects 'phoneNumber', Frontend uses 'mobile'.
  const PAYLOAD = {
    firstName: data.firstName,
    lastName: data.lastName,
    phoneNumber: data.mobile,
    devType: data.devType,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    aboutMe: data.aboutMe
  };

  try {
    // 3. Perform the PUT request to the specific profile endpoint
    const url = `${BASE_URL}${API}${API_VERSION}/profile/${profileID}/basic-details`;
    const response = await axios.put(url, PAYLOAD);

    // 4. Validate the response structure using our Util helper
    if (Util.isValidObject(response?.data?.data)) {
      // Success: Return the newly saved data to the hook
      return response.data.data as BasicDetails;
    }

    // 5. If data is missing even though the request technically finished
    throw new Error('Server updated successfully but returned no data.');

  } catch (error: any) {
    // 6. ERROR HANDLING
    // Log the error for developers
    console.error('[SERVICE ERROR] updateBasicDetails:', error);

    // Extract the message from the backend (if available) or use a fallback
    const message = error.response?.data?.message || error.message || 'Failed to update basic details';

    // 7. THROWING THE ERROR
    // This is the FIX for the TypeScript error. 
    // By throwing, the function never reaches an "undefined" return state.
    throw new Error(message);
  }
};

// ── PATCH collaboration preferences ──────────────────────────
// Real API equivalent: PATCH /api/profile/collaboration
export const updateCollaboration = async (
  data: Collaboration,
): Promise<Collaboration> => {
  await delay(400);
  // ─── Swap this block for real API call ───
  // const res = await fetch('/api/profile/collaboration', {
  //   method:  'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body:    JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error('Failed to update collaboration');
  // return res.json();
  // ─────────────────────────────────────────
  return data;
};

export const updateSkills = async (
  data: Skill,
): Promise<Skill> => {
  await delay(400);
  // ─── Swap this block for real API call ───
  // const res = await fetch('/api/profile/skills', {
  //   method:  'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body:    JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error('Failed to update skills');
  // return res.json();
  // ─────────────────────────────────────────
  return data;
}

export const updateProjects = async (
  data: Project,
): Promise<Project> => {
  await delay(400);
  // ─── Swap this block for real API call ───
  // const res = await fetch('/api/profile/projects', {
  //   method:  'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body:    JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error('Failed to update projects');
  // return res.json();
  // ─────────────────────────────────────────
  return data;
}

export const updateExperiences = async (
  data: Experience,
): Promise<Experience> => {
  await delay(400);
  // ─── Swap this block for real API call ───
  // const res = await fetch('/api/profile/experiences', {
  //   method:  'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body:    JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error('Failed to update experiences');
  // return res.json();
  // ─────────────────────────────────────────
  return data;
}

export const updateEducations = async (
  data: Education,
): Promise<Education> => {
  await delay(400);
  // ─── Swap this block for real API call ───
  // const res = await fetch('/api/profile/educations', {
  //   method:  'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body:    JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error('Failed to update educations');
  // return res.json();
  // ─────────────────────────────────────────
  return data;
}

export const updateAchievements = async (
  data: Achievement,
): Promise<Achievement> => {
  await delay(400);
  // ─── Swap this block for real API call ───
  // const res = await fetch('/api/profile/achievements', {
  //   method:  'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body:    JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error('Failed to update achievements');
  // return res.json();
  // ─────────────────────────────────────────
  return data;
}