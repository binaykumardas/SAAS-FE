// src/services/profileService.ts
// Simulates API calls using local JSON data.
// When you're ready for real API integration, just replace the
// fetch() calls below with your actual API endpoints — the
// hook and component code stays exactly the same.
//
// Pattern:
//   Mock  → import profileData from '../data/profile.json'
//   Real  → fetch('https://api.yourapp.com/profile')

import profileData from '../assets/json/profile.json';
import type {
  BasicDetails, Skill, Project, Experience,
  Education, Collaboration, Achievement
} from '../shared/model/profile';

// ── Simulated network delay (remove when using real API) ──────
const delay = (ms = 600) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

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
  await delay();
  // ─── Swap this block for real API call ───
  // const res = await fetch('/api/profile');
  // if (!res.ok) throw new Error('Failed to fetch profile');
  // return res.json();
  // ─────────────────────────────────────────
  return profileData as unknown as ProfileData;
};

// ── PATCH basic details ───────────────────────────────────────
// Real API equivalent: PATCH /api/profile/basic
export const updateBasicDetails = async (
  data: BasicDetails,
): Promise<BasicDetails> => {
  await delay(400);
  // ─── Swap this block for real API call ───
  // const res = await fetch('/api/profile/basic', {
  //   method:  'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body:    JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error('Failed to update basic details');
  // return res.json();
  // ─────────────────────────────────────────
  return data;
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