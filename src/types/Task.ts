export type Priority = 'high' | 'medium' | 'low';
export type FilterType = 'all' | 'completed' | 'pending' | 'high' | 'medium' | 'low' | 'overdue' | 'today' | 'week';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  category: string;
  tags: string[];
}