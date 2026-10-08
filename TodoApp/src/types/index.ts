export type Priority = 'low' | 'medium' | 'high';
export type Filter = 'all' | 'active' | 'done';
export type SortMode = 'smart' | 'deadline' | 'priority';

export interface User {
  id: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dateTime: string; // ISO string
  deadline: string; // ISO string
  priority: Priority;
  category: string;
  completed: boolean;
  createdAt: string;
}

export type NewTask = Pick<Task, 'title' | 'description' | 'dateTime' | 'deadline' | 'priority' | 'category'>;
