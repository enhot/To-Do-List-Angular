export interface IToDo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  priority: Priority;
}

export type Priority = 'low' | 'medium' | 'high';
