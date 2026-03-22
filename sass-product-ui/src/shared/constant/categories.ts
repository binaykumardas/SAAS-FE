/**
 * @file src/shared/constant/categories.ts
 * @description Centralized configuration for profile categories. 
 * Add/Remove categories here to dynamically update all dropdowns across the app.
 */

export interface CategoryOption {
  label: string;
  value: string;
}

export const SKILL_CATEGORIES: CategoryOption[] = [
  { label: 'Language', value: 'Language' },
  { label: 'Frontend', value: 'Frontend' },
  { label: 'Backend', value: 'Backend' },
  { label: 'Database', value: 'Database' },
  { label: 'Devops', value: 'Devops' },
  { label: 'Tool', value: 'Tool' },
];