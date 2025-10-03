import { Check, Trash2, Calendar } from 'lucide-react';

const categoryColors = {
  work: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  personal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  shopping: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

export const TodoItem = ({ todo, onToggle, onDelete }) => {
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div
      className={`group flex items-center gap-3 p-4 rounded-lg border transition-all ${
        todo.completed
          ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          todo.completed
            ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500'
        }`}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && <Check className="w-4 h-4 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-base ${
            todo.completed
              ? 'line-through text-gray-500 dark:text-gray-400'
              : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {todo.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
              categoryColors[todo.category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {todo.category}
          </span>
          {todo.dueDate && (
            <span
              className={`inline-flex items-center gap-1 text-xs ${
                isOverdue
                  ? 'text-red-600 dark:text-red-400 font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Calendar className="w-3 h-3" />
              {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete todo"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};
