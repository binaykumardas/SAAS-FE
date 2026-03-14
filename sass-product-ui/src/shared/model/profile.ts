// src/shared/model/profile.ts

// ── Existing types (unchanged) ────────────────────────────────
export interface BasicDetails {
  firstName:     string;
  lastName:      string;
  mobile:        string;
  gender:        string;
  maritalStatus: string;
  dateOfBirth:   string;
  aboutMe:       string;
  email:         string;
}

// ── New developer-specific types ─────────────────────────────

export interface DevIdentity {
  username:    string;   // @handle
  role:        string;   // e.g. Full Stack Developer
  location:    string;   // e.g. Bhubaneswar, India
  openTo:      string[]; // e.g. ['Collaborating', 'Hiring']
  topSkills:   string[]; // e.g. ['React', 'TypeScript']
  github:      string;
  linkedin:    string;
  portfolio:   string;
  twitter:     string;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Expert';

export interface Skill {
  id:       string;
  name:     string;
  level:    SkillLevel;
  category: string;
}

export interface Project {
  id:          string;
  name:        string;
  description: string;
  techStack:   string[];
  role:        'Solo' | 'Lead' | 'Contributor';
  status:      'Live' | 'In Progress' | 'Archived';
  githubUrl:   string;
  liveUrl:     string;
  lookingFor:  string[];
}

export interface Experience {
  id:          string;
  company:     string;
  role:        string;
  type:        string;
  startDate:   string;
  endDate:     string;
  description: string;
}

export interface Education {
  id:          string;
  institution: string;
  degree:      string;
  startYear:   string;
  endYear:     string;
  type:        string;
  link:        string;
}

export interface Collaboration {
  projectTypes: string[];
  lookingFor:   string[];
  availability: string;
  workStyle:    string;
  timezone:     string;
  pitch:        string;
}

export interface Achievement {
  id:          string;
  title:       string;
  type:        string;
  description: string;
  date:        string;
  link:        string;
}