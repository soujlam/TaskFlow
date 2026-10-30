import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, PriorityLevel, DeletedTaskSnapshot } from '../types';

const STORAGE_KEY = 'tarefasflow_tasks_v1';

const INITIAL_TASKS: Task[] = [
  {
    id: 'demo-task-1',
    title: 'Definir as 3 metas principais de hoje',
    completed: false,
    priority: 'alta',
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'demo-task-2',
    title: 'Organizar pasta de trabalho e responder mensagens',
    completed: false,
    priority: 'media',
    createdAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'demo-task-3',
    title: 'Pausa para alongamento e hidratação',
    completed: true,
    priority: 'baixa',
    createdAt: Date.now() - 3600000 * 6,
    completedAt: Date.now() - 3600000 * 3,
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === 'undefined') return INITIAL_TASKS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Falha ao ler tarefas do localStorage:', e);
    }
    return INITIAL_TASKS;
  });

  const [lastDeleted, setLastDeleted] = useState<DeletedTaskSnapshot | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Falha ao salvar tarefas no localStorage:', e);
    }
  }, [tasks]);

  const addTask = useCallback((title: string, priority: PriorityLevel = 'media'): boolean => {
    const trimmed = title.trim();
    if (!trimmed) return false;

    const newTask: Task = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: trimmed,
      completed: false,
      priority,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    return true;
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? Date.now() : undefined,
          };
        }
        return task;
      })
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => {
      const index = prev.findIndex((t) => t.id === id);
      if (index === -1) return prev;
      const taskToDelete = prev[index];

      // Save for Undo
      setLastDeleted({ task: taskToDelete, index });

      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
      undoTimeoutRef.current = setTimeout(() => {
        setLastDeleted(null);
      }, 6000);

      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const restoreLastDeleted = useCallback(() => {
    if (!lastDeleted) return;

    setTasks((prev) => {
      const next = [...prev];
      const insertAt = Math.min(Math.max(lastDeleted.index, 0), next.length);
      next.splice(insertAt, 0, lastDeleted.task);
      return next;
    });

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
    setLastDeleted(null);
  }, [lastDeleted]);

  const dismissUndo = useCallback(() => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
    setLastDeleted(null);
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  const editTaskTitle = useCallback((id: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t))
    );
  }, []);

  const updateTaskPriority = useCallback((id: string, newPriority: PriorityLevel) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: newPriority } : t))
    );
  }, []);

  return {
    tasks,
    addTask,
    toggleTask,
    removeTask,
    restoreLastDeleted,
    dismissUndo,
    lastDeleted,
    clearCompleted,
    editTaskTitle,
    updateTaskPriority,
  };
}
