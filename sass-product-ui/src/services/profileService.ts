// src/services/profileService.ts
import axios from 'axios';
import type {
  BasicDetails, Skill, Project, Experience,
  Education, Collaboration, Achievement
} from '../shared/model/profile';
import { API, API_VERSION, BASE_URL } from '../shared/constant/const';
import Util from '../shared/utils/utils';

// Helper for simulated network delay for mocked endpoints
const delay = (ms = 600) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Get user info from session storage
const userInfo = Util.getDataFromSessionStore('userInfo');
const profileID = userInfo?.id;

export interface ProfileData {
  basicDetails:  BasicDetails;
  skills:        Skill[];
  projects:      Project[];
  experiences:   Experience[];
  educations:    Education[];
  collaboration: Collaboration;
  achievements:  Achievement[];
}

// ─────────────────────────────────────────────────────────────
// 1. FETCH FULL PROFILE
// ─────────────────────────────────────────────────────────────
export const fetchProfile = async (): Promise<ProfileData> => {
  try {
    const response = await axios.get(`${BASE_URL}${API}${API_VERSION}/profile/${profileID}`);
    if (Util.isValidObject(response) && Util.isValidObject(response.data) && Util.isValidObject(response.data.data)) {
      return response.data.data as ProfileData;
    } 
    throw new Error(response.data?.message || 'Failed to retrieve profile data from server');
  } catch(e) {
    console.error(e);
    throw new Error('Failed to fetch profile');
  }
};

// ─────────────────────────────────────────────────────────────
// 2. UPDATE BASIC DETAILS
// ─────────────────────────────────────────────────────────────
export const updateBasicDetails = async (data: BasicDetails): Promise<BasicDetails> => {
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
    const url = `${BASE_URL}${API}${API_VERSION}/profile/${profileID}/basic-details`;
    const response = await axios.put(url, PAYLOAD);

    if (Util.isValidObject(response?.data?.data)) return response.data.data as BasicDetails;
    throw new Error('Server updated successfully but returned no data.');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to update basic details');
  }
};

// ─────────────────────────────────────────────────────────────
// 3. CREATE / UPDATE PROJECT (POST & PUT)
// ─────────────────────────────────────────────────────────────
/**
 * @description Creates or Updates a single project in the database.
 * If isNew is true, performs a POST request. If false, performs a PUT request.
 */
export const saveProjectEntry = async (data: Project, isNew: boolean): Promise<Project> => {
  const PAYLOAD = {
    userId: profileID,
    projectName: data.name,
    description: data.description,
    techStack: data.techStack,
    role: data.role,
    status: data.status,
    githubUrl: data.githubUrl,
    liveUrl: data.liveUrl,
    lookingFor: data.lookingFor
  };

  try {
    let response;
    
    if (isNew) {
      // POST - Create new project
      const url = `${BASE_URL}${API}${API_VERSION}/projects`;
      response = await axios.post(url, PAYLOAD);
    } else {
      // PUT - Update existing project
      const url = `${BASE_URL}${API}${API_VERSION}/projects/${data.id}`;
      response = await axios.put(url, PAYLOAD);
    }

    if (Util.isValidObject(response?.data?.data)) {
      return response.data.data as Project;
    }
    throw new Error("Server updated successfully, but no data was returned.");
  } catch (error: any) {
    console.error('[SERVICE ERROR] saveProjectEntry:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to save project');
  }
};

// ─────────────────────────────────────────────────────────────
// 4. UPDATE SKILLS
// ─────────────────────────────────────────────────────────────
export const updateSkills = async (data: Skill[]): Promise<Skill[]> => {
  const PAYLOAD = { skills: data.map((s) => ({ name: s.name, category: s.category, proficiency: s.level })) };
  try {
    const response = await axios.put(`${BASE_URL}${API}${API_VERSION}/profile/${profileID}/skills`, PAYLOAD);
    if(Util.isValidObject(response?.data?.data)) return response.data.data.skills as Skill[];
    throw new Error("Server updated successfully, but no data was returned.");
  } catch(e:any) {
    throw new Error(e.response?.data?.message || e.message || 'Failed to update skills');
  }
}

// ─────────────────────────────────────────────────────────────
// MOCKED ENDPOINTS (Update these later when APIs are ready)
// ─────────────────────────────────────────────────────────────
export const updateCollaboration = async (data: Collaboration): Promise<Collaboration> => {
  const PAYLOAD = {
      myPitch: data.pitch,
      projectTypes: data.projectTypes,
      lookingFor: data.lookingFor,
      availability: data.availability,
      workStyle: data.workStyle,
      timeZone: data.timezone
  }
  const response = await axios.put(`${BASE_URL}${API}${API_VERSION}/profile/${profileID}/collaboration`, PAYLOAD);
  try {
    if(Util.isValidObject(response)) {
      return response?.data?.data;
    } else {
      throw new Error("Server updated successfully, but no data was returned.");
    }
  } catch(e:any) {
    console.error(e);
    throw new Error(e.response?.data?.message || e.message || 'Failed to update collaboration');
  }
};

export const updateExperiences = async (data: Experience[]): Promise<Experience[]> => {
  await delay(400); return data;
};

export const updateEducations = async (data: Education[]): Promise<Education[]> => {
  await delay(400); return data;
};

export const updateAchievements = async (data: Achievement[]): Promise<Achievement[]> => {
  await delay(400); return data;
};