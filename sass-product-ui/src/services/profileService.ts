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

/**
 * @description Creates or Updates a single experience entry in the database.
 * If isNew is true, performs a POST request. If false, performs a PUT request.
 */
export const saveExperienceEntry = async (data: Experience, isNew: boolean): Promise<Experience> => {
  // Construct payload mapping to your backend model
  const PAYLOAD = {
    userId: profileID,
    companyName: data.company,
    jobTitle: data.role,
    employmentType: data.type,
    startDate: data.startDate,
    endDate: data.endDate,
    description: data.description
  };

  try {
    let response;
    
    if (isNew) {
      // API INTEGRATION: POST - Create new experience
      const url = `${BASE_URL}${API}${API_VERSION}/experiences`;
      response = await axios.post(url, PAYLOAD);
    } else {
      // API INTEGRATION: PUT - Update existing experience
      const url = `${BASE_URL}${API}${API_VERSION}/experiences/${data.id}`;
      response = await axios.put(url, PAYLOAD);
    }

    if (Util.isValidObject(response?.data?.data)) {
      return response.data.data as Experience;
    }
    throw new Error("Server updated successfully, but no data was returned.");
  } catch (error: any) {
    console.error('[SERVICE ERROR] saveExperienceEntry:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to save experience');
  }
};

/**
 * @description Saves an education entry using ONLY the POST API.
 * http://localhost:3000/api/v1/profile/:id/education
 */
export const saveEducationEntry = async (data: Education): Promise<Education> => {
  // Get the profileID from session storage
  const userInfo = Util.getDataFromSessionStore('userInfo');
  const profileID = userInfo?.id;

  // Construct payload mapping to your backend model
  const PAYLOAD = {
    institution: data.institution,
    degree: data.degree,
    fieldOfStudy: data.type,
    startDate: data.startYear,
    endDate: data.endYear,
    link: data.link
  };

  try {
    // API INTEGRATION: POST ONLY
    const url = `${BASE_URL}${API}${API_VERSION}/education/${profileID}`;
    const response = await axios.post(url, PAYLOAD);

    if (Util.isValidObject(response?.data?.data)) {
      return response.data.data as Education;
    }
    throw new Error("Server saved successfully, but no data was returned.");
  } catch (error: any) {
    console.error('[SERVICE ERROR] saveEducationEntry:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to save education');
  }
};

/**
 * @description Saves an achievement entry using ONLY the POST API.
 * http://localhost:3000/api/v1/achievements
 */
export const saveAchievementEntry = async (data: Achievement): Promise<Achievement> => {
  const userInfo = Util.getDataFromSessionStore('userInfo');
  const profileID = userInfo?.id;

  if (!profileID) throw new Error("User ID missing. Please log in again.");

  // Map the draft data. 
  // IMPORTANT: We include userId in the payload since it's not in the URL!
  const PAYLOAD = {
    userId: profileID, 
    title: data.title || "Untitled Achievement",
    type: data.type || "Award",
    date: data.date || "",
    description: data.description || "",
    link: data.link || ""
  };

  try {
    // API INTEGRATION: POST ONLY
    const url = `${BASE_URL}${API}${API_VERSION}/achievements`;
    
    console.log("Sending POST Achievement Payload:", PAYLOAD);
    
    const response = await axios.post(url, PAYLOAD, { 
      headers: { 'Content-Type': 'application/json' } 
    });

    if (Util.isValidObject(response?.data?.data)) {
      return response.data.data as Achievement;
    }
    throw new Error("Server saved successfully, but no data was returned.");
  } catch (error: any) {
    console.error('[SERVICE ERROR] saveAchievementEntry:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to save achievement');
  }
};