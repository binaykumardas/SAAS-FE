/**
 * @file src/shared/constant/categories.ts
 * @description Centralized configuration for profile categories. 
 * Add/Remove categories here to dynamically update all dropdowns across the app.
 */

export interface CategoryOption {
  id:number;
  label: string;
  value: string;
}

export const SKILL_CATEGORIES: CategoryOption[] = [
  { id:1,label: 'Frontend', value: 'Frontend' },
  { id:2,label: 'Backend', value: 'Backend' },
  { id:3,label: 'Database', value: 'Database' },
  { id:4,label: 'Devops', value: 'Devops' },
  { id:5,label: 'Tool', value: 'Tool' },
];