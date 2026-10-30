export type PriorityLevel = 'baixa' | 'media' | 'alta';

export type FilterStatus = 'todas' | 'pendentes' | 'concluidas';

export type SortOrder = 'recente' | 'antiga' | 'prioridade';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: PriorityLevel;
  createdAt: number;
  completedAt?: number;
}

export interface DeletedTaskSnapshot {
  task: Task;
  index: number;
}
