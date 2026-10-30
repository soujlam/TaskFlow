import React from 'react';
import { RotateCcw, X, Trash2 } from 'lucide-react';
import { DeletedTaskSnapshot } from '../types';

interface UndoToastProps {
  deletedSnapshot: DeletedTaskSnapshot | null;
  onUndo: () => void;
  onDismiss: () => void;
}

export const UndoToast: React.FC<UndoToastProps> = ({
  deletedSnapshot,
  onUndo,
  onDismiss,
}) => {
  if (!deletedSnapshot) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl shadow-slate-900/20 max-w-[92vw] sm:max-w-md w-full border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 dark:text-rose-600 flex items-center justify-center shrink-0">
        <Trash2 className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">
          Tarefa removida: &ldquo;{deletedSnapshot.task.title}&rdquo;
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onUndo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Desfazer</span>
        </button>

        <button
          onClick={onDismiss}
          aria-label="Fechar notificação"
          className="p-1.5 text-slate-400 hover:text-white dark:hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
