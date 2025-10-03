import { useState, useMemo, useCallback, useEffect } from 'react';
import { Moon, Sun, CheckCircle2 } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useTodos } from './hooks/useTodos';
import { TodoItem } from './components/TodoItem';
import { AddTodoForm } from './components/AddTodoForm';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';

const categories = ['work', 'personal', 'shopping'];

function TodoApp() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);

      const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || todo.category === selectedCategory;

      return matchesFilter && matchesSearch && matchesCategory;
    });
  }, [todos, filter, searchQuery, selectedCategory]);

  const handleAddTodo = useCallback(
    (title, category, dueDate) => {
      addTodo(title, category, dueDate);
    },
    [addTodo]
  );

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Todo List
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            aria-label="Toggle theme"
            title="Toggle theme (Ctrl+D)"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <AddTodoForm onAdd={handleAddTodo} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-900">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Active</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-xl border border-green-200 dark:border-green-900">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.completed}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">Completed</p>
            </div>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Categories
            </h3>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filters</h3>
              {stats.completed > 0 && (
                <button
                  onClick={clearCompleted}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Clear completed
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'completed']).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === f
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'No todos match your filters'
                    : 'No todos yet. Add one to get started!'}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TodoApp />
    </ThemeProvider>
  );
}

export default App;
