/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TaskCategory {
  WORK = 'work',
  STUDY = 'study',
  PERSONAL = 'personal',
  SPORT = 'sport',
  APPOINTMENTS = 'appointments',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  createdAt: number;
  notificationFired?: boolean;
}

export interface CategorySpec {
  id: TaskCategory;
  name: string;
  iconName: string;
  color: string; // Tailwind class
  bg: string;    // Tailwind background class
  border: string; // Tailwind border class
  text: string;   // Tailwind text class
}

export const CATEGORIES: Record<TaskCategory, CategorySpec> = {
  [TaskCategory.WORK]: {
    id: TaskCategory.WORK,
    name: 'عمل',
    iconName: 'Briefcase',
    color: 'bg-indigo-500',
    bg: 'bg-indigo-50/80 dark:bg-indigo-950/40',
    border: 'border-indigo-100 dark:border-indigo-900',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
  [TaskCategory.STUDY]: {
    id: TaskCategory.STUDY,
    name: 'دراسة',
    iconName: 'BookOpen',
    color: 'bg-amber-500',
    bg: 'bg-amber-50/80 dark:bg-amber-950/40',
    border: 'border-amber-100 dark:border-amber-900',
    text: 'text-amber-700 dark:text-amber-400',
  },
  [TaskCategory.PERSONAL]: {
    id: TaskCategory.PERSONAL,
    name: 'شخصي',
    iconName: 'User',
    color: 'bg-emerald-500',
    bg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
    border: 'border-emerald-100 dark:border-emerald-900',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  [TaskCategory.SPORT]: {
    id: TaskCategory.SPORT,
    name: 'رياضة',
    iconName: 'Dumbbell',
    color: 'bg-rose-500',
    bg: 'bg-rose-50/80 dark:bg-rose-950/40',
    border: 'border-rose-100 dark:border-rose-900',
    text: 'text-rose-600 dark:text-rose-400',
  },
  [TaskCategory.APPOINTMENTS]: {
    id: TaskCategory.APPOINTMENTS,
    name: 'مواصفات / مواعيد',
    iconName: 'CalendarDays',
    color: 'bg-sky-500',
    bg: 'bg-sky-50/80 dark:bg-sky-950/40',
    border: 'border-sky-100 dark:border-sky-900',
    text: 'text-sky-600 dark:text-sky-400',
  },
};

export interface PrioritySpec {
  id: TaskPriority;
  name: string;
  color: string;
  bgStr: string;
  textStr: string;
  level: number;
}

export const PRIORITIES: Record<TaskPriority, PrioritySpec> = {
  [TaskPriority.HIGH]: {
    id: TaskPriority.HIGH,
    name: 'عالية',
    color: 'bg-red-500',
    bgStr: 'bg-red-50 dark:bg-red-950/20',
    textStr: 'text-red-600 dark:text-red-400',
    level: 3,
  },
  [TaskPriority.MEDIUM]: {
    id: TaskPriority.MEDIUM,
    name: 'متوسطة',
    color: 'bg-amber-500',
    bgStr: 'bg-amber-50 dark:bg-amber-950/20',
    textStr: 'text-amber-600 dark:text-amber-400',
    level: 2,
  },
  [TaskPriority.LOW]: {
    id: TaskPriority.LOW,
    name: 'منخفضة',
    color: 'bg-slate-400',
    bgStr: 'bg-slate-50 dark:bg-slate-900/40',
    textStr: 'text-slate-500 dark:text-slate-400',
    level: 1,
  },
};
