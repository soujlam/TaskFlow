export type PriorityLevel = 'baixa' | 'media' | 'alta';

export type FilterStatus = 'todas' | 'pendentes' | 'concluidas';

export type TaskCategory = 'Trabalho' | 'Pessoal' | 'Estudos' | 'Finanças' | 'Saúde' | 'Outros';

export type SortOrder = 'recente' | 'antiga' | 'prioridade' | 'vencimento';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: PriorityLevel;
  category?: TaskCategory;
  dueDate?: string; // Formato YYYY-MM-DD
  createdAt: number;
  completedAt?: number;
}

export interface DeletedTaskSnapshot {
  task: Task;
  index: number;
}
