
export interface BasicDetails {
  firstName: string;
  lastName: string;
  mobile: string;
  gender: string;
  devType: string;
  dateOfBirth: string;
  aboutMe: string;
  email: string;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Expert';

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: string;
  proficiency?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  role: 'Solo' | 'Lead' | 'Contributor';
  status: 'Live' | 'In Progress' | 'Archived';
  githubUrl: string;
  liveUrl: string;
  lookingFor: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
  type: string;
  link: string;
}

export interface Collaboration {
  projectTypes: string[];
  lookingFor: string[];
  availability: string;
  workStyle: string;
  timezone: string;
  pitch: string;
}

export interface Achievement {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  link: string;
}

export type TabKey =
  | 'basic'
  | 'skills'
  | 'projects'
  | 'collaborate'
  | 'experience'
  | 'education'
  | 'achievements';